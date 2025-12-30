import { useEffect } from "react";

export const useTransitLayer = ({ poiType, showTransitLayer, setShowTransitLayer }) => {
    // Disable Transit Layer Automatically When POI Type Changes
    useEffect(() => {
        if(!showTransitLayer) return;

        if (poiType !== 'transit_station') {
            setShowTransitLayer(false);
        }
    }, [poiType, showTransitLayer, setShowTransitLayer]);
}