import { MapContainer, TileLayer } from 'react-leaflet'
import { useState, useRef } from 'react';
import "leaflet/dist/leaflet.css";
import MapClickHandler from './MapClickHandler';
import LocationMarker from './LocationMarker';
import { Marker, Popup } from 'react-leaflet';
import FlyToLocation from './FlyToLocation';


const SimpleMap = () => {
    const mapRef = useRef(null);
    const [position, setPosition] = useState([51.505, -0.09]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    return (
        <MapContainer center={position} ref={mapRef} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            <MapClickHandler
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation} />

            {selectedLocation && (
                <Marker position={selectedLocation}>
                    <Popup>
                        Marker at <br /> {selectedLocation[0].toFixed(4)},{' '}
                        {selectedLocation[1].toFixed(4)}
                    </Popup>
                </Marker>
            )}

            <Marker position={position} >
                <Popup>
                    You are here
                </Popup>
            </Marker>
            <LocationMarker setPosition={setPosition} />
            <FlyToLocation coords={position} />
        </MapContainer>
    )
}

export default SimpleMap



