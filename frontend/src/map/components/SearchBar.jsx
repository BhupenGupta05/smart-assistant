import { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { Search } from 'lucide-react';

const SearchBar = ({ query, setQuery, setPosition, setSelectedPlace }) => {
    const [results, setResults] = useState([]); // Store search results
    const [showResults, setShowResults] = useState(false); // Control visibility of suggestions dropdown
    const cacheRef = useRef(new Map());

    // DEBOUNCE FUNCTION
    // const debounceRef = useRef(null);

    // const triggerSearch = () => {
    //     if (debounceRef.current) clearTimeout(debounceRef.current);
    //     debounceRef.current = setTimeout(() => {
    //         handleSearch();
    //     }, 300);
    // }

    // Handle search query input and fetch results
    const handleSearch = async () => {
        if (query.length < 3) return;

        const key = `${query}`;
        if (cacheRef.current.has(key)) {
            console.log("Cached result found for query:", query);
            setResults(cacheRef.current.get(key));
            return;
        }

        // if (cache[query]) {
        //     console.log("Cached result found for query:", query);
        //     setResults(cache[query]);
        //     return;
        // }

        const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(query)}`;

        const { data } = await axios.get(url);


        setResults(data);
        // setCache((prev) => ({
        //     ...prev,
        //     [query]: data
        // }))
        cacheRef.current.set(key, data);
    }

    // Handle search input changes using a debounced approach
    useEffect(() => {
        if (query.trim() !== "") {
            const timer = setTimeout(handleSearch, 300);
            return () => clearTimeout(timer);
            // triggerSearch();
        } else {
            setResults([]);
        }
    }, [query])


    // Handle place selection from search results
    // This will set the selected place, update the map position,
    // and clear the search results
    // It will also close the suggestions dropdown
    const handlePlaceSelect = (place) => {
        // console.log("Selected place:", place);
        // console.log("Setting position to:", [place.lat, place.lng]);

        setSelectedPlace(place);
        setPosition([place.lat, place.lng]);
        setResults([]);
        setQuery('');
    }

    return (
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-1/3'>

            <div className='relative w-full'>
                <input
                    type="text"
                    className='w-full p-2 rounded bg-white shadow-md border-slate-200 text-sm focus:outline-none font-medium'
                    placeholder='Search...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 100)} />

                <button
                    // onClick={triggerSearch}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer'>
                    <Search size={18} />
                </button>
            </div>



            {showResults && (
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
    )
}

export default SearchBar
