import { Droplets, Wind, Activity } from "lucide-react";
import { Card } from "./Card";

const getAqiColor = (aqi) => {
  if (aqi <= 50) return "text-emerald-500";
  if (aqi <= 100) return "text-lime-500";
  if (aqi <= 200) return "text-yellow-500";
  if (aqi <= 300) return "text-orange-500";
  if (aqi <= 400) return "text-red-500";
  return "text-purple-600";
};


const getAqiLabel = (aqi) => {
  if (aqi == null) return "Unknown";

  if (aqi <= 50) return "Clean";
  if (aqi <= 100) return "Acceptable";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  if (aqi <= 400) return "Hazardous";
  return "Emergency";
};



const getAqiBg = (aqi) => {
  if (aqi <= 50) return "bg-emerald-50 dark:bg-emerald-900/20";
  if (aqi <= 100) return "bg-lime-50 dark:bg-lime-900/20";
  if (aqi <= 200) return "bg-yellow-50 dark:bg-yellow-900/20";
  if (aqi <= 300) return "bg-orange-50 dark:bg-orange-900/20";
  if (aqi <= 400) return "bg-red-50 dark:bg-red-900/20";
  return "bg-purple-50 dark:bg-purple-900/20";
};


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


  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Failed to load environment data
      </div>
    );
  }


  if (!weather || !aqi) return null;

  const iconUrl = weather.icon
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
            alt={weather.condition}
            className="w-10 h-10"
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
          className={`col-span-2 flex items-center justify-between p-2 rounded-lg ${getAqiBg(aqi)}`}
        >
          <div className="flex items-center gap-1.5">
            <Activity className={`h-3.5 w-3.5 ${getAqiColor(aqi)}`} />
            <span className="font-medium">AQI {Math.round(aqi)}</span>
          </div>

          <span className={`font-semibold ${getAqiColor(aqi)}`}>
            {getAqiLabel(aqi)}
          </span>
        </div>
      </div>
    </Card>
  );
}
