import POICategory from "./POICategory"
import SearchBar from "./SearchBar"
import AQIIndicator from "./AQIIndicator"
import POIDetails from "./POIDetails"
import Chatbot from "../../components/Chatbot";
import "leaflet/dist/leaflet.css";

const MapControls = ({
    query,
    setQuery,
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
    searchRef
}) => {
    return (
        <>
            {/* SEARCH BAR + SUGGESTIONS */}
            <SearchBar
                ref={searchRef}
                // query={query}
                // setQuery={setQuery}
                setPosition={setPosition}
                setSelectedPlace={setSelectedPlace} />

            {/* DETAILS BOTTOM BAR */}
            {selectedPlace && (
                <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-white shadow-xl z-[1000] overflow-y-auto rounded-t-xl">
                    <POIDetails place={selectedPlace} onBack={() => setSelectedPlace(null)} />
                </div>
            )}


            {/* Chatbot - bottom right corner */}
            <div className="absolute bottom-4 right-4 z-[1000] w-[300px]">
                <Chatbot />
            </div>



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
