import { useState, useRef, useEffect } from 'react'
import { Ellipsis, Utensils, ShoppingBag, Bed, Fuel, Coffee, Hospital, Locate } from 'lucide-react'
import axios from 'axios';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import FlyToLocation from './FlyToLocation';
import L from 'leaflet';

const userIcon = new L.Icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    popupAnchor: [0, -30],
})

const poiIcon = new L.Icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    popupAnchor: [0, -30],
})

const highlightedPoiIcon = new L.Icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png",
    iconSize: [25, 41],
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
    { label: "More", type: "more", icon: Ellipsis }
]


const MapView = () => {
    const mapRef = useRef(null);

    const [query, setQuery] = useState(''); // Search query state
    const [results, setResults] = useState([]); // Store search results
    const [selectedPlace, setSelectedPlace] = useState(null); // Store the selected place from suggestions
    const [showResults, setShowResults] = useState(false); // Control visibility of suggestions dropdown
    const [cache, setCache] = useState({}); 
    const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)

    const [poiType, setPoiType] = useState(null); // Default POI type
    const [poiResults, setPoiResults] = useState([]); // Store POI results
    const [poiError, setPoiError] = useState(null); // Store POI error if any
    const [poiLoading, setPoiLoading] = useState(false); // Store POI loading state
    const [activePOIId, setActivePOIId] = useState(null); // Store active POI ID for highlighting



    const coords = selectedPlace
        ? [selectedPlace.lat, selectedPlace.lng]
        : position;


    // Get user's current location
    // This will set the initial position of the map
    // and will be used to fetch nearby POIs
    // It will also update the position when the user selects a place from suggestions
    // If the user denies geolocation permission, it will default to London
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            },
            err => {
                console.error("Geolocation error:", err);
            }
        )
    }, [])

    // Fetch nearby POIs based on the current position or selected place
    // If the user selects a place from suggestions, it will update the position and fetch POIs again
    useEffect(() => {
        if (!coords || !poiType) return;

        const fetchPOIs = async () => {
            setPoiLoading(true);
            try {
                const url = `${import.meta.env.VITE_BASE_URL}/api/nearby?lat=${coords[0]}&lng=${coords[1]}&radius=1500&type=${poiType}`;
                const { data } = await axios.get(url);
                setPoiResults(data);
                setPoiError(null);

            } catch (error) {
                console.error("Failed to fetch POIs:", error.message);
                setPoiResults([]);
                setPoiError("Could not connect to the POI service.");
            } finally {
                setPoiLoading(false);
            }
        }

        fetchPOIs();
    }, [JSON.stringify(coords), poiType])


    // Retry fetching POIs every 5 seconds if there was an error
    // This will keep trying to fetch POIs until it succeeds
    // or the component is unmounted
    useEffect(() => {
        if (!poiError) return;

        const retryFecthPOIs = setInterval(async () => {
            try {
                const url = `${import.meta.env.VITE_BASE_URL}/api/nearby?lat=${coords[0]}&lng=${coords[1]}&radius=1500&type=${poiType}`;
                const { data } = await axios.get(url);
                setPoiResults(data);
                setPoiError(null);
            } catch (error) {
                console.log("Retrying POI fetch...");
            }
        }, 5000);

        return () => clearInterval(retryFecthPOIs);
    }, [poiError, coords, poiType])


    // Handle search query input and fetch results
    const handleSearch = async () => {
        if (query.length < 3) return;

        if (cache[query]) {
            console.log("Cached result found for query:", query);
            setResults(cache[query]);
            return;
        }

        const url = `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(query)}`;

        const { data } = await axios.get(url);


        setResults(data);
        setCache((prev) => ({
            ...prev,
            [query]: data
        }))
    }


    // Handle place selection from search results
    // This will set the selected place, update the map position,
    // and clear the search results
    // It will also close the suggestions dropdown
    const handlePlaceSelect = (place) => {
        // console.log("Selected place:", place);
        // console.log("Setting position to:", [place.lat, place.lng]);

        setSelectedPlace(place);
        setPosition([place.lat, place.lng]);
        setResults([]);
        setQuery('');
    }


    // Handle search input changes using a debounced approach
    useEffect(() => {
        if (query.trim() !== "") {
            const timer = setTimeout(handleSearch, 300);
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [query])

    return (
        <div className='relative h-screen w-screen'>

            {/* SEARCH BAR + SUGGESTIONS */}
            <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-1/3'>
                <input
                    type="text"
                    className='w-full p-2 rounded bg-white shadow-md border-slate-200 text-sm focus:outline-none font-medium'
                    placeholder='Search...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    // onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 100)} />

                {showResults && (
                    <div className='bg-white rounded mt-1 max-h-60 overflow-y-auto shadow-md'>
                        {results.map((place, idx) => (
                            <div
                                key={idx}
                                className='p-2 font-medium cursor-pointer hover:bg-slate-300 text-sm border-slate-200 border-[1px]'
                                onMouseDown={() => handlePlaceSelect(place)}
                            >
                                📍 {place.address}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='absolute top-[80px] left-0 right-0 z-[999] px-4'>
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


            <div className='fixed inset-0 overflow-hidden'>
                {/* MAP VIEW */}
                <div className='absolute inset-0 z-0'>
                    <MapContainer center={position} ref={mapRef} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />


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
                                    position={[poi.lat, poi.lng]} i
                                    con={isActive ? highlightedPoiIcon : poiIcon}
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
                        <FlyToLocation coords={position} />
                    </MapContainer>

                    {(selectedPlace || poiType || position) && (
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
                    )}


                </div>


                {/* POI SIDEBAR */}
                {poiType && (
                    <div className='absolute bottom-0 left-0 right-0 z-10 bg-white max-h-[40%] overflow-y-auto p-4 shadow-lg border-t'>
                        <h2 className="text-lg font-semibold mb-2">Nearby Places</h2>
                        {poiLoading && <p className="text-gray-500">Loading nearby places...</p>}
                        {poiError && !poiLoading && <p className="text-red-500 mb-2">{poiError}</p>}
                        {!poiError && !poiLoading && poiResults.length === 0 && <p>No places found.</p>}
                        <ul>
                            {poiResults.map((place, idx) => {
                                const poiId = place.place_id || idx;
                                const isActive = activePOIId === poiId;

                                return (
                                    <li
                                        key={idx}
                                        className={`mb-2 p-2 border rounded cursor-pointer transition ${isActive ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                                            }`}
                                        onMouseEnter={() => setActivePOIId(poiId)}
                                        onMouseLeave={() => !selectedPlace && setActivePOIId(null)}
                                        onClick={() => {
                                            setSelectedPlace(place);
                                            setActivePOIId(poiId);
                                        }}
                                    >
                                        <p className="font-bold">{place.name}</p>
                                        <p className="text-sm text-gray-600">{place.address}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}

            </div>
        </div>
    )
}

export default MapView
