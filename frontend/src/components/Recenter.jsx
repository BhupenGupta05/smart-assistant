import { Locate } from "lucide-react";
import { useRef } from "react";

const isAlreadyCentered = (map, target, zoom, tolerance = 10) => {
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    const distance = map.distance(currentCenter, target);

    return distance < tolerance && currentZoom === zoom;
}

const Recenter = ({ mapRef, mode, routes, selectedMode, setPosition, setSelectedPlace }) => {
    const buttonRef = useRef(null);

    const triggerPulse = () => {
        if (!buttonRef.current) return;

        buttonRef.current.classList.remove("animate-recenter");
        // force reflow so animation restarts
        void buttonRef.current.offsetWidth;
        buttonRef.current.classList.add("animate-recenter");

        setTimeout(() => {
            buttonRef.current?.classList.remove("animate-recenter");
        }, 800);
    }

    const handleRecenter = () => {

        if (!navigator.geolocation) {
            alert("Geolocation is not enabled by your browser.");
            return;
        }

        const map = mapRef.current;
        if (!map) return;

        if (mode === "directions" && routes?.length > 0) {
            const activeRoute = routes.find(r => r.mode === selectedMode || routes[0]);
            const coords = activeRoute?.coords || [];

            if (coords.length > 0) {
                const bounds = L.latLngBounds(coords);

                // Prevent re-fitting same bounds
                if (!map.getBounds().equals(bounds)) {
                    triggerPulse();
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
                return;
            }
        }

        // Normal Recenter
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = [pos.coords.latitude, pos.coords.longitude];
                const zoom = 13;

                if (isAlreadyCentered(map, coords, zoom)) {
                    return;
                }
                triggerPulse();
                setPosition(coords);
                setSelectedPlace(null);
                map.flyTo(coords, zoom, {
                    animate: true,
                    duration: 0.8
                });
            },
            (err) => {
                alert("Please enable location access to recenter the map.");
                console.error("Geolocation error:", err.message);
            }
        );
    }
    return (
        <button
            ref={buttonRef}
            className='absolute bottom-48 right-5 z-[9999]
    bg-white p-[6px] sm:p-2 md:p-[10px]
    rounded-full shadow-md border
    hover:bg-gray-100 transition
    active:scale-95
    motion-reduce:animate-none'
            onClick={handleRecenter}>
            <Locate className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600' />
        </button>
    )
}

export default Recenter