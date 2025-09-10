import { useMemo, useEffect } from "react";
import { ArrowDownUp } from 'lucide-react'

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
  setMode
}) => {

  // Helpers
  const canRequestRoute = useMemo(() => Boolean(origin?.location && destination?.location), [origin, destination]);
  // When both origin & destination are set, fetch directions
  useEffect(() => {
    // if (!origin?.location || !destination?.location) return;

    if (origin?.location && destination?.location) {
      console.log("🧭 ORIGIN object:", origin);
      console.log("🧭 DESTINATION object:", destination);

      console.log("🚗 Requesting directions from", origin.location, "to", destination.location);
      getDirections(origin.location, destination.location);
    }
  }, [origin, destination, getDirections]);

  const swapEnds = () => {
    setOrigin(destination);
    setDestination(origin);
  }

  const clearAll = () => {
    setMode("search");
    setActiveField(null);
    setOrigin(null);
    setDestination(null);
    setSelectedPlace(null);
  }
  return (
    <>
      {/* Origin + Destination fields */}
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-1/3'>
          <div className='relative w-full'>
            <input
              type="text"
              placeholder="Choose starting point"
              className='w-full p-2 rounded bg-white shadow-md border-slate-200 text-sm focus:outline-none font-medium'
              value={origin?.name || ""}
              onFocus={() => setActiveField("origin")}
              onClick={() => setActiveField("origin")}
              readOnly
            />
            <button
              className="px-1 border rounded bg-gray-100"
              title="Swap"
              onClick={swapEnds}
            >
              <ArrowDownUp size={18} />
            </button>
          </div>

          <div className='relative w-full'>
            <input
              type="text"
              placeholder="Search destination"
              className='w-full p-2 rounded bg-white shadow-md border-slate-200 text-sm focus:outline-none font-medium'
              value={destination?.name || ""}
              onFocus={() => setActiveField("destination")}
              onClick={() => setActiveField("destination")}
              readOnly
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {loading && (
                <span>Fetching route…</span>
              )}
              {error && <span className="text-red-500">{error}</span>}
              {canRequestRoute && !loading && routes?.length === 0 && "No routes found"}
            </div>
            <button className="text-xs text-red-600" onClick={clearAll}>Clear</button>
          </div>
        </div>

    </>
  )
}

export default DirectionControls
