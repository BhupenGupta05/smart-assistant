import { useState, useRef, useEffect, useMemo, lazy, useCallback } from 'react'
import "leaflet/dist/leaflet.css";
import { usePOI } from '../hooks/usePOIContext';
import { useGeolocation } from '../hooks/useGeolocationContext';
import { useAQI } from '../hooks/useAQI';
const POISidebar = lazy(() => import('./components/POISidebar'));
import MapControls from './components/MapControls';
// const MapControls = lazy(() => import('./components/MapControls'));
import MapRenderer from './components/MapRenderer';
// const MapRenderer = lazy(() => import( './components/MapRenderer'));
const DirectionsPanel = lazy(() => import('../components/DirectionsPanel'));
const Recenter = lazy(() => import('./components/Recenter'));
import { useDirections } from '../hooks/useDirections'


const MapView = ({ query, setQuery, showTransitLayer, setShowTransitLayer, searchRef, directionsRef }) => {
    const mapRef = useRef(null); // Using same map instance

    const [mode, setMode] = useState("search"); // Mode is basically either we want to just search for a place or get directions
    const [selectedMode, setSelectedMode] = useState(null); // Mode of transportation for directions: driving, walking, transit
    const [origin, setOrigin] = useState(null);  // Confirmed origin coordinates
    const [destination, setDestination] = useState(null); // Confirmed destination coordinates
    const [activeField, setActiveField] = useState(null); // State to manage which input field is active (origin or destination)
    const [hoverPOIId, setHoverPOIId] = useState(null); // Store active POI ID for highlighting 


    const { position, setPosition, selectedPlace, setSelectedPlace, getCoords } = useGeolocation();
    const { poiResults, poiLoading, poiError, poiType, setPoiType, refetchPOIs, clearPOIs } = usePOI();

    const activePOIId = useMemo(() => selectedPlace?.place_id || hoverPOIId, [selectedPlace, hoverPOIId]); // Use selected place ID or hover ID for active POI

    const { routes, loading: dirLoading, error: dirError, getDirections, clearRoutes } = useDirections();



    // | Check                                                                  | What it's doing                                     | Why it's needed                    |
    // | ---------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------- |
    // | `rawCoords &&`                                                         | Makes sure `rawCoords` is not `null` or `undefined` | Avoids crashes                     |
    // | `Array.isArray(rawCoords)`                                             | Makes sure it's an array                            | Coordinates should be `[lat, lng]` |
    // | `rawCoords.length === 2`                                               | Ensures there are exactly 2 items                   | Should be lat & lng only           |
    // | `typeof rawCoords[0] === 'number' && typeof rawCoords[1] === 'number'` | Makes sure both are numbers                         | Prevents invalid API calls         |
    // | `rawCoords[0] && rawCoords[1]`                                         | Makes sure neither value is `0`, `null`, or `NaN`   | Some APIs reject these             |

    const rawCoords = getCoords();

    const coords = useMemo(() => {
        return (
            rawCoords &&
            Array.isArray(rawCoords) &&
            rawCoords.length === 2 &&
            typeof rawCoords[0] === 'number' &&
            typeof rawCoords[1] === 'number' &&
            rawCoords[0] &&
            rawCoords[1]
        ) ? rawCoords : null;
    }, [rawCoords]);


    const { aqi, aqiLoading, aqiError } = useAQI(coords?.[0] ?? null, coords?.[1] ?? null);


    // USING WITH A PROXY SERVER
    const tileUrl = useMemo(() => `${import.meta.env.VITE_BASE_URL}/api/tiles/{z}/{x}/{y}`, []);


    // Disable Transit Layer Automatically When POI Type Changes
    useEffect(() => {
        if (poiType !== 'transit_station') {
            setShowTransitLayer(false);
        }
    }, [poiType, setShowTransitLayer]);


    // By default, set selectedMode to first available mode when routes change
    useEffect(() => {
        if (routes?.length) {
            setSelectedMode(routes[0].mode);
        }
    }, [routes])

    const handleHoverPOI = useCallback((id) => setHoverPOIId(id), []);
    const handleSelectedPlace = useCallback((place) => setSelectedPlace(place), []);
    const handleSetOrigin = useCallback((val) => setOrigin(val), []);
    const handleSetDestination = useCallback((val) => setDestination(val), []);



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
                routes={routes}
                getDirections={getDirections}
                loading={dirLoading}
                error={dirError}
                mode={mode}
                setMode={setMode}
                clearRoutes={clearRoutes}
                clearPOIs={clearPOIs}
                refetchPOIs={refetchPOIs} />


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
                        routes={routes}
                        mode={mode}
                        setMode={setMode}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode} />
                </div>

                {/* RECENTER BUTTON */}
                {(selectedPlace || poiType || position) && (
                    // <Recenter
                    //     mapRef={mapRef}
                    //     setPosition={setPosition}
                    //     setSelectedPlace={setSelectedPlace}
                    // />

                    // NOW, THIS ACCOMODATES CENTERING ROUTE ALSO
                    <Recenter
                        mapRef={mapRef}
                        mode={mode}
                        routes={routes}
                        selectedMode={selectedMode}
                        setPosition={setPosition}
                        setSelectedPlace={setSelectedPlace}
                    />

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
                        setOrigin={setOrigin} // NEW
                        setDestination={setDestination}
                        setMode={setMode}
                        position={position}
                        clearRoutes={clearRoutes} />
                )}

                {mode === "directions" && (
                    <DirectionsPanel
                        routes={routes}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode}
                        directionsRef={directionsRef} />
                )}

            </div>
        </div>
    )
}

export default MapView
