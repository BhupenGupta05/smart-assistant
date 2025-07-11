// Fetch nearby POIs based on the current position or selected place
// If the user selects a place from suggestions, it will update the position and fetch POIs again

// Retry fetching POIs every 5 seconds if there was an error
// This will keep trying to fetch POIs until it succeeds
// or the component is unmounted

import { useCallback, useEffect, useState } from 'react';
import { useGeolocation } from './useGeolocation';
import axios from 'axios';

export const usePOI = () => {
    const { getCoords } = useGeolocation();

    const [poiType, setPoiType] = useState(null); // Default POI type
    const [poiResults, setPoiResults] = useState([]); // Store POI results
    const [poiError, setPoiError] = useState(null); // Store POI error if any
    const [poiLoading, setPoiLoading] = useState(false); // Store POI loading state


    const fetchPOIs = useCallback(async () => {
        const coords = getCoords();

        if (!coords || !poiType) return;
        setPoiLoading(true);
        try {
            const url = `${import.meta.env.VITE_BASE_URL}/api/nearby?lat=${coords[0]}&lng=${coords[1]}&radius=1500&type=${poiType}`;
            const { data } = await axios.get(url);
            setPoiResults(data);
            setPoiError(null);

        } catch (error) {
            console.error("Failed to fetch POIs:", error.message);
            setPoiResults([]);
            setPoiError("Could not connect to the POI service.");
        } finally {
            setPoiLoading(false);
        }
    }, [getCoords, poiType])


    // INITIAL FETCH
    useEffect(() => {
        fetchPOIs();
    }, [fetchPOIs])

    // RETRY, IF FAILED AFTER EVERY 5 SECONDS
    useEffect(() => {
        if (!poiError) return;

        const interval = setInterval(() => {
            fetchPOIs();
        }, 5000);

        return () => clearInterval(interval);
    }, [poiError, fetchPOIs])

    return {
        poiType,
        setPoiType,
        poiResults,
        poiLoading,
        poiError,
        refetchPOIs: fetchPOIs
    }

}