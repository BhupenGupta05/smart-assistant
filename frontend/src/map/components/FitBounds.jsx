import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FitBounds({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (routes.length > 0) {
      const allCoords = routes.flatMap((r) => r.coords || []);

      if (allCoords.length) {
        map.fitBounds(allCoords, { padding: [50, 50] });
      }
    }
  }, [routes, map]);

  return null;
}
