import { useMapUI } from "../../../providers/MapUIProvider";
import { normalizePlace } from "../utils/normalizePlace";

export default function usePOIInteraction({
    setSelectedPlace,
    clearRoutes,
    position
}) {
    const { setOrigin, setDestination, setMode } = useMapUI();
    
    const startDirectionsWith = (place) => {
        if (clearRoutes) clearRoutes();

        const destinationPlace = normalizePlace(place);
        setDestination(destinationPlace);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const currentLocation = {
                        name: "Current Location",
                        address: "Your current location",
                        location: [pos.coords.latitude, pos.coords.longitude],
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    setOrigin(currentLocation);
                },
                (err) => {
                    console.warn("⚠️ Failed to fetch current location:", err);
                    if (position) {
                        setOrigin({
                            name: "Current Location",
                            address: "Your current location",
                            location: position,
                            lat: position[0],
                            lng: position[1],
                        });
                    }
                }
            );
        }

        setMode("directions");
        setSelectedPlace(null);
    };

    return { startDirectionsWith };
}
