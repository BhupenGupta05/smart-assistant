import { useState } from "react";

export function MobileWeatherWidget({ weather, aqi }) {
    const [open, setOpen] = useState(false);

    if (!weather || !aqi) return null;

    const getAqiColor = (aqi) => {
        if (aqi <= 50) return "text-emerald-500";
        if (aqi <= 100) return "text-lime-500";
        if (aqi <= 200) return "text-yellow-500";
        if (aqi <= 300) return "text-orange-500";
        if (aqi <= 400) return "text-red-500";
        return "text-purple-600";
    };

    const iconUrl = weather.icon
        ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
        : "/weather-fallback.png";

    return (
        <div
            className="
        fixed bottom-8 left-7 z-[1200]
        flex items-center lg:hidden
      "
        >
            {/* Button */}
            <button
                onClick={() => setOpen(v => !v)}
                className={`bg-white shadow-lg
          flex items-center justify-center
          relative z-10 ease-out active:scale-90
          h-8 w-8 rounded-full transition-all duration-200
  ${open ? "ring-4 ring-sky-200" : ""}
          `}
                aria-label="Toggle weather info"
            >
                <div className="">

                    <img
                        src={iconUrl}
                        alt={weather.condition}
                        className="w-8 h-8"
                    />

                </div>
            </button>

            {/* Expanding Pill */}
            <div
                className={`
          ml-2
          overflow-hidden
          transition-all duration-300 ease-out
          ${open
                        ? "max-w-[240px] opacity-100 translate-x-0"
                        : "max-w-0 opacity-0 -translate-x-2"
                    }
        `}
            >
                <div
                    className="
            bg-white shadow-md
            rounded-full
            px-4 py-2
            text-xs font-medium
            whitespace-nowrap
            flex items-center gap-2
          "
                >
                    <span>{Math.round(weather.temperature)}°</span>
                    <span className="text-gray-400">·</span>
                    <span className={getAqiColor(aqi)}>
                        AQI {aqi}
                    </span>
                </div>
            </div>
        </div>
    );
}
