// Get user's current location
// This will set the initial position of the map
// and will be used to fetch nearby POIs
// It will also update the position when the user selects a place from suggestions
// If the user denies geolocation permission, it will default to New Delhi

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useNetwork from '../features/network/hooks/useNetwork';
import { loadLocation, saveLocation } from '../features/offline/utils/locationCache';

const GeolocationContext = createContext();

export const GeolocationProvider = ({ children }) => {
    const isOnline = useNetwork();
    // Try to load cached location on initial render
    const [position, setPosition] = useState(() => {
        const cached = loadLocation();
        return cached ? [cached.lat, cached.lng] : [28.6139, 77.2090];
    });
    const [selectedPlace, setSelectedPlace] = useState(null); // Selected place from search suggestions
    const [error, setError] = useState(null);

    // If a place is selected, return its coordinates; otherwise, return current position
    const getCoords = () => {
        return selectedPlace ? [selectedPlace.lat, selectedPlace.lng] : position;
    }

    // For the initial render, try to get the user's current location
    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        // If offline, use cached location and don't attempt geolocation
        if (!isOnline) {
            const cached = loadLocation();
            if (cached) {
                console.log("📴 OFFLINE: Using cached location");
                setPosition([cached.lat, cached.lng]);
            }
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                setPosition([lat, lng]);
                setError(null);

                // ✅ Save to cache for offline use
                saveLocation(lat, lng);
                console.log("📍 Location saved to cache");
            },
            (err) => {
                console.error("Geolocation error:", err);
                // Fallback to cached location
                const cached = loadLocation();
                if (cached) {
                    console.log("⚠️ Geolocation failed, using cached location");
                    setPosition([cached.lat, cached.lng]);
                    setError("Using last known location");
                } else {
                    setError("Unable to retrieve your location");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
            }
        );
    }, [isOnline]);

    const value = useMemo(() => ({
        position,
        setPosition,
        selectedPlace,
        setSelectedPlace,
        getCoords,
        error,
        setError,
    }), [position, selectedPlace, error])

    return (
        <GeolocationContext.Provider value={value}>
            {children}
        </GeolocationContext.Provider>
    );
};

export const useGeolocation = () => {
    const context = useContext(GeolocationContext);

    if (!context) {
        throw new Error("useGeolocation must be used within a GeolocationProvider");
    }

    return context;
};
