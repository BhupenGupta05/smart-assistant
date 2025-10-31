import { useState } from "react";
import { CarFront, Bus, Footprints, Plane } from "lucide-react";

const travelModes = [
  { key: "driving", icon: CarFront, label: "Driving" },
  { key: "transit", icon: Bus, label: "Transit" },
  { key: "walking", icon: Footprints, label: "Walking" },
];

export default function DirectionsPanel({
  routes,
  selectedMode,
  setSelectedMode,
}) {
  const [expanded, setExpanded] = useState(false);

  if (!routes?.length) return null;

  // console.log("ROUTES: ",routes);

  const filteredRoutes = routes.filter((route) => route.mode === selectedMode);
  const hasRoutes = filteredRoutes.length > 0;

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[1000] transition-all duration-300 flex flex-col ${expanded ? "h-[40%]" : "h-[120px]"
        }`}
    >
      {/* Panel div */}
      <div
        className="flex justify-center py-2 cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>

      {/* Travel Modes */}
      <div className="flex justify-around px-6 mb-4">
        {travelModes.map(({ key, icon: Icon, label }) => {
          const active = selectedMode === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedMode(key)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl transition ${active
                  ? "text-blue-600 font-semibold bg-blue-50 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Routes */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {hasRoutes ? filteredRoutes
          .map((route, idx) => {
            const isActive = route.mode === selectedMode;
            console.log("ROUTE: ", route);

            return (
              <div
                key={idx}
                onClick={() => setSelectedMode(route.mode)
                }
                className={`p-4 rounded-2xl cursor-pointer transition shadow-sm ${isActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-400"
                    : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                <div className="flex justify-between items-center mb-1">
                  {/* Duration */}
                  <span
                    className={`text-xl font-bold ${isActive ? "text-blue-700" : "text-gray-800"
                      }`}
                  >
                    {(route.duration_seconds / 60).toFixed(0)} min
                  </span>
                  {/* Distance */}
                  <span className="text-sm text-gray-600">
                    {(route.distance_meters / 1000).toFixed(1)} km
                  </span>
                </div>

                {/* Carbon Emissions */}
                {route.emission_grams !== undefined && (
                  <div className="text-xs text-gray-500">
                    {((route.emission_grams) / 1000).toFixed(2)} kg CO₂
                  </div>
                )}
              </div>
            );
          }) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10 px-4">
            <Plane className="w-8 h-8 mb-3 text-gray-400" />
            <p className="text-sm font-medium">
              No {selectedMode} routes available between these locations.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              For long distances, try checking flights or other travel options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
