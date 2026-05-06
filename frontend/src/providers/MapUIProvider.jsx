import { createContext, useContext, useMemo, useState } from "react";

const MapUIContext = createContext(null);

export const MapUIProvider = ({ children }) => {

    const [mode, setMode] = useState("search"); // Mode is basically either we want to just search for a place or get directions
    const [selectedMode, setSelectedMode] = useState(null); // Mode of transportation for directions: driving, walking, transit
    const [origin, setOrigin] = useState(null);  // Confirmed origin coordinates
    const [destination, setDestination] = useState(null); // Confirmed destination coordinates
    const [activeField, setActiveField] = useState(null); // State to manage which input field is active (origin or destination)
    const [hoverPOIId, setHoverPOIId] = useState(null); // Store active POI ID for highlighting 

    const value = useMemo(() => ({
        //state
        mode,
        selectedMode,
        origin,
        destination,
        activeField,
        hoverPOIId,

        //setters
        setMode,
        setSelectedMode,
        setOrigin,
        setDestination,
        setActiveField,
        setHoverPOIId,
    }), [mode, selectedMode, origin, destination, activeField, hoverPOIId])

    return (
        <MapUIContext.Provider value={value}>
            {children}
        </MapUIContext.Provider>
    )
}

export const useMapUI = () => {
    const context = useContext(MapUIContext);
    if (!context) {
        throw new Error("useMapUI must be used within a MapUIProvider");
    }
    return context;

}