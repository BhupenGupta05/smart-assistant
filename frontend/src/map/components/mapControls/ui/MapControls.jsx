// Component to manage map controls for searching locations and getting directions

import "leaflet/dist/leaflet.css";
import SearchControls from "../../../controls/searchControls/ui/Container";
import DirectionControls from '../../../controls/directionControls/ui/Container'
import POICategory from "../../../../features/poi/ui/POICategory";
import Chatbot from "../../../../components/chatbot/ui/Chatbot";
import { useSearchSelection } from "../../../../features/search/hooks/useSearchSelection";
import { useMapUI } from "../../../../providers/MapUIProvider";
import { usePOI } from "../../../../features/poi/hooks/usePOIContext";

const MapControls = ({
    setPosition,
    selectedPlace,
    setSelectedPlace,
    routes,
    getDirections,
    loading,
    error,
    clearRoutes,
    isOnline,
    onCategorySelect
}) => {

    const { mode } = useMapUI();
    const { poiType, showMore, closeMore } = usePOI();

    useSearchSelection({
        selectedPlace,
        setPosition,
        clearSelection: () => setSelectedPlace(null)
    })

    return (
        <>
            {(mode === "search" || mode === "report") && (

                <>
                    <SearchControls
                        setPosition={setPosition}
                        setSelectedPlace={setSelectedPlace}
                        isOnline={isOnline}
                    />


                    {/* POI CATEGORIES */}
                    <POICategory
                        poiType={poiType}
                        showMore={showMore}
                        onCategorySelect={onCategorySelect}
                        closeMore={closeMore} />
                </>

            )}

            {/* ALWAYS MOUNT IT  */}
            {/* New changes */}
            <div style={{ display: mode === "directions" ? "block" : "none" }}>
                <DirectionControls
                    setPosition={setPosition}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace}
                    routes={routes}
                    getDirections={getDirections}
                    loading={loading}
                    error={error}
                    clearRoutes={clearRoutes}
                />
            </div>

            <div className="absolute bottom-4 right-4 z-[1000] w-[300px]">
                <Chatbot />
            </div>
        </>
    )
}

export default MapControls
