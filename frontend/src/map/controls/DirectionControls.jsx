import { useMemo, useEffect } from "react";
import { Locate, MapPin, ArrowDownUp, X } from "lucide-react";

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
  aqi,
  aqiLoading,
  aqiError,
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
  activeRouteIndex,
  setActiveRouteIndex
}) => {
  const canRequestRoute = useMemo(
    () => Boolean(origin?.location && destination?.location),
    [origin, destination]
  );

  useEffect(() => {
    if (origin?.location && destination?.location) {
      console.log("🧭 ORIGIN object:", origin);
      console.log("🧭 DESTINATION object:", destination);
      console.log(
        "🚗 Requesting directions from",
        origin.location,
        "to",
        destination.location
      );
      getDirections(origin.location, destination.location);
    }
  }, [origin, destination, getDirections]);

  const swapEnds = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const clearAll = () => {
    setMode("search");
    setActiveField(null);
    setOrigin(null);
    setDestination(null);
    setSelectedPlace(null);
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
            value={origin?.name || ""}
            onFocus={() => setActiveField("origin")}
            readOnly
          />
          <button
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
            title="Clear all"
            onClick={clearAll}
          >
            <X size={14} />
          </button>
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
            value={destination?.name || ""}
            onFocus={() => setActiveField("destination")}
            readOnly
          />
          <button
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
            title="Swap origin and destination"
            onClick={swapEnds}
          >
            <ArrowDownUp size={14} />
          </button>
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
