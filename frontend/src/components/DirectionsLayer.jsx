import { Polyline, Marker, Popup } from "react-leaflet";
import FitBounds from '../map/components/FitBounds';
import { userIcon } from "../map/icons/markers";

export default function DirectionsLayer({ routes, origin, destination }) {
  if (!routes?.length) return null;

  return (
    <>
      {routes.map((route, idx) => {
        const latlngs = route.coords || [];
        if (!latlngs.length) return null;

        return (
          <Polyline key={idx} positions={latlngs} color={idx === 0 ? "blue" : "gray" }>
            <Popup>
              {route.mode.toUpperCase()} — {(route.distance_meters / 1000).toFixed(1)} km,{" "}
              {(route.duration_seconds / 60).toFixed(0)} min
            </Popup>
          </Polyline>
          // <Polyline
          //   key={idx}
          //   positions={latlngs}
          //   color={idx === 0 ? "blue" : "gray"}
          // />
        );
      })}

      {/* Origin Marker */}
      {origin && (
        <Marker position={[origin.lat, origin.lng]}>
          <Popup>Origin: {origin.address || origin.name}</Popup>
        </Marker>
      )}

      {/* Destination Marker */}
      {destination && (
        <Marker position={[destination.lat, destination.lng]}>
          <Popup>Destination: {destination.address || destination.name}</Popup>
        </Marker>
      )}



      <FitBounds routes={routes} />
    </>
  );
}
