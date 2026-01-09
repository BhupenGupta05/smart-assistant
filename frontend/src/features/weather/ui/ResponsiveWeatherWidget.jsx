import { WeatherWidget } from "./WeatherWidget";
import { MobileWeatherWidget } from "./MobileWeatherWidget";

export function ResponsiveWeatherWidget({ weather, aqi, loading, error }) {
  if (loading || error) return null;

  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden lg:block absolute top-4 right-4 z-[1000]">
        <WeatherWidget weather={weather} aqi={aqi} />
      </div>

      {/* Mobile */}
      <MobileWeatherWidget weather={weather} aqi={aqi} />
    </>
  );
}
