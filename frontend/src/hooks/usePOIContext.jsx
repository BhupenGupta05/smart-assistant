// Fetch nearby POIs based on the current position or selected place
// If the user selects a place from suggestions, it will update the position and fetch POIs again

// Retry fetching POIs every 5 seconds if there was an error
// This will keep trying to fetch POIs until it succeeds
// or the component is unmounted

const CACHE_TTL = 60000; //I MINUTE

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useGeolocation } from './useGeolocationContext';
import axios from 'axios';

const POIContext = createContext();


export const POIProvider = ({ children }) => {

    const { getCoords } = useGeolocation();

    const [poiType, setPoiType] = useState(null); // Default POI type
    const [poiResults, setPoiResults] = useState([]); // Store POI results
    const [poiError, setPoiError] = useState(null); // Store POI error if any
    const [poiLoading, setPoiLoading] = useState(false); // Sonst cahetore POI loading state

    const cacheRef = useRef(new Map());
    const abortRef = useRef(null);

    // Function to fetch POIs based on current coordinates and selected POI type
    const fetchPOIs = useCallback(async () => {
        const coords = getCoords();

        if (!coords || !poiType) return;

        const [lat, lng] = coords;
        const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}-${poiType}`;

        // USE CACHED DATA IF VALID
        const cached = cacheRef.current.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log("FETCHING FROM CACHE");
            setPoiResults(cached.data);
            return;
        }

        // ABORT PREVIOUS REQUESTS
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setPoiLoading(true);
        try {
            const url = `${import.meta.env.VITE_BASE_URL}/api/nearby?lat=${coords[0]}&lng=${coords[1]}&radius=1500&type=${poiType}`;
            const { data } = await axios.get(url, { signal: controller.signal });
            setPoiResults(data);
            setPoiError(null);

            // CACHE THE RESULT
            cacheRef.current.set(cacheKey, { data, timestamp: Date.now() });

        } catch (error) {
            if (err.name === 'CanceledError') return; //IGNORE CANCELED REQUESTS
            console.error("Failed to fetch POIs:", error.message);
            setPoiResults([]);
            setPoiError("Could not connect to the POI service.");
        } finally {
            setPoiLoading(false);
        }
    }, [getCoords, poiType])

    const clearPOIs = () => setPoiResults([]);


    // Fetch POIs when coordinates or POI type changes
    useEffect(() => {
        fetchPOIs();

        return () => {
            if (abortRef.current) abortRef.current.abort();
        }

    }, [fetchPOIs])


    // If the server doesn't respond, retry every 5 seconds
    useEffect(() => {
        if (!poiError) return;

        const interval = setInterval(() => {
            fetchPOIs();
        }, 15000);

        return () => clearInterval(interval);
    }, [poiError, fetchPOIs])

    // CLEANUP ON UNMOUNT
    useEffect(() => {
        return () => {
            if (abortRef.current) abortRef.current.abort();
        }
    }, [])


    return (
        <POIContext.Provider value={{ poiResults, setPoiResults, poiLoading, poiError, poiType, setPoiType, refetchPOIs: fetchPOIs, clearPOIs }}>
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
