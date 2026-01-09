import {
  Navigation,
  Heart,
  Share2,
  X,
} from "lucide-react";

export default function Sidebar({ place, onNavigate, onClose }) {
  if (!place) return null;

  return (
    <aside
      className="
    fixed z-40 bg-white shadow-2xl
    flex flex-col overflow-hidden
    inset-x-3 bottom-3
    h-[45vh]
    rounded-2xl 
    sm:left-6 sm:bottom-28
    sm:h-[60vh]
    sm:w-[400px]
    sm:rounded-2xl
    text-left
  "
    >

      {/* Header / Image */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-br from-indigo-200 to-violet-200">

        {/* Close button (RIGHT) */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="
      absolute top-3 right-3 z-10
      flex items-center justify-center
      h-9 w-9 sm:h-10 sm:w-10
      rounded-full
      bg-white/90 backdrop-blur
      shadow-md
      hover:bg-white
      transition
    "
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" />
        </button>

      </div>


      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">

        {/* Badge */}
        <span className="inline-block mb-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
          Searched
        </span>

        {/* Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 mb-4">
          {place.name}
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(place);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-xs sm:text-sm font-medium shadow"
          >
            <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
            Navigate
          </button>

          <button className="p-[10px] rounded-xl border hover:bg-gray-50">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-slate-700" />
          </button>

          <button className="p-[10px] rounded-xl border hover:bg-gray-50">
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-slate-700" />
          </button>
        </div>

        {/* Address */}
        <p className="text-slate-500 font-extralight text-xs sm:text-sm leading-relaxed mb-6">
          {place.address}
        </p>

        {/* Location Details */}
        {/* <div className="mb-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            Location Details
          </h3>

          <div className="bg-slate-50 border rounded-xl p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-extralight">Latitude</span>
              <span className="font-extralight">{place.lat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-extralight">Longitude</span>
              <span className="font-extralight">{place.lng}</span>
            </div>
          </div>
        </div> */}

        {/* Info Section */}
        {/* {place.source && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Info
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-xl p-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Source
                </div>
                <div className="text-sm font-medium mt-1">
                  {place.source}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Footer */}
      {/* <div className="border-t px-5 py-4">
        <a
          href={place.osmUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ExternalLink className="w-4 h-4" />
          View on OpenStreetMap
        </a>
      </div> */}
    </aside>
  );
}
