require('dotenv').config();
const express = require('express');
// const { WebSocketServer } = require('ws');
const axios = require('axios');
const cors = require('cors');
const chatRoute = require('./routes/chat');
const poiRoute = require('./routes/searchPOIs');
const directionsRoute = require('./routes/directions');

const app = express();
// const server = require('http').createServer(app);

// In-memory cache to store POI results
const cache = new Map();

// In-memory cache to store AQI results
const aqiCache = new Map();

// In-memory cache to store search results
const searchCache = new Map();

// Optional: Set cache expiration in ms
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes


app.use(cors());
app.use(express.json());


// app.get('/', (req, res) => {
//     res.send('Welcome to the backend server!');
// });

app.use('/api/chat', chatRoute);

app.use('/api/search_poi', poiRoute);

app.use('/api/directions', directionsRoute);

// PROXY ROUTE
app.get('/api/tiles/:z/:x/:y', async (req, res) => {
    const { x, y, z } = req.params;

    const url = `https://tile.thunderforest.com/transport/${z}/${x}/${y}.png?apikey=${process.env.THUNDERFOREST_API_KEY}`;

    try {
        const response = await axios.get(url, { responseType: 'stream' });
        res.setHeader('Content-Type', 'image/png');
        response.data.pipe(res);
    } catch (error) {
        console.error('Tile fetch error:', error.message);
        res.status(500).json({ error: 'Failed to fetch tile' });
    }
})

// PROXY ROUTE
app.get('/api/aqi', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat/lon parameters' });
    }

    const key = `${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)}`;
    const now = Date.now();

    // Serve from cache if recent
    if (aqiCache.has(key)) {
        const { timestamp, data } = aqiCache.get(key);
        if (now - timestamp < CACHE_DURATION) {
            return res.json(data);
        }
    }

    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_AQI_API_KEY}`;

    try {
        const { data } = await axios.get(url);

        const result = { aqi: data.list[0].main.aqi };
        aqiCache.set(key, { timestamp: now, data: result });
        // console.log("AQI fetched and cached:", result);

        res.json(result);
    } catch (error) {
        console.error('AQI fetch error:', error.message);
        res.status(500).json({ error: 'Failed to fetch AQI' });
    }
})

// PROXY: Place Photo
app.get('/api/place-photo', async (req, res) => {
    const { photoRef } = req.query;

    // console.log("QUERY: ", photoRef);

    if (!photoRef) {
        return res.status(400).json({ error: 'Missing photoRef parameter' });
    }

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await axios.get(url, { responseType: 'stream' });

        res.setHeader('Content-Type', 'image/jpeg');
        response.data.pipe(res);
    } catch (err) {
        console.error('Photo fetch error:', err.message);
        res.status(500).json({ error: 'Failed to fetch photo' });
    }
});


app.get('/api/nearby', async (req, res) => {
    const { lat, lng, type } = req.query;
    const key = `${lat},${lng},${type}`;

    if (cache.has(key)) {
        console.log("Returning cached POIs");
        return res.json(cache.get(key));
    }

    const url = `${process.env.BASE_URL}/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    try {
        const { data } = await axios.get(url);
        // console.log(data.results);


        if (data.status !== 'OK') {
            console.error("Google Maps Error:", data.status);
            return res.status(500).json({ error: 'Failed to get results from Google Maps' });
        }

        const simplifiedResults = data.results.map((place) => ({
            name: place.name,
            place_id: place.place_id,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            address: place.vicinity,
            photos: place.photos,
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


// OLD GEOCODE-BASED SEARCH (FETCHES ONLY ADDRESS, LAT, LNG)
// app.get('/api/search', async (req, res) => {
//     const { query } = req.query;

//     if (!query) {
//         return res.status(400).json({ error: 'Missing query parameter' });
//     }

//     const cacheKey = query.trim().toLowerCase();
//     const now = Date.now();

//     // Serve from cache if fresh
//     if (searchCache.has(cacheKey)) {
//         const { timestamp, data } = searchCache.get(cacheKey);
//         if (now - timestamp < CACHE_DURATION) {
//             console.log("Returning cached search result");
//             return res.json(data);
//         }
//     }


//     const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//     const url = `${process.env.BASE_URL}/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

//     // console.log("Google Geocoding URL:", url);

//     try {
//         const { data } = await axios.get(url);
//         // console.log(data.results);


//         if (data.status !== 'OK') {
//             console.error("Google Maps Error:", data.status);
//             return res.status(500).json({ error: 'Failed to get results from Google Maps' });
//         }

//         const simplifiedResults = data.results.map((place) => ({
//             address: place.formatted_address,
//             lat: place.geometry.location.lat,
//             lng: place.geometry.location.lng,
//         }));

//         // console.log(simplifiedResults);

//         // Cache the result
//         searchCache.set(cacheKey, { timestamp: now, data: simplifiedResults });


//         res.json(simplifiedResults);
//     } catch (error) {
//         console.error("Error fetching from Google Maps:", error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// NEW TEXT SEARCH-BASED SEARCH (FETCHES DETAILED PLACE INFO)
app.get('/api/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
    }

    const cacheKey = query.trim().toLowerCase();
    const now = Date.now();

    if (searchCache.has(cacheKey)) {
        const { timestamp, data } = searchCache.get(cacheKey);
        if (now - timestamp < CACHE_DURATION) {
            console.log("Returning cached search result");
            return res.json(data);
        }
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    try {
        // Step 1: Text Search (more flexible than geocode)
        const searchUrl = `${process.env.BASE_URL}/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
        const searchResponse = await axios.get(searchUrl);

        if (searchResponse.data.status !== 'OK') {
            console.error("Google Maps Search Error:", searchResponse.data.status);
            return res.status(500).json({ error: 'Failed to get results from Google Maps' });
        }

        const candidates = searchResponse.data.results;

        // Step 2: Fetch details for top candidate (you can expand this to multiple)
        const detailedResults = await Promise.all(
            candidates.slice(0, 3).map(async (place) => {
                const detailsUrl = `${process.env.BASE_URL}/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,photo,rating,user_ratings_total,opening_hours,website,formatted_phone_number,place_id&key=${apiKey}`;
                const detailsRes = await axios.get(detailsUrl);

                if (detailsRes.data.status === 'OK') {
                    const p = detailsRes.data.result;
                    return {
                        name: p.name,
                        address: p.formatted_address,
                        lat: p.geometry.location.lat,
                        lng: p.geometry.location.lng,
                        place_id: p.place_id,
                        photos: p.photos,
                        rating: p.rating || 'NA',
                        user_ratings_total: p.user_ratings_total || 'NA',
                        opening_hours: p.opening_hours?.open_now ?? 'NA',
                        website: p.website,
                        phone: p.formatted_phone_number,
                    };
                }
                return null;
            })
        );

        const filteredResults = detailedResults.filter(Boolean);

        // Cache and return
        searchCache.set(cacheKey, { timestamp: now, data: filteredResults });
        res.json(filteredResults);
    } catch (error) {
        console.error("Error fetching from Google Maps:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
