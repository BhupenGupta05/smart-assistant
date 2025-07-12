import { useState, useRef, useEffect } from 'react'
import { Ellipsis, Utensils, ShoppingBag, Bed, Fuel, Coffee, Hospital, TramFront } from 'lucide-react'
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

const POICategory = [
    { label: "Restaurants", type: "restaurant", icon: Utensils },
    { label: "Shopping", type: "shopping_mall", icon: ShoppingBag },
    { label: "Petrol", type: "gas_station", icon: Fuel },
    { label: "Hotels", type: "lodging", icon: Bed },
    { label: "Hospitals & Clinics", type: "hospital", icon: Hospital },
    { label: "Coffee", type: "cafe", icon: Coffee },
    { label: "Transit Stations", type: "transit_station", icon: TramFront },
    { label: "More", type: "more", icon: Ellipsis }
]


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
    const { aqi, loading: aqiLoading, error: aqiError } = useAQI(shouldFetchAQI ? coords[0] : null, shouldFetchAQI ? coords[1] : null);


    // Disable Transit Layer Automatically When POI Type Changes
    useEffect(() => {
        if (poiType !== 'transit_station') {
            setShowTransitLayer(false);
        }
    }, [poiType]);


    return (
        <div className='relative h-screen w-screen'>

            {/* SEARCH BAR + SUGGESTIONS */}
            <SearchBar
                query={query}
                setQuery={setQuery}
                setPosition={setPosition}
                setSelectedPlace={setSelectedPlace} />

            {/* IMPLEMENT THIS */}



            {/* AQI INDICATOR USING USEAQI HOOK */}
            {/* {!aqiLoading && aqi && (
                <div className="absolute top-4 left-4 z-[1000]">
                    {(() => {
                        const { level, color } = getAQILevel(aqi.aqi);
                        return (
                            <div className={`text-white text-sm font-medium px-3 py-2 rounded shadow-lg ${color}`}>
                                AQI: {aqi.aqi} – {level}
                            </div>
                        );
                    })()}
                </div>
            )} */}

            {aqiLoading && (
                <div className="absolute top-4 left-4 z-[1000] bg-gray-200 text-gray-800 px-3 py-2 rounded shadow">
                    Loading AQI...
                </div>
            )}

            {aqiError && (
                <div className="absolute top-4 left-4 z-[1000] bg-red-100 text-red-600 px-3 py-2 rounded shadow">
                    Failed to load AQI
                </div>
            )}


            {/* Different POI types to choose from */}
            <div className='absolute top-[80px] left-0 right-0 z-[999] flex justify-center'>
                <div className='flex overflow-x-auto gap-2 py-2 no-scrollbar'>
                    {POICategory.map(({ label, type, icon: Icon }) => (
                        <button
                            key={type}
                            onClick={() => setPoiType(type)}
                            className={`flex gap-2 items-center whitespace-nowrap text-sm px-4 py-1 rounded-full shadow-sm transition ${poiType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>


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
                        {poiResults.map((poi, idx) => {
                            const poiId = poi.place_id || idx;
                            const isActive = activePOIId === poiId;

                            return (
                                <Marker
                                    key={idx}
                                    position={[poi.lat, poi.lng]}
                                    icon={poiType === 'transit_station' ? transitIcon : (isActive ? highlightedPoiIcon : poiIcon)}
                                    eventHandlers={{
                                        mouseover: () => setActivePOIId(poiId),
                                        mouseout: () => !selectedPlace && setActivePOIId(null),
                                        click: () => {
                                            setSelectedPlace(poi);
                                            setActivePOIId(poiId);
                                        }
                                    }}>
                                    <Popup>
                                        <strong>{poi.name}</strong><br />
                                        📍 {poi.address}<br />
                                        ⭐ {poi.user_ratings_total} ratings
                                    </Popup>
                                </Marker>
                            )
                        })}


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
