import { Navigation, Bookmark, Share2 } from "lucide-react";

const POIDetails = ({ place, onBack, onDirections }) => {
  if (!place) return null;

  // console.log("PLACE: ", place);


  return (
    <div className="bg-white h-full overflow-y-auto p-5 rounded-2xl shadow-sm">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to results
      </button>

      {/* Photos Grid (keep same layout) */}
      {place.photos?.length > 0 ? (
        <div className="columns-2 sm:columns-3 gap-2 mb-5">
          {place.photos.slice(0, 6).map((photo, idx) => (
            <img
              key={idx}
              src={`${import.meta.env.VITE_BASE_URL}/api/place-photo?photoRef=${photo.photo_reference}`}
              alt={place.name}
              loading="lazy"
              onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
              className="w-full mb-2 rounded-xl object-cover break-inside-avoid-column transition-opacity duration-700 ease-in-out"
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-36 bg-gray-50 flex items-center justify-center rounded-xl text-sm text-gray-400 mb-5">
          No images available
        </div>
      )}

      {/* Basic Info */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 leading-tight">
          {place.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {place.vicinity || place.formatted_address}
        </p>
      </div>

      {/* Ratings and Status */}
      {place.user_ratings_total !== 'NA' && (<div className="flex items-center gap-3 text-sm text-gray-700 mb-5">
        {place.rating && (
          <span className="font-medium">{place.rating} ⭐</span>
        )}
        {place.user_ratings_total && (
          <span>
            ({place.user_ratings_total} reviews)
          </span>
        )}
        {place.opening_hours && (
          <span
            className={`font-medium ${place.opening_hours.open_now
              ? "text-green-600"
              : "text-red-500"
              }`}
          >
            {place.opening_hours.open_now ? "Open now" : "Closed"}
          </span>
        )}
      </div>)}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onDirections(place)}
          title="Get directions to this place"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-medium transition"
        >
          <Navigation size={14} />
          Directions
        </button>

        {/* <div className="relative group">
          <button
            onClick={() => onDirections(normalize(place))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-medium transition"
          >
            <Navigation size={14} />
          </button>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Get directions
          </span>
        </div> */}

        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition"
          >
            Website
          </a>
        )}

        {place.formatted_phone_number && (
          <a
            href={`tel:${place.formatted_phone_number}`}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition"
          >
            Call
          </a>
        )}

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition">
          <Bookmark size={14} />
          Save
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition">
          <Share2 size={14} />
          Share
        </button>
      </div>


    </div>
  );
};

export default POIDetails;
