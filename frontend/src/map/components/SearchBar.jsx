import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const SearchBar = forwardRef(({ query = '', setQuery, setPosition, setSelectedPlace }, ref) => {
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [internalQuery, setInternalQuery] = useState(''); // fallback local query
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
        }
    };

    // Debounced search
    useEffect(() => {
        const effectiveQuery = setQuery ? query : internalQuery;
        if (effectiveQuery.trim() !== "") {
            const timer = setTimeout(() => handleSearch(effectiveQuery), 300);
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [query, internalQuery]);

    // Handle place selection
    const handlePlaceSelect = (place) => {
        if(place?.lat === null || place?.lng === null) return;
        
        setSelectedPlace(place);
        setPosition([place.lat, place.lng]);
        setResults([]);

        // ✅ Keep place name in the input box
        if (setQuery) setQuery(place.address);
        else setInternalQuery(place.address);

        setShowResults(false);
    };


    useImperativeHandle(ref, () => ({
        searchLocationAndSelectFirst: async (location) => {
            try {
                const searchResults = await handleSearch(location);
                if (searchResults.length === 0) return false;

                const place = searchResults[0];
                setSelectedPlace(place);
                setPosition([place.lat, place.lng]);

                // ✅ Also set input box text to location name
                if (setQuery) setQuery(place.address);
                else setInternalQuery(place.address);

                return true;
            } catch (err) {
                console.error("Failed to search and select:", err);
                return false;
            }
        }
    }));

    return (
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-1/3'>
            <div className='relative w-full'>
                <input
                    type="text"
                    className='w-full p-2 rounded bg-white shadow-md border-slate-200 text-sm focus:outline-none font-medium'
                    placeholder='Search...'
                    value={setQuery ? query : internalQuery}
                    onChange={(e) => {
                        if (setQuery) setQuery(e.target.value);
                        else setInternalQuery(e.target.value);
                    }}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 150)}
                />

                <button className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer'>
                    <Search size={18} />
                </button>
            </div>

            {showResults && results.length > 0 && (
                <div className='bg-white rounded mt-1 max-h-60 overflow-y-auto shadow-md'>
                    {results.map((place, idx) => (
                        <div
                            key={idx}
                            className='p-2 font-medium cursor-pointer hover:bg-slate-300 text-sm border-slate-200 border-[1px]'
                            onMouseDown={() => handlePlaceSelect(place)}
                        >
                            📍 {place.address}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default SearchBar;
