import { useRef, useEffect, useMemo, lazy } from 'react'
import "leaflet/dist/leaflet.css";
import usePOIInteraction from '../features/poi/controllers/usePOIInteraction';
import usePOICategory from '../features/poi/controllers/usePOICategory';

import MapControls from '../map/components/mapControls/ui/MapControls'
import MapRenderer from './components/MapRenderer';

import { useMap } from './controllers/useMap';
import { useDirectionsController } from '../features/directions/controllers/useDirectionsController';
import { useMapDataController } from './controllers/useMapDataController';
import { useTransitLayer } from '../features/transit-layer/controllers/useTransitLayer'
import WeatherContextPanel from '../features/weather/ui/WeatherContextPanel';

const POISidebar = lazy(() => import('../features/poi/ui/POISidebar'));
const DirectionsPanel = lazy(() => import('../features/directions/ui/DirectionsPanel'));
const Recenter = lazy(() => import('../components/Recenter'));

const MapView = ({ query, setQuery, showTransitLayer, setShowTransitLayer, searchRef, directionsRef, poiIntent }) => {
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
        weatherLoading,
        weatherError,

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
        activePOIId,

        //setters
        setMode,
        setSelectedMode,
        setOrigin,
        setDestination,
        setActiveField,
        setHoverPOIId } = map;


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
                aqi={aqi}
                aqiLoading={aqiLoading}
                aqiError={aqiError}
                poiType={poiType}
                setPoiType={setPoiType}
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
                clearPOIs={clearPOIs}
                refetchPOIs={refetchPOIs}
                showMore={poiCategory.showMore}
                onCategorySelect={(type) => {
                    const intent = poiCategory.onCategorySelect(type);
                    if (!intent) return;
                    setPoiType(intent);
                }}
                closeMore={poiCategory.closeMore} />


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
                        activePOIId={activePOIId}
                        setHoverPOIId={setHoverPOIId}
                        setSelectedPlace={setSelectedPlace}
                        poiType={poiType}
                        showTransitLayer={showTransitLayer}
                        tileUrl={tileUrl}
                        setPosition={setPosition}
                        routes={directions.routes}
                        mode={mode}
                        setMode={setMode}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode} />
                </div>

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

                {(selectedPlace || poiType || position) && !weatherError && !weatherLoading && (
                    <WeatherContextPanel
                        aqi={aqi}
                        weather={weather}
                        loading={envLoading}
                        error={envError} />
                )}


                {/* POI SIDEBAR */}
                {mode === "search" && (
                    <POISidebar
                        poiType={poiType}
                        poiResults={poiResults}
                        poiLoading={poiLoading}
                        poiError={poiError}
                        activePOIId={activePOIId}
                        setActivePOIId={setHoverPOIId}
                        selectedPlace={selectedPlace}
                        setSelectedPlace={setSelectedPlace}
                        onDirections={poiInteraction.startDirectionsWith} />
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
