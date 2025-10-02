import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const useAQI = (lat, lon) => {
    const [aqi, setAqi] = useState(null); // Store AQI value
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cacheRef = useRef(new Map()); // Cache to store previously fetched AQI values

    // Function to fetch AQI data
    const fetchAQI = async () => {
        if (!lat || !lon) return;

        const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
        // USING WITH A PROXY SERVER
        const url = `${import.meta.env.VITE_BASE_URL}/api/aqi?lat=${lat}&lon=${lon}`;

        if (cacheRef.current.has(key)) {
            setAqi(cacheRef.current.get(key));
            return;
        }
        setLoading(true);

        try {
            const { data } = await axios.get(url);

            if (data?.aqi !== undefined) {
                setAqi(data.aqi);
                cacheRef.current.set(key, data.aqi);
            } else {
                setAqi(null);
                setError(new Error('Invalid AQI data'));
            }
        } catch (err) {
            setError(err);
            setAqi(null);
        } finally {
            setLoading(false);
        }
    };

    // Refetch AQI when coordinates change or on error every 5 seconds
    useEffect(() => {
        if (!lat || !lon) return;

        fetchAQI();
        const interval = setInterval(() => {
            if (error) {
                fetchAQI();
            }

        }, 5000);

        return () => clearInterval(interval);
    }, [lat, lon, error]);

    return { aqi, loading, error };
};
