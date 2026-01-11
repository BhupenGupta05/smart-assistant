import { useRef, useEffect, useMemo, lazy } from 'react'
import "leaflet/dist/leaflet.css";
import usePOIInteraction from '../features/poi/controllers/usePOIInteraction';
import usePOICategory from '../features/poi/controllers/usePOICategory';

import MapControls from '../map/components/mapControls/ui/MapControls'
import MapRenderer from '../map/components/mapRenderer/ui/MapRenderer'

import { useMap } from './controllers/useMap';
import { useDirectionsController } from '../features/directions/controllers/useDirectionsController';
import { useMapDataController } from './controllers/useMapDataController';
import { ResponsiveWeatherWidget } from '../features/weather/ui/ResponsiveWeatherWidget';
import Sidebar from '../features/poi/ui/Sidebar';
import POIDetails from '../features/poi/ui/POIDetails';

// const POISidebar = lazy(() => import('../features/poi/ui/POISidebar'));
const BottomSheet = lazy(() => import('../features/poi/ui/BottomSheet'));
const DirectionsPanel = lazy(() => import('../features/directions/ui/DirectionsPanel'));
const Recenter = lazy(() => import('../components/Recenter'));

const MapView = ({ query, setQuery, showTransitLayer, setShowTransitLayer, searchRef, directionsRef, poiIntent, isOnline }) => {
    const mapRef = useRef(null); // Using same map instance
    const lastAIIntentRef = useRef(null);

    const map = useMap();
    const {
        position,
        setPosition,
        selectedPlace,
        setSelectedPlace,

        aqi,
        aqiLoading,
        aqiError,

        weather,

        envLoading,
        envError,

        poiResults,
        poiLoading,
        poiError,
        poiType,
        setPoiType,
        refetchPOIs,
        clearPOIs
    } = useMapDataController();

    const {
        //states 
        mode,
        selectedMode,
        origin,
        destination,
        activeField,
        hoverPOIId,

        //setters
        setMode,
        setSelectedMode,
        setOrigin,
        setDestination,
        setActiveField,
        setHoverPOIId,
    } = map;


    const poiCategory = usePOICategory();

    const directions = useDirectionsController({ selectedMode, setSelectedMode });

    const poiInteraction = usePOIInteraction({
        setOrigin,
        setDestination,
        setMode,
        setSelectedPlace,
        clearRoutes: directions.clearRoutes,
        position
    })

    // USING WITH A PROXY SERVER
    const tileUrl = useMemo(() => `${import.meta.env.VITE_BASE_URL}/api/tiles/{z}/{x}/{y}`, []);

    // useTransitLayer({ poiType, showTransitLayer, setShowTransitLayer });

    useEffect(() => {
        if (!poiIntent) return;

        if (lastAIIntentRef.current === poiIntent) return;

        lastAIIntentRef.current = poiIntent;

        setPoiType(poiIntent);
    }, [poiIntent, setPoiType]);


    return (
        <div className='relative h-screen w-screen'>

            {/* MAP CONTROLS */}
            <MapControls
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
                poiType={poiType}
                showTransitLayer={showTransitLayer}
                setShowTransitLayer={setShowTransitLayer}
                searchRef={searchRef}
                directionsRef={directionsRef}
                routes={directions.routes}
                getDirections={directions.getDirections}
                loading={directions.loading}
                error={directions.error}
                mode={mode}
                setMode={setMode}
                clearRoutes={directions.clearRoutes}
                showMore={poiCategory.showMore}
                onCategorySelect={(type) => {
                    const intent = poiCategory.onCategorySelect(type);
                    if (!intent) return;
                    setPoiType(intent);
                }}
                closeMore={poiCategory.closeMore}
                isOnline={isOnline} 
                />


            <div className='fixed inset-0 overflow-hidden'>
                {/* MAP RENDERER */}
                <div className='absolute inset-0 z-0'>
                    <MapRenderer
                        mapRef={mapRef}
                        position={position}
                        origin={origin}
                        destination={destination}
                        selectedPlace={selectedPlace}
                        poiResults={poiResults}
                        hoverPOIId={hoverPOIId} //new
                        setHoverPOIId={setHoverPOIId}
                        setSelectedPlace={setSelectedPlace}
                        poiType={poiType}
                        showTransitLayer={showTransitLayer}
                        tileUrl={tileUrl}
                        routes={directions.routes}
                        mode={mode}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode} />
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
                    <Recenter
                        mapRef={mapRef}
                        mode={mode}
                        routes={directions.routes}
                        selectedMode={selectedMode}
                        setPosition={setPosition}
                        setSelectedPlace={setSelectedPlace}
                    />

                )}

                {(selectedPlace || poiType || position) && (
                    <ResponsiveWeatherWidget
                        aqi={aqi}
                        weather={weather}
                        loading={envLoading}
                        error={envError} />
                )}


                {/* BOTTOMSHEET */}
                {/* HIDE BOTTOMSHEET WHEN A PLACE IS SELECTED ON MOBILE ONLY */}
                {mode === "search" && !selectedPlace && (
                    <BottomSheet
                        poiType={poiType}
                        poiResults={poiResults}
                        poiLoading={poiLoading}
                        poiError={poiError}
                        selectedPlace={selectedPlace}
                        setSelectedPlace={setSelectedPlace}
                        setHoverPOIId={setHoverPOIId}
                        onDirections={poiInteraction.startDirectionsWith}
                    />
                )}


                {mode === "directions" && (
                    <DirectionsPanel
                        routes={directions.routes}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode}
                        directionsRef={directionsRef} />
                )}

            </div>
        </div>
    )
}

export default MapView
