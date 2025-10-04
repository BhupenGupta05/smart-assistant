import { Polyline, Popup } from "react-leaflet";
import FitBounds from '../map/components/FitBounds'

export default function DirectionsLayer({ routes, selectedMode, setSelectedMode }) {
  if (!routes?.length) return null;

  return (
    <>
      {routes.map((route, idx) => {
        const latlngs = route.coords || [];
        if (!latlngs.length) return null;

        const isActive = route.mode === selectedMode;

        return (
          <Polyline
            key={idx}
            positions={latlngs}
            pathOptions={{
              color: isActive ? "blue" : "gray",
              weight: isActive ? 3 : 3,   
              opacity: isActive ? 1 : 0.9
            }}
            // dashArray={idx === activeRouteIndex ? null : "6,6"}
            eventHandlers={{
              click: () => setSelectedMode(route.mode)
            }}>
            <Popup>
              {route.mode.toUpperCase()} — {(route.distance_meters / 1000).toFixed(1)} km,{" "}
              {(route.duration_seconds / 60).toFixed(0)} min
            </Popup>
          </Polyline>
        );
      })}

      <FitBounds routes={routes} />
    </>
  );
}
