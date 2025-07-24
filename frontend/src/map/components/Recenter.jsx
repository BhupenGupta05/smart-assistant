import { Locate } from "lucide-react";

const Recenter = ({ mapRef, setPosition, setSelectedPlace }) => {
    const handleRecenter = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not enabled by your browser.");
            return;
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
        <button className='absolute bottom-60 right-4 z-[1000] bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition'
            onClick={handleRecenter}>
            <Locate size={20} className='text-blue-600' />
        </button>
    )
}

export default Recenter
