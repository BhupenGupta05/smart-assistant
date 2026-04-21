const express = require('express');
const router = express.Router();
const axiosInstance = require('../utils/axiosInstance');

router.post('/', async (req, res, next) => {
  const { query, type, open_now = false, radius = 1500, location } = req.body;

  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({ error: "location is required {lat, lng}" });
  }

  try {
    const url = `${process.env.BASE_URL}/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&keyword=${encodeURIComponent(query)}${open_now ? "&opennow=true" : ""}${type ? `&type=${type}` : ""}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const { data } = await axiosInstance.get(url);


    if (data.status === "ZERO_RESULTS") {
      return res.json({
        results: [],
        next_page_token: null
      });
    }

    if (data.status !== "OK") {
      return res.status(400).json({
        error: data.status,
        details: data.error_message
      });
    }


    res.json({
      results: data.results,
      next_page_token: data.next_page_token || null
    });


  } catch (error) {
    error.context = 'POI_SEARCH_FAILED';

    if (error.status === 429) {
      return res.status(429).json({ error: error.message });
    }

    if (error.status === 408) {
      return res.status(408).json({ error: error.message });
    }

    next(error);
  }
});


module.exports = router;

