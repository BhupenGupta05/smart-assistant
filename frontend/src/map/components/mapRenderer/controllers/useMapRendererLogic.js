import { useMemo } from "react";
import {
    transitIcon, poiIcon,
    highlightedPoiIcon
} from "../../../icons/markers";

export const useMapRendererLogic = ({
    poiResults,
    hoverPOIId,
    poiType,
    selectedPlace,
    destination,
    origin,
    position
}) => {

    /* ---------------- POI MARKERS ---------------- */

    // MEMOIZE ALL POI MARKERS
    const memoizedPOIMarkers = useMemo(() => {
        return poiResults.map((poi, idx) => {
            const poiId = poi.place_id || idx;
            const isActive = hoverPOIId === poiId;

            const icon =
                poiType === "transit_station"
                    ? transitIcon
                    : isActive
                        ? highlightedPoiIcon
                        : poiIcon;

            const lat =
                poi.lat ??
                (typeof poi.geometry?.location?.lat === "function"
                    ? poi.geometry.location.lat()
                    : poi.geometry?.location?.lat);

            const lng =
                poi.lng ??
                (typeof poi.geometry?.location?.lng === "function"
                    ? poi.geometry.location.lng()
                    : poi.geometry?.location?.lng);

            if (lat == null || lng == null) return null;

            return {
                poiId,
                poi: { ...poi, lat, lng },
                icon
            };
        });
    }, [poiResults, hoverPOIId, poiType]);

    /* ---------------- CENTER POSITION ---------------- */

    const selectedLat =
        selectedPlace?.lat ??
        selectedPlace?.geometry?.location?.lat;

    const selectedLng =
        selectedPlace?.lng ??
        selectedPlace?.geometry?.location?.lng;

    const centerPosition = useMemo(() => {
        if (destination) return [destination.lat, destination.lng];
        if (origin) return [origin.lat, origin.lng];
        if (selectedLat != null && selectedLng != null)
            return [selectedLat, selectedLng];
        if (position) return position;
        return [28.6139, 77.2090];
    }, [destination, origin, selectedLat, selectedLng, position]);

    return {
        memoizedPOIMarkers,
        centerPosition,
        selectedLat,
        selectedLng
    };
};
