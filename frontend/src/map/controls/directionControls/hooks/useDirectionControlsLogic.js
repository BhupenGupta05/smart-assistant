import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useImperativeHandle
} from "react";
import { fetchPlaces, useFetchPlaces } from "../../../../hooks/useFetchPlaces";
import { normalizePlace } from "../../../../features/poi/utils/normalizePlace";

export const useDirectionControlsLogic = (props, ref) => {
  const {
    query,
    setQuery,
    origin,
    setOrigin,
    destination,
    setDestination,
    activeField,
    setActiveField,
    setPosition,
    selectedPlace,
    setSelectedPlace,
    routes,
    getDirections,
    loading,
    error,
    setMode,
    clearRoutes
  } = props;

  // BUFFER STATES TO SHOW TYPED INPUT IN THE BOXES
  // WITHOUT AFFECTING THE ACTUAL ORIGIN/DESTINATION UNTIL SELECTED
  // THUS AVOIDING UNWANTED API CALLS WHEN USER IS TYPING
  const [originInput, setOriginInput] = useState(origin?.name || "");
  const [destinationInput, setDestinationInput] = useState(destination?.name || "");

  const justSelectedOrigin = useRef(false);
  const justSelectedDestination = useRef(false);

  const originResults = useFetchPlaces(originInput, justSelectedOrigin);
  const destinationResults = useFetchPlaces(destinationInput, justSelectedDestination);

  const handleOriginEnter = async () => {
    const results = await fetchPlaces(originInput);
    if (results.length > 0) selectOrigin(results[0]);
  };

  const handleDestinationEnter = async () => {
    const results = await fetchPlaces(destinationInput);
    if (results.length > 0) selectDestination(results[0]);
  };


  // Sync originInput when origin prop changes externally
  useEffect(() => {
    if (origin) {
      setOriginInput(origin.address || origin.name || "");
    }
  }, [origin]);

  // Sync destinationInput when destination prop changes externally
  useEffect(() => {
    if (destination) {
      setDestinationInput(destination.address || destination.name || "");
    }
  }, [destination]);

  // 🔹 Selection handlers
  const selectOrigin = (place) => {
    clearRoutes?.();
    const normalized = normalizePlace(place);
    if (!normalized) return;

    setOrigin(normalized);
    setOriginInput(normalized.address || normalized.name);
    setActiveField(null);
    justSelectedOrigin.current = true;
  };

  const selectDestination = (place) => {
    clearRoutes?.();
    const normalized = normalizePlace(place);
    if (!normalized) return;

    setDestination(normalized);
    setDestinationInput(normalized.address || normalized.name);
    setActiveField(null);
    justSelectedDestination.current = true;
  };

  // --- 3️⃣ ROUTE REQUEST ON CONFIRMED STATE ---
  const canRequestRoute = useMemo(
    () => Boolean(origin?.location && destination?.location),
    [origin, destination]
  );

  useEffect(() => {
    if (!canRequestRoute) return;
    getDirections(origin.location, destination.location);
  }, [canRequestRoute, origin, destination, getDirections]);


  const swapEnds = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginInput(destination?.name || "");
    setDestinationInput(origin?.name || "");

    // Set flags to prevent search after swap
    justSelectedOrigin.current = true;
    justSelectedDestination.current = true;
  };

  // 🔹 Clear
  const clearAll = () => {
    clearRoutes?.();
    setMode("search");
    setActiveField(null);
    setOrigin(null);
    setDestination(null);
    setOriginInput("");
    setDestinationInput("");
    setSelectedPlace(null);
  };

  // 🔹 Imperative API (chatbot / parent)
  useImperativeHandle(ref, () => ({
    ready: true,

    searchAndSetOrigin: async (query, fallbackCurrentLocation) => {
      // fromchatbotRef.current = true;
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
      // fromchatbotRef.current = true;
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
        console.log("RESULT: ", results);

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

  return {
    // state
    originInput,
    destinationInput,
    originResults,
    destinationResults,
    canRequestRoute,
    loading,
    error,

    // setters
    setOriginInput,
    setDestinationInput,

    // handlers
    selectOrigin,
    selectDestination,
    swapEnds,
    clearAll,
    handleOriginEnter,
    handleDestinationEnter
  };
};
