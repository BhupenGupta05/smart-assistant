import { useState } from "react";
import axios from "axios";

const POIDetails = ({ place, onBack, origin }) => {
  console.log("PLACE",place);
  
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!place) return null;

  const getDirections = async () => {
    // if (!origin || !place?.geometry?.location) {
    //   alert("Missing origin or destination");
    //   return;
    // }

    try {
      setLoading(true);
      const destination = `${place.lat},${place.lng}`;
      const response = await axios.get("/api/directions", {
        params: {
          origin,
          destination,
          modes: "driving,walking,transit,bicycling",
        },
      });
      setDirections(response.data);
    } catch (error) {
      console.error("Error fetching directions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-3 text-sm text-blue-600 underline"
      >
        ← Back to results
      </button>

      {/* Photos Grid */}
      {place.photos?.length > 0 ? (
        <div className="columns-2 gap-2 mb-3">
          {place.photos.slice(0, 6).map((photo, idx) => (
            <img
              key={idx}
              src={`http://localhost:5173/api/place-photo?photoRef=${photo.photo_reference}`}
              alt={place.name}
              className="w-full rounded-lg mb-2 object-cover"
              style={{ breakInside: "avoid-column" }}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-36 bg-gray-200 flex items-center justify-center rounded-md text-sm text-gray-500 mb-3">
          No Images
        </div>
      )}

      {/* Info */}
      <h2 className="text-xl font-semibold mb-1">{place.name}</h2>
      <p className="text-sm text-gray-600 mb-2">
        {place.vicinity || place.formatted_address}
      </p>

      <div className="flex items-center gap-2 text-sm mb-3">
        <span>{place.rating} ⭐</span>
        <span>({place.user_ratings_total})</span>
        <span
          className={`font-semibold ${
            place.opening_hours ? "text-green-600" : "text-red-600"
          }`}
        >
          {place.opening_hours ? "Open" : "Closed"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={getDirections}
          disabled={loading}
          className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
        >
          {loading ? "Loading..." : "Directions"}
        </button>

        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded bg-gray-100 text-sm"
          >
            Website
          </a>
        )}
        {place.formatted_phone_number && (
          <a
            href={`tel:${place.formatted_phone_number}`}
            className="px-3 py-2 rounded bg-gray-100 text-sm"
          >
            Call
          </a>
        )}
        <button className="px-3 py-2 rounded bg-gray-100 text-sm">Save</button>
        <button className="px-3 py-2 rounded bg-gray-100 text-sm">Share</button>
      </div>

      {/* Show Directions (for debug / test) */}
      {directions && (
        <div className="mt-4 text-sm bg-gray-100 p-3 rounded">
          <pre>{JSON.stringify(directions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default POIDetails;
