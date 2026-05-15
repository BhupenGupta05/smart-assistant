import { useMemo, useState, useCallback } from "react";
import { POIContext } from '../context/POIContext'
import {usePOIController} from '../hooks/usePOIController'
import { useDebouncedPosition } from "../../../map/controllers/useDebouncedPosition";
import usePOICategory from "../controllers/usePOICategory";
import { useMapUI } from "../../../providers/MapUIProvider";

export const POIProvider = ({ children }) => {
    const [poiIntent, setPoiIntent] = useState(null);

    const { coords } = useMapUI();

    const position = useMemo(() => {
        const raw = coords;

        if (
            raw &&
            Array.isArray(raw) &&
            raw.length === 2 &&
            typeof raw[0] === "number" &&
            typeof raw[1] === "number"
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
        poiIntent,
        onPOIIntent,

        poiResults: poi.poiResults,
        poiLoading: poi.loading,
        poiError: poi.error,
        poiType: poi.poiType,
        setPoiType: poi.setPoiType,
        refetchPOIs: poi.refetchPOIs,
        clearPOIs: poi.clearPOIs,

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
    ]);

    return (
        <POIContext.Provider value={value}>
            {children}
        </POIContext.Provider>
    );
};