import SearchBar from "../../../../features/search/ui/SearchBar"
import POIDetails from "../../../../features/poi/ui/POIDetails"
import AQIIndicator from "../../../../features/aqi/ui/AQIIndicator"
import "leaflet/dist/leaflet.css"
import LayersTile from "../../../../features/layers/ui/Layers"


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
      <div className="absolute
    top-4 left-4
    z-[1000]
    flex items-start
    gap-2
    w-[90vw]
    sm:w-[70vw]
    md:w-[55vw]
    lg:w-[45vw]
    max-w-[640px]">
        <div className="flex-1 min-w-0">
          <SearchBar
            ref={searchRef}
            query={query}
            setQuery={setQuery}
            setPosition={setPosition}
            setSelectedPlace={setSelectedPlace}
          />
        </div>

        <div className="shrink-0 h-10 w-10">
          <LayersTile showTransitLayer={showTransitLayer} setShowTransitLayer={setShowTransitLayer} />
        </div>

      </div>





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
      {/* {!aqiLoading && aqi && (
        <div className="absolute top-4 right-4 z-[1000]">
          <AQIIndicator
            aqi={aqi}
            loading={false}
            error={aqiError} />
        </div>
      )} */}

      {/* TOGGLE TRANSIT LAYER */}
      {/* {poiType === 'transit_station' && (
        <button
          onClick={() => setShowTransitLayer(!showTransitLayer)}
          className="absolute top-[130px] right-4 z-[1000] bg-white px-3 py-1 rounded-full shadow-md border text-xs md:text-sm font-medium hover:bg-gray-100 transition"
        >
          {showTransitLayer ? "Hide Transit" : "Show Transit"}
        </button>
      )} */}

    </>
  )
}

export default SearchControls

