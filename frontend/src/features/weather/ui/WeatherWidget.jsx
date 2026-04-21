import { Droplets, Wind, Activity } from "lucide-react";
import { Card } from "./Card";
import { getAqiBg, getAqiColor, getAqiLabel } from "../utility/aqi";

export function WeatherWidget({
  aqi,
  weather,
  loading,
  error,
  label = "Current Location",
}) {
  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-600">
        Loading environment data…
      </div>
    );
  }


  if (error && !weather) {
    return (
      <div className="p-4 text-sm text-red-600">
        Failed to load environment data
      </div>
    );
  }


  if (!weather || !aqi) return null;

  const iconUrl = weather?.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : "/weather-fallback.png";


  return (
    <Card
      className={
        "glass p-4 w-64 shadow-lg backdrop-blur-md bg-white/80 border-0"}
    >
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </div>


      <>
        {/* TEMP + CONDITION */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-4xl font-light tracking-tighter text-foreground">
              {Math.round(weather.temperature)}°
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {weather.condition}
            </span>
          </div>

          <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 dark:text-sky-400">

            <img
              src={iconUrl}
              style={{ backgroundImage: `url(${iconUrl})` }}
              aria-label={weather.condition}
              className="w-10 h-10 bg-no-repeat bg-contain"
            />

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-secondary/50">
            <Droplets className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-medium">{weather.humidity}% Hum</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-secondary/50">
            <Wind className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-medium">{weather.wind.speed} km/h</span>
          </div>

          {/* AQI */}
          <div
            className={`col-span-2 flex items-center justify-between p-2 rounded-lg ${getAqiBg(aqi.data)}`}
          >
            <div className="flex items-center gap-1.5">
              <Activity className={`h-3.5 w-3.5 ${getAqiColor(aqi.data)}`} />
              <span className="font-medium">AQI {Math.round(aqi.data)}</span>
            </div>

            <span className={`font-semibold ${getAqiColor(aqi.data)}`}>
              {getAqiLabel(aqi.data)}
            </span>
          </div>


        </div>
      </>

    </Card>
  );
}
