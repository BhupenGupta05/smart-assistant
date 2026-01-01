import { useEffect, useRef } from "react";
import { useWeatherFetch } from "../hooks/useWeatherFetch";

export const useWeather = ({ position }) => {
    const { weather, loading, error, fetchWeather } = useWeatherFetch();

    const abortRef = useRef(null);
    const retryTimerRef = useRef(null);

    // 🔁 Fetch on position change
    useEffect(() => {
        if (!position?.lat || !position?.lng) return;

        abortRef.current?.abort();
        
        const controller = new AbortController();
        abortRef.current = controller;

        fetchWeather(position.lat, position.lng, controller.signal);

        return () => controller.abort();
    }, [position, fetchWeather]);

    // 🔁 Retry on error
    useEffect(() => {
        if (!error || !position) return;

        retryTimerRef.current = window.setInterval(() => {
            abortRef.current?.abort();

            const controller = new AbortController();
            abortRef.current = controller;
            fetchWeather(position.lat, position.lng, controller.signal);
        }, 15000);

        return () => {
            if (retryTimerRef.current) {
                clearInterval(retryTimerRef.current);
            }
        };
    }, [error, position, fetchWeather]);

    // Global unmount cleanup 
    useEffect(() => {
        return () => {
            abortRef.current?.abort();
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
