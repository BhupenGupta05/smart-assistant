import { useState } from "react";

export const useAutocompleteSearch = (initialQuery = null) => {
    const [query, setQuery] = useState(initialQuery?.address || "");
    const [place, setPlace] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const cacheRef = useRef(new Map());

    // Handle search query input and fetch results
    const handleSearch = async (searchQuery) => {
        if (!searchQuery || searchQuery.length < 3) return [];

        const key = searchQuery.toLowerCase().trim();
        if (cacheRef.current.has(key)) {
            console.log("Cached result found for query:", searchQuery);
            const cached = cacheRef.current.get(key);
            setResults(cached);
            return cached;
        }

        try {
            setLoading(true);
            const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(searchQuery)}`;
            const { data } = await axios.get(url);

            // console.log("Search result", data);


            setResults(data);
            cacheRef.current.set(key, data);
            return data;
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        if (query.trim() !== "") {
            const timer = setTimeout(() => handleSearch(query), 300);
            return () => clearTimeout(timer);
        } else {
            setResults([]);
            return;
        }
    }, [query]);

    // Handle place selection
    const handlePlaceSelect = (place) => {
        if (place?.lat === null || place?.lng === null) return;
        
        setPlace(place);
        setQuery(place.address);
        setResults([]);

        setShowResults(false);
    };

    const setFromExterenal = async (query) => {
        const data = await handleSearch(query);
        if(data.length > 0) handlePlaceSelect(data[0]);
    }

    return {
        query,
        setQuery,
        results,
        showResults,
        setShowResults,
        loading,
        place,
        handlePlaceSelect,
        setFromExterenal
    }
}