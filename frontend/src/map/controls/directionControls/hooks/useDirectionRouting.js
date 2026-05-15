import { useMemo, useEffect } from "react";

export const useDirectionRouting = ({
    origin,
    destination,
    getDirections
}) => {
    // --- ROUTE REQUEST ON CONFIRMED STATE ---
    const canRequestRoute = useMemo(
        () => Boolean(origin?.location && destination?.location),
        [origin, destination]
    );

    useEffect(() => {
        if (!canRequestRoute) return;
        getDirections(origin.location, destination.location);
    }, [canRequestRoute, origin, destination, getDirections]);

    return {
        canRequestRoute
    }
}