const express = require('express');
const axios = require('axios');
const polyline = require('@mapbox/polyline');
const router = express.Router();

// Emission factors per mode in grams CO2 per km
const EMISSION_FACTORS = {
    driving: 171,   // average car (g/km)
    transit: 105,   // bus/train average (g/km)
    walking: 0,     // walking emits nothing
    cycling: 0      // cycling emits nothing
};


router.get('/', async (req, res) => {
    try {
        const { origin, destination, modes = "driving,walking,transit" } = req.query;

        if (!origin || !destination || origin === 'null,null') {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const modeList = modes.split(",").map(m => m.trim()).filter(Boolean);

        const fetchMode = async (mode) => {
            const url = `${process.env.BASE_URL}/directions/json?origin=${encodeURIComponent(
                origin
            )}&destination=${encodeURIComponent(destination)}&mode=${mode}&departure_time=now&key=${process.env.GOOGLE_MAPS_API_KEY}`;

            const { data } = await axios.get(url);

            // console.log("DATA FETCHED: ", data);


            if (data.status !== 'OK' || !data.routes.length) return null;


            const route = data.routes[0];
            const leg = route.legs?.[0];
            const coords = route.overview_polyline?.points ? polyline.decode(route.overview_polyline.points).map(([lat, lng]) => [lat, lng]) : [];

            // Calculate emissions
            const distance_km = (leg?.distance?.value ?? 0) / 1000;
            const emission_grams = (EMISSION_FACTORS[mode] ?? 0) * distance_km;

            return {
                mode,
                summary: route.summary || null,
                distance_meters: leg?.distance?.value ?? null,
                duration_seconds: leg?.duration?.value ?? null,
                duration_in_traffic_seconds: leg?.duration_in_traffic?.value ?? null,
                fare: route.fare ? { value: route.fare.value, currency: route.fare.currency } : null,
                warnings: route.warnings || [],
                bounds: route.bounds || null,
                coords,
                emission_grams
            };
        }
        const routes = (await Promise.all(modeList.map(fetchMode))).filter(Boolean);

        // Sort by duration (fastest first)
        routes.sort((a, b) => (a.duration_seconds ?? 1e12) - (b.duration_seconds ?? 1e12));

        res.json({ routes });
    } catch (error) {
        console.error("Directions error:", error);
        if (error.response?.status === 429) {
            res.status(429).json({ error: 'Rate limit exceeded. Please try again in a moment.' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
})

module.exports = router;