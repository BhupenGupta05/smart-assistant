// Component to manage map controls for searching locations and getting directions

import "leaflet/dist/leaflet.css";
import SearchControls from "../../../controls/searchControls/ui/Container";
import DirectionControls from '../../../controls/directionControls/ui/Container'
import POICategory from "../../../../features/poi/ui/POICategory";
import Chatbot from "../../../../components/chatbot/ui/Chatbot";
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
    poiType,
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
    showMore,
    onCategorySelect,
    closeMore,
    isOnline
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
            {(mode === "search" || mode === "report") && (

                <>
                    <SearchControls
                        query={query}
                        setQuery={setQuery}
                        setPosition={setPosition}
                        setSelectedPlace={setSelectedPlace}
                        showTransitLayer={showTransitLayer}
                        setShowTransitLayer={setShowTransitLayer}
                        searchRef={searchRef}
                        isOnline={isOnline}
                        mode={mode}
                        setMode={setMode}
                    />


                    {/* POI CATEGORIES */}
                    <POICategory poiType={poiType} showMore={showMore} onCategorySelect={onCategorySelect} closeMore={closeMore} />
                </>

            )}

            {/* ALWAYS MOUNT IT  */}
            {/* New changes */}
            <div style={{ display: mode === "directions" ? "block" : "none" }}>
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
