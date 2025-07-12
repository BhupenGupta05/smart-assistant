import React from 'react'

const POISidebar = ({ poiType, poiResults, poiLoading, poiError, activePOIId, setActivePOIId, selectedPlace, setSelectedPlace }) => {
    if(!poiType) return null;
    return (
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
    )
}

export default POISidebar
