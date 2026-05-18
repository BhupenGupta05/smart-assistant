import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeatherData } from "../service/fetchWeatherData";
import useNetwork from "../../network/hooks/useNetwork";

export const useWeather = ({ position }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isOnline = useNetwork();

    const cacheRef = useRef(new Map());
    const retryTimerRef = useRef(null);

    const loadWeather = useCallback(async (signal) => {
        if (!position?.lat || !position?.lng) return;

        setLoading(true);
        setError(null);

        try {
            const data = await fetchWeatherData({
                lat: position.lat,
                lon: position.lng,
                signal,
                isOnline,
                cacheRef
            });

            setWeather(data);
        } catch (err) {
            if (
                err.name === "CanceledError" ||
                err.name === "AbortError"
            ) {
                return;
            }

            setError(err);
            setWeather(null);
        } finally {
            setLoading(false);
        }
    }, [position, isOnline]);


    // Fetch on position change

    useEffect(() => {
        if (!position?.lat || !position?.lng) return;

        const controller = new AbortController();

        loadWeather(controller.signal);

        return () => {
            controller.abort();
        };
    }, [position, loadWeather]);


    // Retry on error

    useEffect(() => {
        if (!error || !position) return;

        retryTimerRef.current = window.setInterval(() => {
            const controller = new AbortController();

            loadWeather(controller.signal);
        }, 15000);

        return () => {
            if (retryTimerRef.current) {
                clearInterval(retryTimerRef.current);
            }
        };
    }, [error, position, loadWeather]);

    // Cleanup on unmount

    useEffect(() => {
        return () => {
            if (retryTimerRef.current) {
                clearInterval(retryTimerRef.current);
            }
        };
    }, []);

    return {
        weather,
        loading,
        error
    };
};
