import { useEffect } from "react";
import { useMap } from "react-leaflet";
import polyline from "@mapbox/polyline";

export default function FitBounds({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (routes.length > 0) {
      const coords = polyline.decode(routes[0].polyline.encodedPolyline);
      const latlngs = coords.map(([lat, lng]) => [lat, lng]);
      map.fitBounds(latlngs);
    }
  }, [routes, map]);

  return null;
}
