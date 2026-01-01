import {
  Wind,
  Droplets,
  Leaf
} from "lucide-react";

const WeatherContextPanel = ({
  weather,
  aqi,
  loading,
  error
}) => {
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

  if (!weather || !aqi) return null;

  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : "/weather-fallback.png";

    console.log(aqi);
    

  return (
    <aside className="absolute top-4 right-4 z-[1000]">
      <div className="w-[240px] rounded-2xl bg-white shadow-xl px-4 py-4 space-y-4">

        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">

            {/* Weather Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
              <img
                src={iconUrl}
                alt={weather.condition}
                className="w-10 h-10"
              />
            </div>

            {/* Weather Text */}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {weather.condition}
              </p>
              <p className="text-xs text-gray-500">
                Current Weather
              </p>
            </div>
          </div>

          {/* Temperature */}
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(weather.temperature)}°
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between pt-1">

          {/* AQI */}
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-orange-500" />
            <p className="text-xs font-medium text-gray-700">
              AQI{" "}
              <span className="text-orange-500 font-semibold">
                {aqi}
              </span>
            </p>
          </div>

          {/* Humidity */}
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <p className="text-xs font-medium text-gray-700">
              Hum{" "}
              <span className="font-semibold text-gray-900">
                {weather.humidity}%
              </span>
            </p>
          </div>
        </div>

        {/* Wind */}
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-medium text-gray-700">
            Wind{" "}
            <span className="font-semibold text-gray-900">
              {weather.wind.speed} m/s
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
};

export default WeatherContextPanel;
