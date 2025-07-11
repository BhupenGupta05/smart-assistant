import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const useAQI = (lat, lon) => {
    const [aqi, setAqi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cacheRef = useRef(new Map());

    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_AQI_API_KEY}`

    useEffect(() => {
        if (!lat || !lon) return;

        const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        if(cacheRef.current.has(key)) {
            setAqi(cacheRef.current.get(key));
            return;
        }

        const fetchAQI = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(url);
                setAqi(data); 
                setError(null);
                cacheRef.current.set(key, data);
            } catch (err) {
                setError("Failed to fetch AQI");
                setAqi(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAQI();
    }, [lat, lon]);

    return { aqi, loading, error };
};
