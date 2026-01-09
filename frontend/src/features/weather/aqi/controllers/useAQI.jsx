import { useEffect, useRef } from "react";
import { useAQIFetch } from "../hooks/useAQIFetch";

export const useAQI = ({ position }) => {
    const { aqi, loading, error, fetchAQI } = useAQIFetch();

    const abortRef = useRef(null);
    const retryTimerRef = useRef(null);

    // 🔁 Fetch on position change
    useEffect(() => {
        if (!position?.lat || !position?.lng) return;

        abortRef.current?.abort();
        
        const controller = new AbortController();
        abortRef.current = controller;

        fetchAQI(position.lat, position.lng, controller.signal);

        return () => controller.abort();
    }, [position, fetchAQI]);

    // 🔁 Retry on error
    useEffect(() => {
        if (!error || !position) return;

        retryTimerRef.current = window.setInterval(() => {
            abortRef.current?.abort();

            const controller = new AbortController();
            abortRef.current = controller;
            fetchAQI(position.lat, position.lng, controller.signal);
        }, 15000);

        return () => {
            if (retryTimerRef.current) {
                clearInterval(retryTimerRef.current);
            }
        };
    }, [error, position, fetchAQI]);

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
        aqi,
        loading,
        error
    };
};
