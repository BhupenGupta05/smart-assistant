import SearchBar from "../../../../features/search/ui/SearchBar"
import POIDetails from "../../../../features/poi/ui/POIDetails"
import AQIIndicator from "../../../../features/aqi/ui/AQIIndicator"
import "leaflet/dist/leaflet.css"


const SearchControls = ({
  query,
  setQuery,
  setOrigin,
  setPosition,
  selectedPlace,
  setSelectedPlace,
  setDestination,
  setActiveField,
  setMode,
  aqi,
  aqiLoading,
  aqiError,
  poiType,
  setPoiType,
  showTransitLayer,
  setShowTransitLayer,
  searchRef,
  onStartDirections }) => {

  return (
    <>
      <SearchBar
        ref={searchRef}
        query={query}
        setQuery={setQuery}
        setPosition={setPosition}
        setSelectedPlace={setSelectedPlace}
      />



      {/* DETAILS BOTTOM BAR */}
      {selectedPlace && (
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-white shadow-xl z-[1000] overflow-y-auto rounded-t-xl">
          <POIDetails
            place={selectedPlace}
            onBack={() => setSelectedPlace(null)}
            onDirections={() => onStartDirections(selectedPlace)} />
        </div>
      )}

      {/* AQI INDICATOR USING USEAQI HOOK */}
      {!aqiLoading && aqi && (
        <div className="absolute top-4 right-4 z-[1000]">
          <AQIIndicator
            aqi={aqi}
            loading={false}
            error={aqiError} />
        </div>
      )}

      {/* TOGGLE TRANSIT LAYER */}
      {poiType === 'transit_station' && (
        <button
          onClick={() => setShowTransitLayer(!showTransitLayer)}
          className="absolute top-[130px] right-4 z-[1000] bg-white px-3 py-1 rounded-full shadow-md border text-xs md:text-sm font-medium hover:bg-gray-100 transition"
        >
          {showTransitLayer ? "Hide Transit" : "Show Transit"}
        </button>
      )}

    </>
  )
}

export default SearchControls
