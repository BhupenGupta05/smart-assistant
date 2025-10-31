import { useState, useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Locate, MapPin, ArrowDownUp, X } from "lucide-react";
import axios from "axios";
import Chatbot from "../../components/Chatbot";
import { useFetchPlaces } from "../../hooks/useFetchPlaces";

const DEBOUNCE_DELAY = 300;

const DirectionControls = forwardRef(({
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
}, ref) => {

  // BUFFER STATES TO SHOW TYPED INPUT IN THE BOXES
  // WITHOUT AFFECTING THE ACTUAL ORIGIN/DESTINATION UNTIL SELECTED
  // THUS AVOIDING UNWANTED API CALLS WHEN USER IS TYPING
  const [originInput, setOriginInput] = useState(origin?.name || "");
  const [destinationInput, setDestinationInput] = useState(destination?.name || "");

  const justSelectedOrigin = useRef(false);
  const justSelectedDestination = useRef(false);

  const originResults = useFetchPlaces(originInput, justSelectedOrigin);
  const destinationResults = useFetchPlaces(destinationInput, justSelectedDestination);

  // TO DISTINGUISH BETWEEN IF ROUTE IS FETCHED USING PROMPT OR BEING SET MANUALLY
  // const fromchatbotRef = useRef(false);


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


  // TRYING TO REPLACE THIS
  const fetchPlaces = async (query) => {
    if (!query || query.length < 3) return [];
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      return data;
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  };


  const selectOrigin = (place) => {
    if (clearRoutes) {
      clearRoutes();
      console.log("🧹 Cleared routes before setting new destination");
    }
    // Normalize the place data to ensure consistent format
    const normalizedPlace = {
      name: place.name || place.formatted_address,
      address: place.formatted_address || place.name,
      location: Array.isArray(place.location) ? place.location : [place.lat, place.lng],
      lat: place.lat,
      lng: place.lng,
      place_id: place.place_id
    };

    setOrigin(normalizedPlace);
    setOriginInput(normalizedPlace.address || normalizedPlace.name);
    setActiveField(null);
    justSelectedOrigin.current = true; // Set flag to prevent next search
  };


  const selectDestination = (place) => {
    if (clearRoutes) {
      clearRoutes();
      console.log("🧹 Cleared routes before setting new destination");
    }
    // Normalize the place data to ensure consistent format
    const normalizedPlace = {
      name: place.name || place.formatted_address,
      address: place.formatted_address || place.name,
      location: Array.isArray(place.location) ? place.location : [place.lat, place.lng],
      lat: place.lat,
      lng: place.lng,
      place_id: place.place_id
    };

    setDestination(normalizedPlace);
    setDestinationInput(normalizedPlace.address || normalizedPlace.name);
    setActiveField(null);
    justSelectedDestination.current = true; // Set flag to prevent next search
  };

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
        // Directly call getDirections for chatbot-triggered route
        console.log("🤖 Chatbot-triggered route fetch");
        await getDirections(origin.location, destination.location, "driving");
      }

      // fromchatbotRef.current = true;

      // console.log("REF CURRENT:", fromchatbotRef.current);

    },

    // ✅ NEW: switch MapView to directions mode
    switchToDirectionsMode: () => {
      if (setMode) setMode("directions");
    },

    // switchToSearchMode: () => {
    //   if(setMode) setMode("search");
    // }
  }));


  // --- 3️⃣ ROUTE REQUEST ON CONFIRMED STATE ---
  const canRequestRoute = useMemo(
    () => Boolean(origin?.location && destination?.location),
    [origin, destination]
  );

  useEffect(() => {
    if (!origin?.location || !destination?.location) return;

    // 🧠 Skip automatic fetch if it was triggered from chatbot
    // if (fromchatbotRef.current) {
    //   console.log("⏩ Skipping auto-fetch (chatbot flow)");
    //   setTimeout(() => (fromchatbotRef.current = false), 200); // delay reset
    //   return;
    // }

    getDirections(origin.location, destination.location);

    // if (origin?.location && destination?.location) {
    //   console.log("🧭 ORIGIN object:", origin);
    //   console.log("🧭 DESTINATION object:", destination);
    //   console.log("🧭 ORIGIN location:", origin.location);
    //   console.log("🧭 DESTINATION location:", destination.location);
    //   getDirections(origin.location, destination.location);
    // }
  }, [origin, destination, getDirections]);


  const swapEnds = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginInput(destination?.name || "");
    setDestinationInput(origin?.name || "");

    // Set flags to prevent search after swap
    justSelectedOrigin.current = true;
    justSelectedDestination.current = true;
  };

  const clearAll = () => {
    if (clearRoutes) {
      clearRoutes();
    }

    setMode("search");
    setActiveField(null);
    setOrigin(null);
    setDestination(null);
    setOriginInput("");
    setDestinationInput("");
    setSelectedPlace(null);
  };

  return (
    <>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-1/3 max-w-md">
        <div className="bg-white rounded-md shadow-md py-1 px-3">
          {/* Origin */}
          <div className="flex items-center gap-2">
            <Locate size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Choose starting point"
              className="w-full p-2 text-sm font-medium focus:outline-none bg-white"
              value={originInput}
              onFocus={() => setActiveField("origin")}
              onChange={(e) => setOriginInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const results = await fetchPlaces(originInput);
                  if (results.length > 0) selectOrigin(results[0]);
                }
              }}
            />
            <button
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
              title="Clear all"
              onClick={clearAll}
            >
              <X size={14} />
            </button>

            {/* Origin results dropdown */}
            {activeField === "origin" && originResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white overflow-auto z-[2000] rounded mt-1 max-h-60 overflow-y-auto shadow-md">
                {originResults.map((place) => (
                  <div
                    key={place.place_id || place.id}
                    className="p-2 font-medium cursor-pointer hover:bg-slate-300 text-sm border-slate-200 border-[1px]"
                    onMouseDown={(e) => {
                      e.preventDefault(); // <- prevents input blur
                      selectOrigin(place);
                      setActiveField(null);
                    }}
                  >
                    {place.name || place.address}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t my-1 mx-6"></div>

          {/* Destination */}
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search destination"
              className="w-full p-2 text-sm font-medium focus:outline-none"
              value={destinationInput}
              onFocus={() => setActiveField("destination")}
              onChange={(e) => setDestinationInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const results = await fetchPlaces(destinationInput);
                  if (results.length > 0) selectDestination(results[0]);
                }
              }}
            />
            <button
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
              title="Swap origin and destination"
              onClick={swapEnds}
            >
              <ArrowDownUp size={14} />
            </button>

            {/* Destination results dropdown */}
            {activeField === "destination" && destinationResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white overflow-auto z-[2000] rounded mt-1 max-h-60 overflow-y-auto shadow-md">
                {destinationResults.map((place) => (
                  <div
                    key={place.place_id || place.id}
                    className="p-2 font-medium cursor-pointer hover:bg-slate-300 text-sm border-slate-200 border-[1px]"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectDestination(place);
                      setActiveField(null); // Clear active field to hide dropdown
                    }}
                  >
                    {place.name || place.address}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>
              {loading && <span>Fetching route…</span>}
              {error && <span className="text-red-500">{error}</span>}
              {canRequestRoute &&
                !loading &&
                routes?.length === 0 &&
                "No routes found"}
            </div>

          </div>
        </div>
      </div>
      {/* Chatbot - bottom right corner */}
      {/* <div className="absolute bottom-4 right-4 z-[1000] w-[300px]">
        <Chatbot />
      </div> */}
    </>

  );
});

export default DirectionControls;
