import { createContext, useContext, useMemo, useState } from "react";

const MapUIStateContext = createContext(null);
const MapUIHoverContext = createContext(null);

export const MapUIProvider = ({ children }) => {

    const [mode, setMode] = useState("search"); // Mode is basically either we want to just search for a place or get directions
    const [selectedMode, setSelectedMode] = useState(null); // Mode of transportation for directions: driving, walking, transit
    const [origin, setOrigin] = useState(null);  // Confirmed origin coordinates
    const [destination, setDestination] = useState(null); // Confirmed destination coordinates
    const [activeField, setActiveField] = useState(null); // State to manage which input field is active (origin or destination)
    const [hoverPOIId, setHoverPOIId] = useState(null); // Store active POI ID for highlighting 

    const stateValue = useMemo(() => ({
        //state
        mode,
        selectedMode,
        origin,
        destination,
        activeField,

        //setters
        setMode,
        setSelectedMode,
        setOrigin,
        setDestination,
        setActiveField,
    }), [mode, selectedMode, origin, destination, activeField])

    const hoverValue = useMemo(() => ({
        //state
        hoverPOIId,

        //setters
        setHoverPOIId,
    }), [hoverPOIId])

    return (
        <MapUIStateContext.Provider value={stateValue}>
            <MapUIHoverContext.Provider value={hoverValue}>
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