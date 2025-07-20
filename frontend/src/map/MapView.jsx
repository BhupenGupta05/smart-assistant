import { useState, useRef, useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import FlyToLocation from './FlyToLocation';
import L from 'leaflet';
import { usePOI } from '../hooks/usePOIContext';
import { useGeolocation } from '../hooks/useGeolocationContext';
import { useAQI } from '../hooks/useAQI';
import SearchBar from './components/SearchBar';
import Recenter from './components/Recenter';
import POISidebar from './components/POISidebar';
import POICategory from './components/POICategory';
import AQIIndicator from './components/AQIIndicator';
import POIMarker from './components/POIMarker';

const userIcon = new L.Icon({
    iconUrl: "https://mapmarker.io/api/v3/font-awesome/v6/icon?icon=fa-solid%20fa-map-pin&size=30&color=F56565",
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
    popupAnchor: [0, -30],
})

const transitIcon = new L.Icon({
    iconUrl: "https://mapmarker.io/api/v3/font-awesome/v6/icon?icon=fa-solid%20fa-train&size=20&color=FF9800",
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
    popupAnchor: [0, -30],
});


const poiIcon = new L.Icon({
    iconUrl: "https://mapmarker.io/api/v3/font-awesome/v6/icon?icon=fa-solid%20fa-map-pin&size=30&color=2196F3",
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    popupAnchor: [0, -30],
})

const highlightedPoiIcon = new L.Icon({
    iconUrl: "https://mapmarker.io/api/v3/font-awesome/v6/icon?icon=fa-solid%20fa-map-pin&size=30&color=4CAF50",
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
    popupAnchor: [0, -30],
});




const MapView = () => {
    const mapRef = useRef(null);

    const [query, setQuery] = useState(''); // Search query state
    // const [cache, setCache] = useState({});  //OLD

    const { position, setPosition, selectedPlace, setSelectedPlace, getCoords } = useGeolocation();
    const { poiResults, poiLoading, poiError, poiType, setPoiType, refetchPOIs } = usePOI();


    const [activePOIId, setActivePOIId] = useState(null); // Store active POI ID for highlighting


    const [showTransitLayer, setShowTransitLayer] = useState(false); //Show Transit Layer only for transit_station poiType

    const coords = getCoords();
    const shouldFetchAQI = coords && coords.length === 2 && coords[0] && coords[1];
    const { aqi, aqiLoading, aqiError } = useAQI(shouldFetchAQI ? coords[0] : null, shouldFetchAQI ? coords[1] : null);


    // Disable Transit Layer Automatically When POI Type Changes
    useEffect(() => {
        if (poiType !== 'transit_station') {
            setShowTransitLayer(false);
        }
    }, [poiType]);

    // MEMOIZE ALL POI MARKERS
    const memoizedPOIMarkers = useMemo(() => {
        return poiResults.map((poi, idx) => {
            const poiId = poi.place_id || idx;
            const isActive = activePOIId === poiId;

            const icon = poiType === 'transit_station' ? transitIcon : (isActive ? highlightedPoiIcon : poiIcon);

            return (
                <POIMarker
                    key={poiId}
                    poi={poi}
                    poiId={poiId}
                    icon={icon}
                    onMouseOver={(id) => setActivePOIId(id)}
                    onMouseOut={() => !selectedPlace && setActivePOIId(null)}
                    onClick={(poi) => {
                        setSelectedPlace(poi);
                        setActivePOIId(poiId);
                    }} />
            )
        })
    }, [poiResults, activePOIId, poiType, selectedPlace])


    return (
        <div className='relative h-screen w-screen'>

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
                        loading={aqiLoading}
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


            <div className='fixed inset-0 overflow-hidden'>
                {/* MAP VIEW */}
                <div className='absolute inset-0 z-0'>
                    <MapContainer center={position} ref={mapRef} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

                        {/* TRANSIT LAYER */}
                        {showTransitLayer && (
                            <TileLayer
                                url={`https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${import.meta.env.VITE_THUNDERFOREST_API_KEY}`}
                                attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, © OpenStreetMap contributors'
                            />

                        )}


                        {/* SELECTED LOCATION */}
                        {selectedPlace && (
                            <>
                                <Marker position={[selectedPlace.lat, selectedPlace.lng]} icon={userIcon}>
                                    <Popup>
                                        <strong>{selectedPlace.address}</strong>
                                    </Popup>
                                </Marker>
                            </>
                        )}

                        {/* CURRENT LOCATION */}
                        {!selectedPlace && position && (
                            <>
                                <Marker position={position} icon={userIcon}>
                                    <Popup>
                                        <strong>Your Location</strong>
                                    </Popup>
                                </Marker>
                            </>
                        )}


                        {/* NEARBY POIs */}
                        {memoizedPOIMarkers}

                        {/* RECENTER TO SELECTED OR CURRENT LOCATION */}
                        <FlyToLocation coords={getCoords()} />
                    </MapContainer>


                    {/* RECENTER BUTTON */}
                    {(selectedPlace || poiType || position) && (
                        <Recenter
                            mapRef={mapRef}
                            setPosition={setPosition}
                            setSelectedPlace={setSelectedPlace} />
                    )}
                </div>


                {/* POI SIDEBAR */}
                <POISidebar
                    poiType={poiType}
                    poiResults={poiResults}
                    poiLoading={poiLoading}
                    poiError={poiError}
                    activePOIId={activePOIId}
                    setActivePOIId={setActivePOIId}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace} />

            </div>
        </div>
    )
}

export default MapView
