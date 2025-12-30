import { useState, useMemo } from "react";
import { useGeolocation } from "../../hooks/useGeolocationContext";

export const useMap = () => {

    const { selectedPlace } = useGeolocation();

    const [mode, setMode] = useState("search"); // Mode is basically either we want to just search for a place or get directions
    const [selectedMode, setSelectedMode] = useState(null); // Mode of transportation for directions: driving, walking, transit
    const [origin, setOrigin] = useState(null);  // Confirmed origin coordinates
    const [destination, setDestination] = useState(null); // Confirmed destination coordinates
    const [activeField, setActiveField] = useState(null); // State to manage which input field is active (origin or destination)
    const [hoverPOIId, setHoverPOIId] = useState(null); // Store active POI ID for highlighting 

    const activePOIId = useMemo(() => selectedPlace?.place_id || hoverPOIId, [selectedPlace, hoverPOIId]); // Use selected place ID or hover ID for active POI

    return {
        //state
        mode,
        selectedMode, 
        origin,
        destination,
        activeField, 
        hoverPOIId, 
        activePOIId,

        //setters
        setMode,
        setSelectedMode,
        setOrigin,
        setDestination,
        setActiveField,
        setHoverPOIId
    }

}