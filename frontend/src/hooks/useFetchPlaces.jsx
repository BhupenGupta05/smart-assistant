import { useEffect, useState } from "react";
import useNetwork from "../features/network/hooks/useNetwork";
import axios from "axios";

export async function fetchPlaces(query, signal) {
    if (!query || query.length < 3) return [];

    try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, { signal });
        return data || [];
    } catch (err) {
        if (axios.isCancel?.(err) || err.name === "CanceledError") {
            return [];
        }
        console.error("fetchPlaces error:", err);
        return [];
    }
}


const DEBOUNCE_DELAY = 300;

export const useFetchPlaces = (inputVal, justSelectedRef) => {
    const [results, setResults] = useState([]);
    const isOnline = useNetwork();

    useEffect(() => {
        if (!isOnline) {
            setResults([]);
            return;
        }
        if (justSelectedRef?.current) {
            justSelectedRef.current = false;
            return;
        }

        if (!inputVal || inputVal.length < 3) {
            setResults([]);
            return;
        }

        const controller = new AbortController();

        const handler = setTimeout(async () => {
            try {
                const places = await fetchPlaces(inputVal, controller.signal);
                setResults(places);
            } catch (err) {
                // already handled in fetchPlaces
            }
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(handler);
            controller.abort();
        };
    }, [inputVal, justSelectedRef, isOnline]);

    return results;
}