import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const useAQI = (lat, lon) => {
    const [aqi, setAqi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cacheRef = useRef(new Map());

    // USING WITH A PROXY SERVER
    const url = `${import.meta.env.VITE_BASE_URL}/api/aqi?lat=${lat}&lon=${lon}`;

    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;

    const fetchAQI = async () => {
        if (!lat || !lon) return;

        if (cacheRef.current.has(key)) {
            setAqi(cacheRef.current.get(key));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(url);
            const data = await res.json();

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


    useEffect(() => {

        if(!lat || !lon) return;

        fetchAQI();


        // RETRY EVERY 5 SECONDS IF ERROR OCCURS OR COORDS CHANGE
        const interval = setInterval(() => {
            if(error) {
                fetchAQI();
            }
            
        }, 5000);

        return () => clearInterval(interval);
    }, [lat, lon, error]);

    return { aqi, loading, error };
};
