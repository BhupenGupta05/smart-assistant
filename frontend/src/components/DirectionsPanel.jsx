import { Car, Bus, Bike, Walk } from "lucide-react";

const travelModes = [
  { key: "driving", icon: Car, label: "Driving" },
  { key: "transit", icon: Bus, label: "Transit" },
  { key: "walking", icon: Walk, label: "Walking" },
  { key: "cycling", icon: Bike, label: "Cycling" },
];

export default function DirectionsPanel({
  routes,
  activeRouteIndex,
  setActiveRouteIndex,
  selectedMode,
  setSelectedMode,
}) {
  if (!routes?.length) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg p-3 z-[1000]">
      {/* Travel mode selector */}
      <div className="flex justify-around mb-3">
        {travelModes.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setSelectedMode(key)}
            className={`flex flex-col items-center text-xs ${
              selectedMode === key ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>

      {/* List of routes */}
      <div className="space-y-2">
        {routes.map((route, idx) => (
          <div
            key={idx}
            onClick={() => setActiveRouteIndex(idx)}
            className={`p-2 rounded-md cursor-pointer ${
              activeRouteIndex === idx ? "bg-blue-100 border border-blue-400" : "bg-gray-100"
            }`}
          >
            <div className="flex justify-between text-sm">
              <span className="font-medium">{route.mode.toUpperCase()}</span>
              <span>{(route.distance_meters / 1000).toFixed(1)} km</span>
            </div>
            <div className="text-xs text-gray-600">
              {(route.duration_seconds / 60).toFixed(0)} min
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
