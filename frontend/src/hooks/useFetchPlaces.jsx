import { useEffect, useRef, useState } from "react";
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

export const useFetchPlaces = (inputVal) => {
    const [results, setResults] = useState([]);
    const suppressRef = useRef(false);

    const isOnline = useNetwork();

    const suppressNextFetch = () => {
        suppressRef.current = true;
    };

    useEffect(() => {
        if (!isOnline) {
            setResults([]);
            return;
        }

        // skip ONE fetch after programmatic update
        if (suppressRef.current) {
            suppressRef.current = false;
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
    }, [inputVal, isOnline]);

    return {
        results,
        suppressNextFetch
    };
}