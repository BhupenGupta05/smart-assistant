import { useState, useMemo, useEffect, useRef } from "react";
import { Locate, MapPin, ArrowDownUp, X } from "lucide-react";
import axios from "axios";

const DEBOUNCE_DELAY = 300;


// THE ORIGIN AND DESTINATION ARE NOT GETTING UPDATE AS WE CAN SEE IN LOGS

const DirectionControls = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  activeField,
  setActiveField,
  setPosition,
  selectedPlace,
  setSelectedPlace,
  poiType,
  setPoiType,
  showTransitLayer,
  setShowTransitLayer,
  searchRef,
  routes,
  getDirections,
  loading,
  error,
  setMode,
  clearRoutes
}) => {

  // BUFFER STATES TO SHOW TYPED INPUT IN THE BOXES
  // WITHOUT AFFECTING THE ACTUAL ORIGIN/DESTINATION UNTIL SELECTED
  // THUS AVOIDING UNWANTED API CALLS WHEN USER IS TYPING
  const [originInput, setOriginInput] = useState(origin?.name || "");
  const [destinationInput, setDestinationInput] = useState(destination?.name || "");


  const [originResults, setOriginResults] = useState([]);
  const [destinationResults, setDestinationResults] = useState([]);

  const justSelectedOrigin = useRef(false);
  const justSelectedDestination = useRef(false);

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

  useEffect(() => {
    if (justSelectedOrigin.current) {
      justSelectedOrigin.current = false;
      return;
    }

    if (!originInput || originInput.length < 3) {
      setOriginResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(originInput)}`;
        const { data } = await axios.get(url);
        setOriginResults(data);
      } catch (err) {
        console.error(err);
        setOriginResults([]);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [originInput]);


  useEffect(() => {
    if (justSelectedDestination.current) {
      justSelectedDestination.current = false;
      return;
    }

    if (!destinationInput || destinationInput.length < 3) {
      setDestinationResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(destinationInput)}`;
        const { data } = await axios.get(url);
        setDestinationResults(data);
      } catch (err) {
        console.error(err);
        setDestinationResults([]);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [destinationInput]);

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
    setOriginResults([]);
    setActiveField(null);
    justSelectedOrigin.current = true; // Set flag to prevent next search
  };


  const selectDestination = (place) => {
    if (clearRoutes) {
      clearRoutes();
      console.log("🧹 Cleared routes before setting new origin");
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
    setDestinationResults([]);
    setActiveField(null);
    justSelectedDestination.current = true; // Set flag to prevent next search
  };



  const confirmOrigin = () => {
    if (originResults.length > 0) selectOrigin(originResults[0]);
  };

  const confirmDestination = () => {
    if (destinationResults.length > 0) selectDestination(destinationResults[0]);
  };


  // --- 3️⃣ ROUTE REQUEST ON CONFIRMED STATE ---
  const canRequestRoute = useMemo(
    () => Boolean(origin?.location && destination?.location),
    [origin, destination]
  );

  useEffect(() => {
    if (origin?.location && destination?.location) {
      console.log("🧭 ORIGIN object:", origin);
      console.log("🧭 DESTINATION object:", destination);
      console.log("🧭 ORIGIN location:", origin.location);
      console.log("🧭 DESTINATION location:", destination.location);
      getDirections(origin.location, destination.location);
    }
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
    setOriginResults([]);
    setDestinationResults([]);
  };

  return (
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
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmOrigin();
            }}
          // onBlur={confirmOrigin}
          // readOnly
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
            <ul className="absolute top-full left-0 right-0 bg-white shadow-md max-h-60 overflow-auto rounded-md z-[2000] mt-1">
              {originResults.map((place) => (
                <li
                  key={place.place_id || place.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={(e) => {
                    e.preventDefault(); // <- prevents input blur
                    selectOrigin(place);
                    setActiveField(null);
                  }}
                >
                  {place.name || place.address}
                </li>
              ))}
            </ul>
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
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmDestination();
            }}
          // onBlur={confirmDestination}
          // readOnly
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
            <ul className="absolute top-full left-0 right-0 bg-white shadow-md max-h-60 overflow-auto rounded-md z-[2000] mt-1">
              {destinationResults.map((place) => (
                <li
                  key={place.place_id || place.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectDestination(place);
                    setActiveField(null); // Clear active field to hide dropdown
                  }}
                >
                  {place.name || place.address}
                </li>
              ))}
            </ul>
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
  );
};

export default DirectionControls;
