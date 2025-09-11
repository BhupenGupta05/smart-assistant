import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function SmoothPolylineRedraw() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleZoom = () => {
      map.eachLayer((layer) => {
        // Redraw only vector layers (polylines, polygons)
        if (layer.redraw) {
          layer.redraw();
        }
      });
    };

    map.on("zoom", handleZoom);
    return () => {
      map.off("zoom", handleZoom);
    };
  }, [map]);

  return null;
}
