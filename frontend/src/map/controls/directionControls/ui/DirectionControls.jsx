import { Locate, MapPin, ArrowDownUp, X } from "lucide-react";

const DirectionControls = ({
  originInput,
  destinationInput,
  setOriginInput,
  setDestinationInput,
  originResults,
  destinationResults,
  activeField,
  setActiveField,
  selectOrigin,
  selectDestination,
  swapEnds,
  clearAll,
  loading,
  error,
  routes,
  canRequestRoute
}) => {
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
              onKeyDown={(e) => e.key === "Enter" && handleOriginEnter()}
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
              onKeyDown={(e) => e.key === "Enter" && handleDestinationEnter()}
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
    </>
  );
};

export default DirectionControls;

