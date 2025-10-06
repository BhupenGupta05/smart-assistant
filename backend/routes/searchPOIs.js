const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { query, type, open_now = false, radius = 2000, location } = req.body;
  console.log("REQUEST BODY:", req.body);


  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({ error: "location is required {lat, lng}" });
  }

  try {
    const url = `${process.env.BASE_URL}/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&keyword=${encodeURIComponent(query)}${open_now ? "&opennow=true" : ""}${type ? `&type=${type}` : ""}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const { data } = await axios.get(url);

    console.log("DATA:", data);


    if (data.status !== "OK") {
      return res.status(400).json({ error: data.status, details: data.error_message });
    }

    res.json({
      results: data.results,
      next_page_token: data.next_page_token || null
    });


  } catch (error) {
    console.error("POI search error:", error.message);
    if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again in a moment.' });
    } else {
      res.status(500).json({ error: "Failed to fetch POIs" });
    }

  }
});


module.exports = router;

