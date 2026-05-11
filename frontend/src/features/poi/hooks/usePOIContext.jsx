// Fetch nearby POIs based on the current position or selected place
// If the user selects a place from suggestions, it will update the position and fetch POIs again

// Retry fetching POIs every 5 seconds if there was an error
// This will keep trying to fetch POIs until it succeeds
// or the component is unmounted



//state + context only

import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { usePOIController } from './usePOIController';
import { useGeolocation } from '../../../hooks/useGeolocationContext';
import { useDebouncedPosition } from '../../../map/controllers/useDebouncedPosition';
import usePOICategory from '../controllers/usePOICategory';

const POIContext = createContext();


export const POIProvider = ({ children }) => {

    const [poiIntent, setPoiIntent] = useState(null);

    const { coords } = useGeolocation();

    const position = useMemo(() => {
        const raw = coords;
        if (
            raw &&
            Array.isArray(raw) &&
            raw.length === 2 &&
            typeof raw[0] === "number" &&
            typeof raw[1] === "number" &&
            raw[0] != null &&
            raw[1] != null
        ) {
            return { lat: raw[0], lng: raw[1] };
        }
        return null;
    }, [coords]);

    const debouncedPosition = useDebouncedPosition(position, 600);

    const onPOIIntent = useCallback((intent) => {
        if (!intent) return;

        const { type, query, radius } = intent;

        const poiType = (type || query)?.toLowerCase();

        setPoiIntent({
            type: poiType,
            radius: radius || 1500
        });

        return `Showing nearby ${poiType}`;
    }, []);

    const poi = usePOIController({
        position: debouncedPosition,
        poiIntent
    });

    const category = usePOICategory();

    const value = useMemo(() => ({
        // Intent
        poiIntent,
        onPOIIntent,

        // POI data
        poiResults: poi.poiResults,
        poiLoading: poi.loading,
        poiError: poi.error,
        poiType: poi.poiType,
        setPoiType: poi.setPoiType,
        refetchPOIs: poi.refetchPOIs,
        clearPOIs: poi.clearPOIs,

        // Category UI state
        showMore: category.showMore,
        onCategorySelect: category.onCategorySelect,
        closeMore: category.closeMore,

    }), [
        poiIntent,
        onPOIIntent,
        poi.poiResults,
        poi.loading,
        poi.error,
        poi.poiType,
        poi.setPoiType,
        poi.refetchPOIs,
        poi.clearPOIs,
        category.showMore,
        category.onCategorySelect,
        category.closeMore,

    ])

    return (
        <POIContext.Provider value={value}>
            {children}
        </POIContext.Provider>
    );
};

export const usePOI = () => {
    const context = useContext(POIContext);

    if (!context) {
        throw new Error("usePOI must be used within a POIProvider");
    }

    return context;
};
