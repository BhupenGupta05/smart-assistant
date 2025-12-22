import { useState, useRef, useCallback, useEffect } from "react";
import { searchPlaces } from "../search.api";

export default function useSearchController({ externalQuery, onExternalQueryChange, onSelectPlace, onSetPosition }) {
    const [internalQuery, setInternalQuery] = useState("");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const cacheRef = useRef(new Map());

    // Single source of truth decided here
    const effectiveQuery =
        externalQuery !== undefined && externalQuery !== null
            ? externalQuery
            : internalQuery;

    const search = useCallback(async (query) => {
        if (!query || query.length < 3) return [];
        const key = query.toLowerCase().trim();

        if (cacheRef.current.has(key)) {
            const cached = cacheRef.current.get(key);
            setResults(cached);
            return cached;
        }

        const data = await searchPlaces(query);
        cacheRef.current.set(key, data);
        setResults(data);
        return data;
    }, [])

    // Debounced search
    useEffect(() => {
        if (!effectiveQuery.trim()) {
            setResults([]);
            return;
        }
        const timer = setTimeout(() => search(effectiveQuery), 300);

        return () => clearTimeout(timer);

    }, [effectiveQuery, search]);

    const updateQuery = (value) => {
        if (externalQuery !== undefined) {
            onExternalQueryChange(value);
        } else {
            setInternalQuery(value);
        }
    };

    const selectPlace = (place) => {
        if (!place?.lat || !place?.lng) return;

        onSelectPlace(place);
        onSetPosition([place.lat, place.lng]);
        updateQuery(place.address);
        setResults([]);
        setShowResults(false);
    }

    const searchAndSelectFirst = async (query) => {
        const res = await search(query);
        if (!res.length) return false;

        selectPlace(res[0]);
        return true;
    }

    return {
        value: effectiveQuery,
        results,
        showResults,
        setShowResults,
        updateQuery,
        selectPlace,
        searchAndSelectFirst
    };
}
