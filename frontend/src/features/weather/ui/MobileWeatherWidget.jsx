import { useState } from "react";
import { getAqiColor } from "../utility/aqi";

export function MobileWeatherWidget({ weather, aqi }) {
    const [open, setOpen] = useState(false);

    if (!weather || !aqi) return null;

    const showLastUpdated =
        aqi.source === "cache" && aqi.lastUpdatedText;

    const iconUrl = weather?.icon
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
                        style={{ backgroundImage: `url(${iconUrl})` }}
                        aria-label={weather.condition}
                        className="w-8 h-8 bg-no-repeat bg-contain"
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
                    <span className={getAqiColor(aqi.data)}>
                        AQI {aqi.data}
                    </span>
                    {showLastUpdated && (<span className="text-2xs text-gray-400"> (Updated {aqi.lastUpdatedText})</span>)}
                </div>

            </div>
        </div>
    );
}
