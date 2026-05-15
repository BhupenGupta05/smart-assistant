import { useImperativeHandle } from "react";
import { fetchPlaces } from "../../../../hooks/useFetchPlaces";

export const useDirectionImperative = ({
    ref,
    origin,
    destination,
    setMode,
    setPosition,
    setSelectedPlace,
    setQuery,
    getDirections,
    selectOrigin,
    selectDestination,
    clearAll
}) => {
    

    // Imperative API (chatbot / parent)
    useImperativeHandle(ref, () => ({
        ready: true,

        searchAndSetOrigin: async (query, fallbackCurrentLocation) => {
            if (!query && fallbackCurrentLocation) {
                const pos = fallbackCurrentLocation; // [lat, lng]
                const fakePlace = {
                    name: "Current Location",
                    address: "Current Location",
                    lat: pos[0],
                    lng: pos[1],
                    place_id: "current_location"
                };
                selectOrigin(fakePlace);
                return true;
            }
            const results = await fetchPlaces(query);
            if (results.length > 0) {
                selectOrigin(results[0]);
                return true;
            }
            return false;
        },

        searchAndSetDestination: async (query) => {
            const results = await fetchPlaces(query);

            if (results.length > 0) {
                selectDestination(results[0]);
                return true;
            }
            return false;
        },

        calculateDirections: async () => {
            if (origin?.location && destination?.location) {
                await getDirections(origin.location, destination.location, "driving");
            }
        },

        // switch MapView to directions mode
        switchToDirectionsMode: () => setMode?.("directions"),

        switchToSearchMode: clearAll,

        searchLocation: async (location) => {
            try {
                const results = await fetchPlaces(location);

                if (results.length === 0) return false;

                const place = results[0];
                setSelectedPlace(place);
                setPosition([place.lat, place.lng]);

                if (setQuery) setQuery(place.address);

                return true;
            } catch (err) {
                console.error("Failed to search and select:", err);
                return false;
            }

        }
    }));

}