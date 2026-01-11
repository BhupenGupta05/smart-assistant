import { useEffect } from "react";
import { useDirectionsContext } from "../context/useDirectionsContext";

export const useDirectionsController = ({ selectedMode, setSelectedMode }) => {
    const { routes, loading, error, getDirections, clearRoutes } = useDirectionsContext();

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