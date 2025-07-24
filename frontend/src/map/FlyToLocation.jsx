import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeolocationContext";

const FlyToLocation = () => {
    // console.log("FLYING TO: ", coords);

    const map = useMap();
    const { getCoords } = useGeolocation();
    // const prevCoords = useRef(null);


    // NEW IMPLEMENTATION
    // If it creates a new array, and values are also different only then fly to location
    useEffect(() => {
        const coords = getCoords();
        if (
            Array.isArray(coords) &&
            coords.length === 2 &&
            typeof coords[0] === 'number' &&
            typeof coords[1] === 'number'
            // (
            //     !Array.isArray(prevCoords.current) ||
            //     coords[0] !== prevCoords.current[0] ||
            //     coords[1] !== prevCoords.current[1]
            // )
        ) {
            map.flyTo(coords, 14);
            // prevCoords.current = coords;
        }
    }, [getCoords, map]);

    return null;
}

export default FlyToLocation
