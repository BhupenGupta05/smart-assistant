import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const FlyToLocation = ({ coords }) => {
    console.log("FLYING TO: ", coords);
    
    const map = useMap();
    const prevCoords = useRef(null);

    useEffect(() => {
        if (coords && (
            !prevCoords.current ||
            coords[0] !== prevCoords.current[0] ||
            coords[1] !== prevCoords.current[1])) {
            map.flyTo(coords, 14);
            prevCoords.current = coords;
        }
    }, [coords, map]);
    return null;
}

export default FlyToLocation
