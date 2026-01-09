import { Star, MapPin, Navigation2 } from "lucide-react";

export default function POICard({
    poi,
    isActive,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDirections
}) {

    return (
        <div
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`
        group relative flex-shrink-0 w-full p-3 md:p-4 bg-white rounded-2xl cursor-pointer
        transition-all duration-300 border text-slate-700
        ${isActive
                    ? 'border-primary ring-2 ring-primary/5 shadow-xl bg-blue-50/30'
                    : 'border-transparent shadow-sm hover:shadow-md hover:border-gray-100'
                }
      `}
        >
            <div className="flex gap-3 md:gap-4">
                {/* Thumbnail */}
                <div className="w-16 md:w-16 h-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {poi.photos?.length > 0 ? (
                        <img
                            src={`${import.meta.env.VITE_BASE_URL}/api/place-photo?photoRef=${poi.photos[0].photo_reference}`}
                            alt={poi.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <MapPin className="w-6 md:w-8 h-6 md:h-8" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-left text-sm md:text-base font-semibold text-foreground truncate">{poi.name}</h3>

                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                        <span className="text-xs md:text-sm">{poi.rating}</span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.floor(poi.rating || 0) ? 'fill-current' : 'text-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-1 text-slate-700 font-light">({Math.floor(Math.random() * 500) + 50})</span>
                    </div>


                    <div className="text-left mt-2 text-xs text-muted-foreground truncate w-full font-light">
                        {poi.address}
                    </div>
                </div>
            </div>

            {/* Expandable Actions */}
            <div
                className={`
    grid transition-all duration-300 ease-out
    ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
    group-hover:grid-rows-[1fr]
  `}
            >
                <div className="overflow-hidden">
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDirections(poi);
                            }}
                            className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-white bg-blue-600 text-xs md:text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 md:gap-2">
                            <Navigation2 className="w-3 md:w-4 h-3 md:h-4" />
                            Navigate
                        </button>

                        {poi.phone && (
                            <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs md:text-sm font-medium hover:bg-secondary/80 transition-colors bg-slate-100">
                                {/* <a href={`tel:${phone}`}></a> */}
                                Call
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
