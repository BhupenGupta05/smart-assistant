import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FitBounds({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (routes.length > 0) {
      const allCoords = routes.flatMap((r) => r.coords || []);

      if (allCoords.length) {
         // Smoothly fit bounds using flyToBounds
        map.flyToBounds(allCoords, { padding: [50, 50], animate: true, duration: 1.5 });
      }
    }
  }, [routes, map]);

  return null;
}
