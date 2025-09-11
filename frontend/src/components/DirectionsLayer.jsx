import { Polyline, Popup } from "react-leaflet";
import FitBounds from '../map/components/FitBounds';

import SmoothPolylineRedraw from '../map/components/SmoothPolylineRedraw'

export default function DirectionsLayer({ routes, origin, destination, activeRouteIndex, setActiveRouteIndex }) {
  if (!routes?.length) return null;

  return (
    <>
      {routes.map((route, idx) => {
        const latlngs = route.coords || [];
        if (!latlngs.length) return null;

        return (
          <Polyline
            key={idx}
            positions={latlngs}
            color={idx === activeRouteIndex ? "blue" : "gray"}
            weight={idx === activeRouteIndex ? 3 : 2}
            opacity={idx === activeRouteIndex ? 1 : 0.9}
            // dashArray={idx === activeRouteIndex ? null : "6,6"}
            eventHandlers={{
              click: () => setActiveRouteIndex(idx)
            }}>
            <Popup>
              {route.mode.toUpperCase()} — {(route.distance_meters / 1000).toFixed(1)} km,{" "}
              {(route.duration_seconds / 60).toFixed(0)} min
            </Popup>
          </Polyline>
        );
      })}

      <FitBounds routes={routes} />
      {/* <SmoothPolylineRedraw /> */}
    </>
  );
}
