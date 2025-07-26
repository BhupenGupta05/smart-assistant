const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // important!
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5000', // change to your frontend URL in production
    'X-Title': 'Smart Assistant',
  },
});

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenRouter error:', error);
    res.status(500).json({ error: 'Something went wrong with OpenRouter' });
  }
});

module.exports = router;
