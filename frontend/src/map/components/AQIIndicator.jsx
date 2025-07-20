const getAQILevel = (aqi) => {
    if (aqi === 1) return { level: 'Good', color: 'bg-green-500' };
    if (aqi === 2) return { level: 'Moderate', color: 'bg-yellow-500' };
    if (aqi === 3) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500' };
    if (aqi === 4) return { level: 'Unhealthy', color: 'bg-red-500' };
    if (aqi === 5) return { level: 'Very Unhealthy', color: 'bg-purple-600' };
    return { level: 'Hazardous', color: 'bg-maroon-700' };
};

const AQIIndicator = ({ aqi, loading, error }) => {
    if (loading) {
        return (
            <div className="absolute top-4 left-4 z-[1000] bg-gray-200 text-gray-800 px-3 py-2 rounded shadow">
                Loading AQI...
            </div>
        )
    }


    if (error) {
        return (
            <div className="absolute top-4 left-4 z-[1000] bg-red-100 text-red-600 px-3 py-2 rounded shadow">
                Failed to load AQI
            </div>
        )
    }

    if (!aqi) return null;

    const { level, color } = getAQILevel(aqi.aqi);
    return (
        <div className={`${color} pulsating-marker`}>
            {/* AQI: {level} */}
        </div>
    )
}

export default AQIIndicator
