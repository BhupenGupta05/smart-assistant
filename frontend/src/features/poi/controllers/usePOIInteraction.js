import { useCallback } from "react";
import { useMapUI } from "../../../providers/MapUIProvider";
import { normalizePlace } from "../utils/normalizePlace";

export default function usePOIInteraction({
    setSelectedPlace,
    clearRoutes,
    position
}) {

    const { setOrigin, setDestination, setMode } = useMapUI();

    const startDirectionsWith = useCallback((place) => {
        clearRoutes?.();

        const destinationPlace = normalizePlace(place);
        setDestination(destinationPlace);

        if (position) {
            setOrigin({
                name: "Current Location",
                address: "Your current location",
                location: [position.lat, position.lng],
                lat: position.lat,
                lng: position.lng,
            });
        }

        setMode("directions");
        setSelectedPlace(null);
    }, [clearRoutes, position, setOrigin, setDestination, setMode, setSelectedPlace])

    return { startDirectionsWith };
}
