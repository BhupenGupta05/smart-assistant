//React
import { useRef, lazy, Suspense, useCallback } from 'react'
import "leaflet/dist/leaflet.css";

//POI
import usePOIInteraction from '../features/poi/controllers/usePOIInteraction';
import usePOICategory from '../features/poi/controllers/usePOICategory';

// Map
import MapControls from '../map/components/mapControls/ui/MapControls'
import MapRenderer from '../map/components/mapRenderer/ui/MapRenderer'

// Controllers
import { useMapUI } from '../providers/MapUIProvider';
import { useDirectionsController } from '../features/directions/controllers/useDirectionsController';
import { useMapDataController } from './controllers/useMapDataController';
import { useAssistant } from '../hooks/useAssistant';

// UI
import { ResponsiveWeatherWidget } from '../features/weather/ui/ResponsiveWeatherWidget';
import Sidebar from '../features/poi/ui/Sidebar';

// Lazy 
const BottomSheet = lazy(() => import('../features/poi/ui/BottomSheet'));
const DirectionsPanel = lazy(() => import('../features/directions/ui/DirectionsPanel'));
const Recenter = lazy(() => import('../components/Recenter'));

// Loading components
const LoadingFallback = () => (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg px-4 py-2">
            <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Loading...</span>
            </div>
        </div>
    </div>
);

const DirectionsPanelFallback = () => (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
        </div>
    </div>
);


const MapView = ({ setQuery, poiIntent }) => {
    const mapRef = useRef(null); // Using same map instance

    const { isOnline } = useAssistant();

    const { mode} = useMapUI();

    const {
        position,
        setPosition,
        selectedPlace,
        setSelectedPlace,

        aqi,

        weather,

        envLoading,
        envError,

        poiResults,
        poiLoading,
        poiError,
        poiType,
        setPoiType,
    } = useMapDataController({ poiIntent });


    const poiCategory = usePOICategory();

    const directions = useDirectionsController();

    const poiInteraction = usePOIInteraction({
        setSelectedPlace,
        clearRoutes: directions.clearRoutes,
        position
    });

    // USING WITH A PROXY SERVER
    const tileUrl = `${import.meta.env.VITE_BASE_URL}/api/tiles/{z}/{x}/{y}`;

    const handleCategorySelect = useCallback((type) => {
        const intent = poiCategory.onCategorySelect(type);
        if (!intent) return;
        
        setPoiType(intent);
    }, [poiCategory, setPoiType]);

    return (
        <div className='relative h-screen w-screen'>

            {/* MAP CONTROLS */}
            <MapControls
                setPosition={setPosition}
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
                poiType={poiType}
                routes={directions.routes}
                getDirections={directions.getDirections}
                loading={directions.loading}
                error={directions.error}
                clearRoutes={directions.clearRoutes}
                showMore={poiCategory.showMore}
                onCategorySelect={handleCategorySelect}
                closeMore={poiCategory.closeMore}
                isOnline={isOnline}
            />


            <div className='fixed inset-0 overflow-hidden'>
                {/* MAP RENDERER */}
                <div className='absolute inset-0 z-0'>
                    <MapRenderer
                        mapRef={mapRef}
                        position={position}
                        selectedPlace={selectedPlace}
                        poiResults={poiResults}
                        setSelectedPlace={setSelectedPlace}
                        poiType={poiType}
                        tileUrl={tileUrl}
                        routes={directions.routes}
                        />
                </div>

                {/* DESKTOP POI SIDEBAR */}
                {selectedPlace && (
                    <Sidebar
                        place={selectedPlace}
                        onNavigate={poiInteraction.startDirectionsWith}
                        onClose={() => setSelectedPlace(null)}
                    />
                )}




                {/* RECENTER BUTTON */}
                {(selectedPlace || poiType || position) && (
                    // NOW, THIS ACCOMODATES CENTERING ROUTE ALSO
                    <Suspense fallback={null}>
                        <Recenter
                            mapRef={mapRef}
                            routes={directions.routes}
                            setPosition={setPosition}
                            setSelectedPlace={setSelectedPlace}
                        />
                    </Suspense>


                )}

                <ResponsiveWeatherWidget
                    aqi={aqi}
                    weather={weather}
                    loading={envLoading}
                    error={envError} />



                {/* BOTTOMSHEET */}
                {/* HIDE BOTTOMSHEET WHEN A PLACE IS SELECTED ON MOBILE ONLY */}
                {mode === "search" && !selectedPlace && (
                    <Suspense fallback={<LoadingFallback />}>
                        <BottomSheet
                            position={position}
                            poiType={poiType}
                            poiResults={poiResults}
                            poiLoading={poiLoading}
                            poiError={poiError}
                            selectedPlace={selectedPlace}
                            setSelectedPlace={setSelectedPlace}
                            onDirections={poiInteraction.startDirectionsWith}
                        />
                    </Suspense>

                )}


                {mode === "directions" && (
                    <Suspense fallback={<DirectionsPanelFallback />}>
                        <DirectionsPanel
                            routes={directions.routes}
                            />
                    </Suspense>

                )}

            </div>
        </div>
    )
}

export default MapView
