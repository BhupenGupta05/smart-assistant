import { useState, useRef, useEffect, useMemo } from 'react'
import "leaflet/dist/leaflet.css";
import { usePOI } from '../hooks/usePOIContext';
import { useGeolocation } from '../hooks/useGeolocationContext';
import { useAQI } from '../hooks/useAQI';
import POISidebar from './components/POISidebar';
import MapControls from './components/MapControls';
import MapRenderer from './components/MapRenderer';


const MapView = () => {
    const mapRef = useRef(null);

    const [query, setQuery] = useState(''); // Search query state
    const { position, setPosition, selectedPlace, setSelectedPlace, getCoords } = useGeolocation();
    const { poiResults, poiLoading, poiError, poiType, setPoiType, refetchPOIs } = usePOI();
    // const [activePOIId, setActivePOIId] = useState(null); // Store active POI ID for highlighting
    const [hoverPOIId, setHoverPOIId] = useState(null); // Store active POI ID for highlighting
    const [showTransitLayer, setShowTransitLayer] = useState(false); //Show Transit Layer only for transit_station poiType

    const activePOIId = selectedPlace?.place_id || hoverPOIId; // Use selected place ID or hover ID for active POI



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
    const tileUrl = `${import.meta.env.VITE_BASE_URL}/api/tiles/:z/:x/:y`;


    // Disable Transit Layer Automatically When POI Type Changes
    useEffect(() => {
        if (poiType !== 'transit_station') {
            setShowTransitLayer(false);
        }
    }, [poiType]);


    return (
        <div className='relative h-screen w-screen'>

            {/* MAP CONTROLS */}
            <MapControls
                query={query}
                setQuery={setQuery}
                setPosition={setPosition}
                setSelectedPlace={setSelectedPlace}
                aqi={aqi}
                aqiLoading={aqiLoading}
                aqiError={aqiError}
                poiType={poiType}
                setPoiType={setPoiType}
                showTransitLayer={showTransitLayer}
                setShowTransitLayer={setShowTransitLayer} />


            <div className='fixed inset-0 overflow-hidden'>
                {/* MAP RENDERER */}
                <div className='absolute inset-0 z-0'>
                    <MapRenderer
                        mapRef={mapRef}
                        position={position}
                        selectedPlace={selectedPlace}
                        poiResults={poiResults}
                        activePOIId={activePOIId}
                        setHoverPOIId={setHoverPOIId}
                        setSelectedPlace={setSelectedPlace}
                        poiType={poiType}
                        showTransitLayer={showTransitLayer}
                        tileUrl={tileUrl}
                        setPosition={setPosition} />
                </div>


                {/* POI SIDEBAR */}
                <POISidebar
                    poiType={poiType}
                    poiResults={poiResults}
                    poiLoading={poiLoading}
                    poiError={poiError}
                    activePOIId={activePOIId}
                    setActivePOIId={setHoverPOIId}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace} />

            </div>
        </div>
    )
}

export default MapView
