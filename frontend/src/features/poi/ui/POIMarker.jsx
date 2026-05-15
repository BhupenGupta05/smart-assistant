import { memo, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';

const POIMarker = memo(({ poiId, poi, icon, onMouseOver, onMouseOut, onClick }) => {
    const eventHandlers = useMemo(() => ({
        mouseover: () => onMouseOver(poiId),
        mouseout: onMouseOut,
        click: () => {
            onClick(poi),
            onMouseOver(poiId);
        }
    }), [poiId, poi, onMouseOver, onMouseOut, onClick]);

    return (
        <Marker
            position={[poi.lat, poi.lng]}
            icon={icon}
            eventHandlers={eventHandlers}>

            <Popup className='transparent-popup'>
                <strong>{poi.name}</strong><br />
                📍 {poi.address}<br />
                ⭐ {poi.rating} ratings
            </Popup>
        </Marker>
    )
}, (prev, next) =>
    prev.poiId === next.poiId &&
    prev.icon === next.icon &&
    prev.poi.lat === next.poi.lat &&
    prev.poi.lng === next.poi.lng)

export default POIMarker
