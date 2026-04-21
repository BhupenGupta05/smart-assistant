require('dotenv').config();
const express = require('express');
const axiosInstance = require('./utils/axiosInstance');
const { LRUCache } = require('lru-cache');
const cors = require('cors');
const chatRoute = require('./routes/chat');
const poiRoute = require('./routes/searchPOIs');
const directionsRoute = require('./routes/directions');
const { tileRateLimiter, requestLimiter } = require('./middlewares/rateLimiter');
const { validateCoordinates } = require('./utils/validation');
const { calculateAQI } = require('./utils/calculateAQI');

// LRU CACHE TO STORE POI, AQI, WEATHER AND SEARCH RESULTS
const poiCache = new LRUCache({ max: 500, ttl: 1000 * 60 * 5 });
const aqiCache = new LRUCache({ max: 300, ttl: 1000 * 60 * 5 });
const searchCache = new LRUCache({ max: 300, ttl: 1000 * 60 * 5 });
const photoCache = new LRUCache({
    max: 200,
    maxSize: 50 * 1024 * 1024, // 50MB
    sizeCalculation: (value) => value.length,
    ttl: 1000 * 60 * 60,
});

const weatherCache = new LRUCache({ max: 300, ttl: 1000 * 60 * 5 }); //new

const app = express();


app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use(requestLimiter);

app.use('/api/chat', chatRoute);

app.use('/api/search_poi', poiRoute);

app.use('/api/directions', directionsRoute);

// PROXY ROUTE
app.get('/api/tiles/:z/:x/:y', tileRateLimiter, async (req, res, next) => {
    const { x, y, z } = req.params;

    if (![x, y, z].every(v => /^\d+$/.test(v))) {
        return res.status(400).json({ error: 'Invalid tile parameters' });
    }

    const url = `https://tile.thunderforest.com/transport/${z}/${x}/${y}.png?apikey=${process.env.THUNDERFOREST_API_KEY}`;

    try {
        const response = await axiosInstance.get(url, { responseType: 'stream' });
        res.setHeader('Content-Type', 'image/png');
        response.data.pipe(res);
    } catch (error) {
        if (error.status === 429) {
            return res.status(429).json({ error: error.message });
        }

        if (error.status >= 500) {
            return res.status(502).json({ error: 'Thunderforest service unavailable' });
        }

        next(error);
    }
})

app.get('/api/weather', async (req, res, next) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat/lon parameters' });
    }

    const validation = validateCoordinates(lat, lon);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const key = `${validation.latitude.toFixed(4)},${validation.longitude.toFixed(4)}`;

    // Serve from cache if recent
    if (weatherCache.has(key)) {
        return res.json(weatherCache.get(key));
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${validation.latitude}&lon=${validation.longitude}&units=metric&appid=${process.env.OPENWEATHER_AQI_API_KEY}`;

    try {
        const { data } = await axiosInstance.get(url);

        const response = {
            location: {
                lat: validation.latitude,
                lon: validation.longitude,
            },
            weather: {
                condition: data.weather?.[0]?.main ?? 'Unknown',
                icon: data.weather?.[0]?.icon ?? null,
                temperature: Number(data.main?.temp ?? 0),
                feels_like: Number(data.main?.feels_like ?? 0),
                humidity: Number(data.main?.humidity ?? 0),
                visibilityKm: data.visibility ? +(data.visibility / 1000).toFixed(1) : null,
                wind: {
                    speed: Number(data.wind?.speed ?? 0),
                    direction: Number(data.wind?.deg ?? 0)
                }
            },
            meta: {
                units: 'metric',
                provider: 'OpenWeather',
                timestamp: Date.now()
            }
        };

        weatherCache.set(key, response);

        res.json(response);
    } catch (error) {

        error.context = 'WEATHER_FETCH_FAILED';
        next(error);
    }
})

// PROXY ROUTE
app.get('/api/aqi', async (req, res, next) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat/lon parameters' });
    }

    const validation = validateCoordinates(lat, lon);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const key = `${validation.latitude.toFixed(4)},${validation.longitude.toFixed(4)}`;

    // Serve from cache if recent
    if (aqiCache.has(key)) {
        return res.json(aqiCache.get(key));
    }

    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${validation.latitude}&lon=${validation.longitude}&appid=${process.env.OPENWEATHER_AQI_API_KEY}`;

    try {
        const { data } = await axiosInstance.get(url);


        const entry = data?.list?.[0];
        if (!entry) {
            return res.status(502).json({ error: 'Invalid AQI response' });
        }

        const pm25 = entry.components?.pm2_5;
        const aqiOWM = entry.main?.aqi;

        if (pm25 == null) {
            return res.status(502).json({ error: 'PM2.5 data missing' });
        }

        const actualAQI = calculateAQI(pm25);

        const result = {
            aqi: actualAQI,        // ← REAL AQI (0–500)
            category: aqiOWM,      // ← OpenWeatherMap index (1–5)
            pm25,
            pm10: entry.components.pm10
        };

        aqiCache.set(key, result);
        res.json(result);
    } catch (error) {

        error.context = 'AQI_FETCH_FAILED';
        next(error);
    }
})

// PROXY: Place Photo
app.get('/api/place-photo', async (req, res, next) => {
    const { photoRef } = req.query;

    if (!photoRef) {
        return res.status(400).json({ error: 'Missing photoRef parameter' });
    }

    if (!/^[A-Za-z0-9_-]{20,}$/.test(photoRef)) {
        return res.status(400).json({ error: 'Invalid photo reference' });
    }


    // CACHE HIT
    const cached = photoCache.get(photoRef);
    if (cached) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('x-cache', 'HIT');
        return res.send(cached);
    }

    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    // FETCH IMAGE AS A WHOLE
    try {
        const response = await axiosInstance.get(url, { responseType: 'arraybuffer' });

        const buffer = Buffer.from(response.data);
        photoCache.set(photoRef, buffer);
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(buffer);
    } catch (err) {
        err.context = 'PLACE_PHOTO_FETCH_FAILED';
        next(err);
    }
});


app.get('/api/nearby', async (req, res, next) => {
    const { lat, lng, type, radius } = req.query;

    if (!lat || !lng || !type) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const validation = validateCoordinates(lat, lng);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    let searchRadius = 1500; // default
    if (radius) {
        const parsedRadius = parseInt(radius);
        if (!isNaN(parsedRadius) && parsedRadius > 0) {
            // Optional: Add min/max bounds
            searchRadius = Math.min(Math.max(parsedRadius, 500), 5000); // Between 500m and 5km
        }
    }

    const latKey = validation.latitude.toFixed(2);
    const lngKey = validation.longitude.toFixed(2);
    const key = `${latKey},${lngKey},${type},${searchRadius}`;

    if (poiCache.has(key)) {
        console.log(`Returning cached POIs for radius ${searchRadius}m`);
        return res.json(poiCache.get(key));
    }

    const url = `${process.env.BASE_URL}/place/nearbysearch/json?location=${validation.latitude},${validation.longitude}&radius=${searchRadius}&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    try {
        const { data } = await axiosInstance.get(url);

        if (data.status !== 'OK') {
            return next({
                status: 400,
                message: data.error_message || data.status,
                context: 'GOOGLE_API_ERROR'
            });
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
            opening_hours: place.opening_hours?.open_now ?? 'NA',
            phone: place.international_phone_number || place.formatted_phone_number || 'NA'
        }))

        poiCache.set(key, simplifiedResults);
        res.json(simplifiedResults);
    } catch (error) {

        error.context = 'NEARBY_POI_FETCH';
        next(error);
    }
})

// NEW TEXT SEARCH-BASED SEARCH (FETCHES DETAILED PLACE INFO)
app.get('/api/search', async (req, res, next) => {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Invalid query' });
    }

    const safeQuery = query.trim().replace(/[^\w\s,.-]/g, "");

    if (safeQuery.length < 2 || safeQuery.length > 80) {
        return res.status(400).json({ error: 'Invalid query' });
    }

    const cacheKey = safeQuery.toLowerCase();

    if (searchCache.has(cacheKey)) {
        return res.json(searchCache.get(cacheKey));
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    try {
        // Step 1: Text Search (more flexible than geocode)
        const searchUrl = `${process.env.BASE_URL}/place/textsearch/json?query=${encodeURIComponent(safeQuery)}&key=${apiKey}`;
        const searchResponse = await axiosInstance.get(searchUrl);
        

        if (searchResponse.data.status !== 'OK') {
            return res.status(400).json({
                error: "Google API Error",
                status: searchResponse.data.status,
                message: searchResponse.data.error_message || null
            });
        }

        const candidates = searchResponse.data.results;

        // Step 2: Fetch details for top candidate (you can expand this to multiple)
        const detailedResults = await Promise.all(
            candidates.slice(0, 3).map(async (place) => {
                const detailsUrl = `${process.env.BASE_URL}/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,photo,rating,user_ratings_total,opening_hours,website,formatted_phone_number,place_id&key=${apiKey}`;
                const detailsRes = await axiosInstance.get(detailsUrl);

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
        searchCache.set(cacheKey, filteredResults);
        res.json(filteredResults);
    } catch (error) {
        error.context = 'TEXT_SEARCH_FAILED';
        next(error);
    }
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('Uncaught error:', {
        method: req.method,
        url: req.originalUrl,
        message: err.message,
        context: err.context
    });

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
