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
                    {( selectedPlace || poiType || position ) && (
                        <Recenter
                        mapRef={mapRef}
                        setPosition={setPosition}
                        setSelectedPlace={setSelectedPlace} />
                    )}
                    
                    {/* {(selectedPlace || poiType || position) && (
                        <button className='absolute bottom-24 right-4 z-[1000] bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition'
                            onClick={() => {
                                if (!navigator.geolocation) {
                                    alert("Geolocation is not enabled by your browser.");
                                    return;
                                }

                                navigator.geolocation.getCurrentPosition(
                                    (pos) => {
                                        const coords = [pos.coords.latitude, pos.coords.longitude];
                                        setPosition(coords);
                                        setSelectedPlace(null);
                                        mapRef.current?.flyTo(coords, 13);
                                    },
                                    (err) => {
                                        alert("Please enable location access to recenter the map.");
                                        console.error("Geolocation error:", err.message);
                                    }
                                );
                            }}>
                            <Locate size={20} className='text-blue-600' />
                        </button>
                    )} */}


                </div>


                {/* POI SIDEBAR */}
                {poiType && (
                    <div className='absolute bottom-0 left-0 right-0 z-10 bg-white max-h-[45%] overflow-y-auto p-4 shadow-xl border-t rounded-t-lg'>
                        <h2 className="text-lg font-semibold mb-3">Nearby Places</h2>

                        {poiLoading && <p className="text-gray-500">Loading nearby places...</p>}
                        {poiError && !poiLoading && <p className="text-red-500 mb-2">{poiError}</p>}
                        {!poiError && !poiLoading && poiResults.length === 0 && <p>No places found.</p>}

                        <ul className="space-y-3">
                            {poiResults.map((place, idx) => {
                                const poiId = place.place_id || idx;
                                const isActive = activePOIId === poiId;

                                return (
                                    <div
                                        key={idx}
                                        className={`flex flex-col sm:flex-row gap-3 border rounded-lg p-3 shadow-sm cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                                            }`}
                                        onMouseEnter={() => setActivePOIId(poiId)}
                                        onMouseLeave={() => !selectedPlace && setActivePOIId(null)}
                                        onClick={() => {
                                            setSelectedPlace(place);
                                            setActivePOIId(poiId);
                                        }}
                                    >
                                        {/* Image (Optional) */}
                                        {place.photos?.length > 0 ? (
                                            <img
                                                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${place.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                                                alt={place.name}
                                                className="w-24 h-24 object-cover rounded-md border"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md text-xs text-gray-500">
                                                No Image
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="flex flex-col justify-between flex-1">
                                            <div>
                                                <p className="text-base font-semibold">{place.name}</p>
                                                {/* <p className="text-xs text-gray-500">{place.vicinity || place.address}</p> */}

                                                <div className="flex items-center gap-2 text-xs mt-1">
                                                    <span>{place.rating} ⭐</span>
                                                    <span>({place.user_ratings_total})</span>
                                                    <span
                                                        className={`font-semibold ${place.opening_hours ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                    >
                                                        {place.opening_hours
                                                            ? 'Open'
                                                            : 'Closed'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Utility Buttons */}
                                            <div className="flex gap-3 mt-2">
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                                        place.name
                                                    )}&destination_place_id=${place.place_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-xs underline"
                                                >
                                                    Directions
                                                </a>
                                                {place.website && (
                                                    <a
                                                        href={place.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 text-xs underline"
                                                    >
                                                        Website
                                                    </a>
                                                )}
                                                {place.formatted_phone_number && (
                                                    <a
                                                        href={`tel:${place.formatted_phone_number}`}
                                                        className="text-blue-600 text-xs underline"
                                                    >
                                                        Call
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </ul>
                    </div>

                )}

            </div>
        </div>
    )
}

export default MapView
