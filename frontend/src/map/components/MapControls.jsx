import POICategory from "./POICategory"
import SearchBar from "./SearchBar"
import AQIIndicator from "./AQIIndicator"
import "leaflet/dist/leaflet.css";

const MapControls = ({
    query,
    setQuery,
    setPosition,
    setSelectedPlace,
    aqi,
    aqiLoading,
    aqiError,
    poiType,
    setPoiType,
    showTransitLayer,
    setShowTransitLayer
}) => {
    return (
        <>
            {/* SEARCH BAR + SUGGESTIONS */}
            <SearchBar
                query={query}
                setQuery={setQuery}
                setPosition={setPosition}
                setSelectedPlace={setSelectedPlace} />


            {/* AQI INDICATOR USING USEAQI HOOK */}
            {!aqiLoading && aqi && (
                <div className="absolute top-4 right-4 z-[1000]">
                    <AQIIndicator
                        aqi={aqi}
                        loading={false}
                        error={aqiError} />
                </div>
            )}

            {/* Different POI types to choose from */}
            <POICategory
                poiType={poiType}
                setPoiType={setPoiType} />

            {/* TOGGLE TRANSIT LAYER */}
            {poiType === 'transit_station' && (
                <button
                    onClick={() => setShowTransitLayer(!showTransitLayer)}
                    className="absolute top-[130px] right-4 z-[1000] bg-white px-4 py-2 rounded-full shadow-md border text-sm font-medium hover:bg-gray-100 transition"
                >
                    {showTransitLayer ? "Hide Transit" : "Show Transit"}
                </button>
            )}


        </>
    )
}

export default MapControls
