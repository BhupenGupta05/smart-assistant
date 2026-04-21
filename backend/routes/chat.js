const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { aiRequestLimiter } = require('../middlewares/rateLimiter')
const { systemPrompt } = require('../chat/systemPrompt')

const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES = 50;
const MAX_CONTEXT_MESSAGES = 20;
const MAX_TOTAL_LENGTH = 8000;

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5000',
    'X-Title': 'Smart Assistant',
  },
});


const tools = [
  {
    type: "function",
    function: {
      name: "set_poi_type",
      description: "Set the category of POIs to display on the map",
      parameters: {
        type: "object",
        properties: {
          poi: {
            type: "string",
            enum: [
              "restaurant", "cafe", "bar", "fast_food",
              "hospital", "pharmacy", "clinic",
              "gas_station", "charging_station",
              "bank", "atm",
              "hotel", "lodging",
              "transit_station", "bus_station",
              "shopping_mall", "supermarket",
              "school", "university",
              "park", "museum", "tourist_attraction"
            ]
          }
        },
        required: ["poi"],
      }
    }
  },
  {
    type: "function",
    function: {
      name: "move_to_location",
      description: "Navigate the map to a location or current position",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string" }
        },
        required: ["location"],
      }
    }
  },
  {
    type: "function",
    function: {
      name: "toggle_transit_layer",
      description: "Toggle the transit layer on the map",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "search_poi",
      description: "Search for nearby places of interest (POIs) with optional filters like type, keyword, open_now). Returns list of places.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Free-text search query, e.g. 'vegan cafe', 'restaurants with noodles'"
          },
          type: {
            type: "string",
            description: "Place type (optional). Examples: restaurant, cafe, bar, hospital, gym"
          },
          open_now: {
            type: "boolean",
            description: "Whether to filter by currently open places"
          },
          radius: {
            type: "number",
            description: "Search radius in meters. Accepts values between 500-5000. Default is 1500 if not specified.",
            minimum: 500,
            maximum: 5000
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "set_directions",
      description: "Set origin and destination for directions",
      parameters: {
        type: "object",
        properties: {
          origin: {
            type: "string",
            description: "The starting point address"
          },
          destination: {
            type: "string",
            description: "The destination address"
          },
          mode: {
            type: "string",
            enum: ["driving", "walking", "transit"],
            default: "driving"
          }
        },
        required: ["origin", "destination"]
      }
    }
  }



];

router.post('/', aiRequestLimiter, async (req, res, next) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const filtered = messages.filter(
    (m) => m && ['user', 'assistant'].includes(m.role)
  );

  if (filtered.length === 0) {
    return res.status(400).json({ error: 'No valid messages provided' });
  }

  if (filtered.length > MAX_MESSAGES) {
    return res.status(400).json({
      error: `Too many messages. Max allowed is ${MAX_MESSAGES}`,
    });
  }

  for (const m of filtered) {
    const content = String(m.content || '');

    if (content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Each message must be under ${MAX_MESSAGE_LENGTH} characters`,
      });
    }
  }


  const trimmed = filtered.slice(-MAX_CONTEXT_MESSAGES);


  const sanitized = trimmed.map((m) => ({
    role: m.role,
    content: String(m.content || ''),
  }));


  const totalLength = sanitized.reduce(
    (sum, m) => sum + m.content.length,
    0
  );

  if (totalLength > MAX_TOTAL_LENGTH) {
    return res.status(400).json({
      error: 'Conversation too large. Please start a new chat.',
    });
  }


  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...sanitized],
      tools,
      tool_choice: 'auto',
      temperature: 0.7,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const choice = response.choices[0];
    const hasToolCalls = Array.isArray(choice.message.tool_calls) && choice.message.tool_calls.length > 0;

    // Validate radius values in tool calls
    if (hasToolCalls) {
      choice.message.tool_calls = choice.message.tool_calls.map(toolCall => {
        if (toolCall.function.name === 'search_poi') {
          try {
            const args = JSON.parse(toolCall.function.arguments);

            if (args.radius) {
              // Ensure radius is within bounds (500-5000)
              args.radius = Math.min(Math.max(args.radius, 500), 5000);
              toolCall.function.arguments = JSON.stringify(args);
            }
          } catch (e) {
            console.error('Error parsing search_poi arguments:', e);
          }
        }
        return toolCall;
      });
    }

    res.json({
      reply: choice.message.content || (hasToolCalls ? "Executing your request..." : "I didn't understand that request."),
      tool_calls: hasToolCalls ? choice.message.tool_calls : []
    });

  } catch (error) {
    console.error(error);
    if (error.name === 'AbortError') {
      return res.status(408).json({
        error: 'Request timed out. Please try again.',
      });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again in a moment.' });
    }
    if (error.response?.status >= 500) {
      return res.status(500).json({ error: 'OpenRouter service unavailable. Please try again later.' });
    }
    error.context = 'AI_CHAT_FAILURE';
    next(error);
  }
});

module.exports = router;

