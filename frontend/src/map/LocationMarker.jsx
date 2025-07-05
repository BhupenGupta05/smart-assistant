import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

const LocationMarker = ({ setPosition }) => {
    const map = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        }
    })

    useEffect(() => {
        map.locate();
    }, [map])

    return null;
}

export default LocationMarker;