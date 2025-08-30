import { Polyline, Marker, Popup } from "react-leaflet";
import polyline from '@mapbox/polyline'
import FitBounds from '../map/components/FitBounds'

export default function DirectionsLayer({ routes, origin, destination }) {
  const start = routes[0]?.legs?.[0]?.start_location?.latLng;
  const end = routes[0]?.legs?.[0]?.end_location?.latLng;
  return (
    <>
      {routes.map((route, idx) => {
        const coords = polyline.decode(route.polyline.encodedPolyline); // decode
        const latlngs = coords.map(([lat, lng]) => [lat, lng]);

        return (
          <Polyline key={idx} positions={latlngs} color={idx === 0 ? "blue" : "gray"}>
            <Popup>
              {route.mode.toUpperCase()} — {(route.distance_meters / 1000).toFixed(1)} km,{" "}
              {(route.duration_seconds / 60).toFixed(0)} min
            </Popup>
          </Polyline>
        );
      })}

      {/* Origin Marker */}
      <Marker position={start ? [start.latitude, start.longitude] : [0, 0]}>
        <Popup>Origin: {origin}</Popup>
      </Marker>


      {/* Destination Marker */}
      <Marker position={end ? [end.latitude, end.longitude] : [0, 0]}>
        <Popup>Destination: {destination}</Popup>
      </Marker>


      {/* Auto-fit bounds */}
      <FitBounds routes={routes} />
    </>
  );
}
