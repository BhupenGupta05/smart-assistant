import { useState, useRef, useMemo, createContext, useContext } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
    const [query, setQuery] = useState(''); // Search query state
    const [showTransitLayer, setShowTransitLayer] = useState(false); // Show Transit Layer only for transit_station poiType

    const searchRef = useRef(); // Reference to Search input instance
    const directionsRef = useRef(); // Reference to Origin/Destination input instance

    const value = useMemo(() => ({
        query,
        setQuery,
        showTransitLayer,
        setShowTransitLayer,
        searchRef,
        directionsRef,
    }), [query, showTransitLayer]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchProvider = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
