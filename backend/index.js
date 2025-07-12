require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// In-memory cache to store results
const cache = new Map();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.get('/api/nearby', async (req, res) => {
    const { lat, lng, type } = req.query;
    const key = `${lat},${lng},${type}`;

    if(cache.has(key)) {
        console.log("Returning cached POIs");
        return res.json(cache.get(key));
    }

    const url = `${process.env.BASE_URL}/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    try {
        const {data} = await axios.get(url);
        // console.log(data.results);
        

        if(data.status !== 'OK') {
            console.error("Google Maps Error:", data.status);
            return res.status(500).json({ error: 'Failed to get results from Google Maps' });
        }

        const simplifiedResults = data.results.map((place) => ({
            name: place.name,
            place_id: place.place_id,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            address: place.vicinity,
            user_ratings_total: place.user_ratings_total || 'NA',
            rating: place.rating || 'NA',
            opening_hours: place.opening_hours?.open_now ?? 'NA'
        }))

        cache.set(key, simplifiedResults);
        res.json(simplifiedResults);
    } catch (error) {
        console.error("Error fetching from Google Maps:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/api/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `${process.env.BASE_URL}/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

    // console.log("Google Geocoding URL:", url);

    try {
        const { data } = await axios.get(url);
        // console.log(data.results);
        

        if (data.status !== 'OK') {
            console.error("Google Maps Error:", data.status);
            return res.status(500).json({ error: 'Failed to get results from Google Maps' });
        }

        const simplifiedResults = data.results.map((place) => ({
            address: place.formatted_address,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
        }));

        // console.log(simplifiedResults);
        

        res.json(simplifiedResults);
    } catch (error) {
        console.error("Error fetching from Google Maps:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);
