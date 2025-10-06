const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { aiRequestLimiter } = require('../middlewares/rateLimiter')

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5000',
    'X-Title': 'Smart Assistant',
  },
});

const systemPrompt = {
  role: "system",
  content: `You are a helpful in-app smart assistant for a geolocation-based web application...
  (rest of your long instructions here)
  `
};

// MAKING THE CHATBOT AWARE OF THE APP CONTEXT
// const systemPrompt = {
//   role: "system",
//   content: 
// You are a helpful in-app smart assistant for a geolocation-based web application.

// The app allows users to:
// - Search for places or locations
// - See current air quality index (AQI) based on their coordinates
// - View different categories of POIs (Points of Interest) like restaurants, hospitals, ATMs, transit stations, etc.
// - Toggle a transit layer (only when 'transit_station' is selected)
// - Recenter the map to their current location or a selected place
// - See detailed POIs with markers, popups, and a sidebar
// - Use a search bar to set position or focus on a place

// Your responsibilities:
// - Understand user queries about locations, POIs, air quality, and map navigation
// - Use the provided functions to execute user requests
// - Always respond conversationally to acknowledge the user's request
// - IMPORTANT: Use ONLY function calls for actions, never include bracket commands like [MOVE_TO:] in your text responses

// Function usage guidelines:
// - For location/place requests (e.g., "take me to Paris", "go to Tokyo", "navigate to the airport"): Use move_to_location function
// - For POI category requests (e.g., "find restaurants", "show hospitals", "locate gas stations"): Use set_poi_type function  
// - For transit layer requests (e.g., "show metro stations", "display transit"): Use toggle_transit_layer function
// - For current location requests (e.g., "go back", "my location", "recenter"): Use move_to_location with "current"
// - For air quality queries: Simply inform the user that AQI data will be displayed based on their location

// POI categories available:
// - restaurant, cafe, bar, fast_food
// - hospital, pharmacy, clinic
// - gas_station, charging_station
// - bank, atm
// - hotel, lodging
// - transit_station, bus_station
// - shopping_mall, supermarket
// - school, university
// - park, museum, tourist_attraction

// Examples of correct responses:
// User: "Find nearby restaurants"
// Assistant: "I'll show you nearby restaurants in your area!" [Uses set_poi_type function with poi: "restaurant"]

// User: "Take me to New York"
// Assistant: "I'll navigate you to New York right away!" [Uses move_to_location function with location: "New York"]

// User: "Show me gas stations"
// Assistant: "I'll display nearby gas stations for you." [Uses set_poi_type function with poi: "gas_station"]

// User: "Go back to my location"
// Assistant: "I'll recenter the map to your current location." [Uses move_to_location function with location: "current"]

// User: "What's the air quality here?"
// Assistant: "I'll check the air quality at your current location. The AQI data will be displayed on your map."

// User: "Show me walking directions from Connaught Place to Red Fort"
// Assistant: "I'll get you walking directions from Connaught Place to Red Fort." (show_route with origin="Connaught Place", destination="Red Fort", mode="walking")

// Always be conversational, friendly, and confirm what action you're taking while using the appropriate functions.

// };

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
            description: "Search radius in meters (default 2000)"
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

router.post('/', aiRequestLimiter, async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
      tools,
      tool_choice: 'auto',
      temperature: 0.7,
    });

    console.log("BACKEND raw response:", JSON.stringify(response, null, 2));

    const choice = response.choices[0];
    const hasToolCalls = Array.isArray(choice.message.tool_calls) && choice.message.tool_calls.length > 0;

    console.log("BACKEND parsed choice:", JSON.stringify(choice, null, 2));


    res.json({
      reply: choice.message.content || (hasToolCalls ? "Executing your request..." : "I didn't understand that request."),
      tool_calls: hasToolCalls ? choice.message.tool_calls : []
    });

  } catch (error) {
    console.error(error);
    if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again in a moment.' });
    } else if (error.response?.status >= 500) {
      res.status(500).json({ error: 'OpenRouter service unavailable. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Something went wrong with the AI assistant.' });
    }
  }
});

module.exports = router;

