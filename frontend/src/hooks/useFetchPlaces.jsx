import { useEffect, useState } from "react";
import axios from "axios";

const DEBOUNCE_DELAY = 300;

export const useFetchPlaces = (inputVal, justSelectedRef) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (justSelectedRef?.current) {
            justSelectedRef.current = false;
            return;
        }

        if (!inputVal || inputVal.length < 3) {
            setResults([]);
            return;
        }
        const handler = setTimeout(async () => {
            try {
                const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(inputVal)}`;
                const { data } = await axios.get(url);
                setResults(data);
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            }
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [inputVal, justSelectedRef]);

    return results;
}