import { useEffect } from "react";
import { useDirectionsContext } from "../context/useDirectionsContext";
import { useMapUI } from "../../../providers/MapUIProvider";

export const useDirectionsController = () => {
    const { routes, loading, error, getDirections, clearRoutes } = useDirectionsContext();
    const { selectedMode, setSelectedMode } = useMapUI();

    // By default, set selectedMode to first available mode when routes change
    useEffect(() => {
        if (routes?.length && !selectedMode) {
            setSelectedMode(routes[0].mode);
        }
    }, [routes, selectedMode, setSelectedMode]);

    return {
        routes,
        loading,
        error,
        getDirections,
        clearRoutes
    }
}