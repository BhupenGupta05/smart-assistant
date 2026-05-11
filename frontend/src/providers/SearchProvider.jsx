import { useState, useRef, useMemo, createContext, useContext } from "react";

const SearchQueryContext = createContext(null);
const TransitLayerContext = createContext(null);
const SearchRefsContext = createContext(null);

export const SearchProvider = ({ children }) => {
    const [query, setQuery] = useState(''); // Search query state
    const [showTransitLayer, setShowTransitLayer] = useState(false); // Show Transit Layer only for transit_station poiType

    const searchRef = useRef(); // Reference to Search input instance
    const directionsRef = useRef(); // Reference to Origin/Destination input instance

    const queryValue = useMemo(() => ({
        query,
        setQuery,
    }), [query])

    const transitValue = useMemo(() => ({
        showTransitLayer,
        setShowTransitLayer,
    }), [showTransitLayer])

    const refsValue = useMemo(() => ({
        searchRef,
        directionsRef,
    }), []);

    return (
        <SearchQueryContext.Provider value={queryValue}>
            <TransitLayerContext.Provider value={transitValue}>
                <SearchRefsContext.Provider value={refsValue}>
                    {children}
                </SearchRefsContext.Provider>
            </TransitLayerContext.Provider>
        </SearchQueryContext.Provider>
    )
}

export const useSearchQuery = () => {
    const context = useContext(SearchQueryContext);

    if (!context) {
        throw new Error('useSearchQuery must be used within SearchProvider');
    }

    return context;
};

export const useTransitLayer = () => {
    const context = useContext(TransitLayerContext);

    if (!context) {
        throw new Error('useTransitLayer must be used within SearchProvider');
    }

    return context;
};

export const useSearchRefs = () => {
    const context = useContext(SearchRefsContext);

    if (!context) {
        throw new Error('useSearchRefs must be used within SearchProvider');
    }

    return context;
};