import { createContext, useContext, useMemo, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocationContext";

const MapUIStateContext = createContext(null);
const MapUIHoverContext = createContext(null);

export const MapUIProvider = ({ children }) => {

    const [mode, setMode] = useState("search"); // Mode is basically either we want to just search for a place or get directions
    const [selectedMode, setSelectedMode] = useState(null); // Mode of transportation for directions: driving, walking, transit
    const [origin, setOrigin] = useState(null);  // Confirmed origin coordinates
    const [destination, setDestination] = useState(null); // Confirmed destination coordinates
    const [activeField, setActiveField] = useState(null); // State to manage which input field is active (origin or destination)
    const [hoverPOIId, setHoverPOIId] = useState(null); // Store active POI ID for highlighting 
    const [selectedPlace, setSelectedPlace] = useState(null); // Selected place from search suggestions

    const { position } = useGeolocation();

        // If a place is selected, return its coordinates; otherwise, return current position
    const coords = useMemo(() => {
        return selectedPlace
            ? [selectedPlace.lat, selectedPlace.lng]
            : position;
    }, [selectedPlace, position]);

    const stateValue = useMemo(() => ({
        //state
        mode,
        selectedMode,
        origin,
        destination,
        activeField,
        selectedPlace,
        coords,

        //setters
        setMode,
        setSelectedMode,
        setOrigin,
        setDestination,
        setActiveField,
        setSelectedPlace,
    }), [mode,
        selectedMode,
        origin,
        destination,
        activeField,
        selectedPlace,
        coords])

    return (
        <MapUIStateContext.Provider value={stateValue}>
            <MapUIHoverContext.Provider value={{ hoverPOIId, setHoverPOIId }}>
                {children}
            </MapUIHoverContext.Provider>
        </MapUIStateContext.Provider>
    )
}

export const useMapUI = () => {
    const context = useContext(MapUIStateContext);
    if (!context) {
        throw new Error("useMapUI must be used within a MapUIProvider");
    }
    return context;

}

export const useMapHover = () => {
    const context = useContext(MapUIHoverContext);
    if (!context) {
        throw new Error("useMapUI must be used within a MapUIProvider");
    }
    return context;
}