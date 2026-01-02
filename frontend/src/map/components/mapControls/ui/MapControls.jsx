// Component to manage map controls for searching locations and getting directions

import "leaflet/dist/leaflet.css";
import SearchControls from "../../../controls/searchControls/ui/Container";
import DirectionControls from '../../../controls/directionControls/ui/Container'
import POICategory from "../../../../features/poi/ui/POICategory";
import Chatbot from "../../../../components/Chatbot";
import { useSearchSelection } from "../../../../features/search/hooks/useSearchSelection";

const MapControls = ({
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
    aqi,
    aqiLoading,
    aqiError,
    poiType,
    setPoiType,
    showTransitLayer,
    setShowTransitLayer,
    searchRef,
    directionsRef,
    routes,
    getDirections,
    loading,
    error,
    mode,
    setMode,
    clearRoutes,
    clearPOIs,
    refetchPOIs,
    showMore,
    onCategorySelect,
    closeMore
}) => {

    useSearchSelection({
        selectedPlace,
        mode,
        activeField,
        setPosition,
        setOrigin,
        setDestination,
        setActiveField,
        clearSelection: () => setSelectedPlace(null)
    })

    return (
        <>
            {mode === "search" && (

                <>
                    <SearchControls
                        query={query}
                        setQuery={setQuery}
                        setOrigin={setOrigin}
                        setPosition={setPosition}
                        selectedPlace={selectedPlace}
                        setSelectedPlace={setSelectedPlace}
                        setDestination={setDestination}
                        setActiveField={setActiveField}
                        setMode={setMode}
                        aqi={aqi}
                        aqiLoading={aqiLoading}
                        aqiError={aqiError}
                        poiType={poiType}
                        setPoiType={setPoiType}
                        showTransitLayer={showTransitLayer}
                        setShowTransitLayer={setShowTransitLayer}
                        searchRef={searchRef}
                    />


                    {/* 🏷️ POI CATEGORIES */}
                    <POICategory poiType={poiType} showMore={showMore} onCategorySelect={onCategorySelect} closeMore={closeMore} />
                </>

            )}

            {/* ALWAYS MOUNT IT */}
            <div style={{ display: mode === "search" ? "none" : "block" }}>
                <DirectionControls
                    query={query}
                    setQuery={setQuery}
                    origin={origin}
                    setOrigin={setOrigin}
                    destination={destination}
                    setDestination={setDestination}
                    activeField={activeField}
                    setActiveField={setActiveField}
                    setPosition={setPosition}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace}
                    routes={routes}
                    getDirections={getDirections}
                    loading={loading}
                    error={error}
                    setMode={setMode}
                    clearRoutes={clearRoutes}
                    ref={directionsRef}
                />
            </div>

            <div className="absolute bottom-4 right-4 z-[1000] w-[300px]">
                <Chatbot />
            </div>
        </>
    )
}

export default MapControls
