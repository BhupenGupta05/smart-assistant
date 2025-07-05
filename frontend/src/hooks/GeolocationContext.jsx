// Get user's current location
// This will set the initial position of the map
// and will be used to fetch nearby POIs
// It will also update the position when the user selects a place from suggestions
// If the user denies geolocation permission, it will default to London

import { createContext, useContext, useEffect, useState } from 'react';

const GeolocationContext = createContext();

export const GeolocationProvider = ({ children }) => {
    const [position, setPosition] = useState([51.505, -0.09]); // Default to London
    const [error, setError] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError(err.message);
            }
        );
    }, []);

    return (
        <GeolocationContext.Provider value={{ position, setPosition, error }}>
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
