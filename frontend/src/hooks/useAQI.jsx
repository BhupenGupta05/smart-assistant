import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CACHE_TTL = 600000

export const useAQI = (lat, lon) => {
    const [aqi, setAqi] = useState(null); // Store AQI value
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cacheRef = useRef(new Map()); // Cache to store previously fetched AQI values


    // Refetch AQI when coordinates change or on error every 5 seconds
    useEffect(() => {
        if (!lat || !lon) return;

        const controller = new AbortController();
        const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        // USING WITH A PROXY SERVER
        const url = `${import.meta.env.VITE_BASE_URL}/api/aqi?lat=${lat}&lon=${lon}`;


        // Function to fetch AQI data
        const fetchAQI = async () => {

            // SERVE FROM CACHE IF AVAILABLE
            const cached = cacheRef.current.get(key);
            const now = Date.now();

            if(cached && now - cached.timestamp < CACHE_TTL) {
                setAqi(cacheRef.current.get(key));
                return;
            }

            setLoading(true);

            try {
                const { data } = await axios.get(url, { signal: controller.signal });

                if (data?.aqi !== undefined) {
                    setAqi(data.aqi);
                    cacheRef.current.set(key, { data: data.aqi, timestamp: now });
                } else {
                    setAqi(null);
                    setError(new Error('Invalid AQI data'));
                }
            } catch (err) {
                if (err.name === 'CanceledError') return;
                setError(err);
                setAqi(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAQI();
        
        const interval = setInterval(() => {
            if (error) fetchAQI();

        }, 15000);

        return () => {
            controller.abort();
            clearInterval(interval)
        };
    }, [lat, lon, error]);

    return { aqi, loading, error };
};
