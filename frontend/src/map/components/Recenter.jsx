import { Locate } from "lucide-react";

const Recenter = ({ mapRef, mode, routes, selectedMode, setPosition, setSelectedPlace }) => {

    const handleRecenter = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not enabled by your browser.");
            return;
        }
        
        if(mode === "directions" && routes?.length > 0) {
            const activeRoute = routes.find(r => r.mode === selectedMode || routes[0]);
            const coords = activeRoute?.coords || [];

            if(coords.length > 0) {
                const bounds = L.latLngBounds(coords);
                mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                return;
            }
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = [pos.coords.latitude, pos.coords.longitude];
                setPosition(coords);
                setSelectedPlace(null);
                mapRef.current?.flyTo(coords, 13);
            },
            (err) => {
                alert("Please enable location access to recenter the map.");
                console.error("Geolocation error:", err.message);
            }
        );
    }
    return (
        <button className='absolute bottom-48 right-5 z-[9999] bg-white p-1 sm:p-[6px] md:p-2 rounded-full shadow-md border hover:bg-gray-100 transition cursor-pointer active:scale-95'
            onClick={handleRecenter}>
            <Locate className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600' />
        </button>
    )
}

export default Recenter
