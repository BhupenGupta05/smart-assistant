// Component to handle map click events and remove

import { useMapEvents } from "react-leaflet";

const MapClickHandler = ({ selectedLocation, setSelectedLocation }) => {
    useMapEvents({
        click(e) {
            const clickedLatLong = [e.latlng.lat, e.latlng.lng];

            if(selectedLocation && 
                selectedLocation[0] === clickedLatLong[0] &&
                selectedLocation[1] === clickedLatLong[1]
            ) {
                setSelectedLocation(null);
            } else {
                setSelectedLocation(clickedLatLong);
            }
        }

    })
  return null;
}

export default MapClickHandler
