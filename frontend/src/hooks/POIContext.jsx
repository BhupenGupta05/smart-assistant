
import { createContext, useContext, useEffect, useState } from 'react';

const POIContext = createContext();

export const POIProvider = ({ children }) => {

    const { position, setPosition } = useGeolocation();

    const [selectedPlace, setSelectedPlace] = useState(null);

    const [poiType, setPoiType] = useState(null); // Default POI type
    const [poiResults, setPoiResults] = useState([]); // Store POI results
    const [poiError, setPoiError] = useState(null); // Store POI error if any
    const [poiLoading, setPoiLoading] = useState(false); // Store POI loading state

    const coords = selectedPlace
        ? [selectedPlace.lat, selectedPlace.lng]
        : position;

    const fetchPOIs = useCallback(async () => {
        if(!coords || !poiType) return;
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
    })

    useEffect(() => {
        fetchPOIs();
    }, [fetchPOIs])

    useEffect(() => {
        if(!poiError) return;

        const interval = setInterval(() => {
            fetchPOIs();
        }, 5000);


        return () => clearInterval(interval);

    }, [poiError, fetchPOIs])


    return (
        <POIContext.Provider value={{ position, setPosition, error }}>
            {children}
        </POIContext.Provider>
    );
};

export const useGeolocation = () => {
    const context = useContext(GeolocationContext);

    if (!context) {
        throw new Error("useGeolocation must be used within a GeolocationProvider");
    }

    return context;
};
