import { useEffect, useRef } from 'react'
import POIDetails from './POIDetails';
import { normalize } from './MapControls';

const POISidebar = ({ poiType, poiResults, poiLoading, poiError, activePOIId, setActivePOIId, selectedPlace, setSelectedPlace, activeIdx, setActiveIdx, origin, setOrigin, destination, setDestination, setMode, position, clearRoutes }) => {
    if (!poiType) return null;

    const itemRefs = useRef({});

    // BUG FIX: CLICKING ON PLACE CRETED A SNAPPY EFFECT BECAUSE OF scrollIntoView
    // WHEN USER MANUALL SELECTS A PLACE IN SIDEBAR, scrollIntoView SHOULD NOT WORK
    const userClickedRef = useRef(false);

    useEffect(() => {
        if (selectedPlace && !userClickedRef.current) {
            const poiId = selectedPlace.place_id || poiResults.indexOf(selectedPlace);
            const currentItem = itemRefs.current[poiId];

            if (currentItem) {
                currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        // RESET FLAG
        userClickedRef.current = false;
    }, [selectedPlace, poiResults]);


    // Same function as in SearchControls
    const startDirectionsWith = (place) => {
        if(clearRoutes) clearRoutes();

        const destinationPlace = normalize(place);

        setDestination(destinationPlace);

        // Get current location as origin
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const currentLocation = {
                        name: "Current Location",
                        address: "Your current location",
                        location: [pos.coords.latitude, pos.coords.longitude],
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    setOrigin(currentLocation);
                },
                (err) => {
                    console.warn("⚠️ Failed to fetch current location:", err);
                    // Fallback to position prop if geolocation fails
                    if (position) {
                        setOrigin({
                            name: "Current Location",
                            address: "Your current location",
                            location: position,
                            lat: position[0],
                            lng: position[1],
                        });
                    }
                }
            );
        }

        setMode("directions");
        setSelectedPlace(null);
    };

    if (selectedPlace) {
        return (
            <POIDetails
                place={selectedPlace}
                onBack={() => setSelectedPlace(null)}
                onDirections={() => startDirectionsWith(selectedPlace)} />
        )
    }

    return (
        <div className='absolute bottom-0 left-0 right-0 z-10 bg-white max-h-[35%] overflow-y-auto p-4 shadow-xl border-t rounded-t-lg'>
            <h2 className="text-lg font-semibold mb-3">Nearby Places</h2>

            {poiLoading && <p className="text-gray-500">Loading nearby places...</p>}
            {poiError && !poiLoading && <p className="text-red-500 mb-2">{poiError}</p>}
            {!poiError && !poiLoading && poiResults.length === 0 && <p>No places found.</p>}

            <ul className="space-y-3">
                {poiResults.map((place, idx) => {
                    const poiId = place.place_id || idx;
                    const isActive = activePOIId === poiId;

                    // console.log(place.photos);


                    return (
                        <div
                            key={poiId}
                            ref={(ele) => (itemRefs.current[poiId] = ele)}
                            className={`flex flex-col sm:flex-row gap-3 border rounded-lg p-3 shadow-sm cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                                }`}
                            onMouseEnter={() => setActivePOIId(poiId)}
                            onMouseLeave={() => !selectedPlace && setActivePOIId(null)}
                            onClick={() => {
                                userClickedRef.current = true;
                                setSelectedPlace(place);
                                setActivePOIId(poiId);
                            }}
                        >
                            {/* Image */}

                            {place.photos?.length > 0 ? (
                                <img
                                    src={`http://localhost:5173/api/place-photo?photoRef=${place.photos[0].photo_reference}`}
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
                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startDirectionsWith(place);
                                    }} 
                                    className='text-blue-600 text-xs underline'>
                                        Directions
                                    </button>
                                    {/* <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                            place.name
                                        )}&destination_place_id=${place.place_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-xs underline"
                                    >
                                        Directions
                                    </a> */}
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
    )
}

export default POISidebar
