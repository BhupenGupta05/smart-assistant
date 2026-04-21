// NOT IN USE

import POIDetails from './POIDetails';
import usePOISidebar from '../controllers/usePOISidebar';

const POISidebar = ({
  poiType,
  poiResults,
  poiLoading,
  poiError,
  activePOIId,
  setActivePOIId,
  selectedPlace,
  setSelectedPlace,
  onDirections
}) => {
  if (!poiType) return null;

  const { itemRefs, containerRef, showDivider, userClickedRef } = usePOISidebar(poiResults, selectedPlace);

  if (selectedPlace) {
    return (
      <POIDetails
        place={selectedPlace}
        onBack={() => setSelectedPlace(null)}
        onDirections={() => onDirections(selectedPlace)}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-t border-gray-200 rounded-t-2xl shadow-xl max-h-[35%] overflow-y-auto transition-all duration-300"
    >
      {/* Header */}
      <div
        className={`sticky top-0 bg-white/90 backdrop-blur-md p-4 transition-all duration-300 ${showDivider ? "border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]" : "border-none shadow-none"
          }`}
      >
        <h2 className="text-lg font-semibold text-gray-800">
          Nearby {poiType?.charAt(0).toUpperCase() + poiType?.slice(1)}
        </h2>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {poiLoading && <p className="text-gray-500 text-sm">Loading nearby places...</p>}
        {poiError && !poiLoading && (
          <p className="text-red-500 text-sm mb-2">{poiError}</p>
        )}
        {!poiError && !poiLoading && poiResults.length === 0 && (
          <p className="text-gray-500 text-sm">No places found nearby.</p>
        )}

        <ul className="space-y-3">
          {poiResults.map((place, idx) => {
            const poiId = place.place_id || idx;
            const isActive = activePOIId === poiId;

            return (
              <li
                key={poiId}
                ref={(el) => (itemRefs.current[poiId] = el)}
                className={`flex flex-col sm:flex-row gap-3 border rounded-xl p-3 shadow-sm cursor-pointer transition-all duration-300 ${isActive
                  ? "bg-blue-50 border-blue-400 shadow-md"
                  : "hover:bg-gray-50"
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
                    key={idx}
                    src={`${import.meta.env.VITE_BASE_URL}/api/place-photo?photoRef=${place.photos[0].photo_reference}`}
                    alt={place.name}
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                    className="w-24 h-24 object-cover rounded-lg border transition-opacity duration-700 ease-in-out"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg text-xs text-gray-500">
                    No Image
                  </div>
                )}

                {/* Info */}
                {place.user_ratings_total !== 'NA' && (<div className="flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-base font-semibold text-gray-800 truncate">
                      {place.name}
                    </p>

                    <div className="flex items-center flex-wrap gap-2 text-xs mt-1 text-gray-600">
                      {place.rating && (
                        <span className="font-medium">{place.rating} ⭐</span>
                      )}
                      {place.user_ratings_total && (
                        <span>({place.user_ratings_total})</span>
                      )}
                      <span
                        className={`font-semibold ${place.opening_hours === true
                            ? "text-green-600"
                            : place.opening_hours === false
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                      >
                        {place.opening_hours === true
                          ? "Open"
                          : place.opening_hours === false
                            ? "Closed"
                            : "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDirections(place);
                      }}
                      className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition"
                    >
                      Directions
                    </button>
                    {place.website && (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 transition"
                      >
                        Website
                      </a>
                    )}
                    {place.formatted_phone_number && (
                      <a
                        href={`tel:${place.formatted_phone_number}`}
                        className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition"
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>)}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default POISidebar;

