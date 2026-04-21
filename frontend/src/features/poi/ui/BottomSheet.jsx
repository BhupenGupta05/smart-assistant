import { ChevronUp, Loader2 } from "lucide-react";
import usePOISidebar from "../controllers/usePOISidebar";
import POICard from "./POICard";
import { useState } from "react";
import useNetwork from "../../network/hooks/useNetwork";
import { loadCacheMeta } from "../../offline/utils/poiCache";
import { lastUpdated } from "../../offline/utils/lastUpdated";

export default function BottomSheet({
    position,
    poiType,
    poiResults,
    poiLoading,
    poiError,
    selectedPlace,
    setSelectedPlace,
    setHoverPOIId,
    onDirections
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { itemRefs, containerRef, userClickedRef } = usePOISidebar(poiResults, selectedPlace);

    const isOnline = useNetwork();

    const poiCacheKey =
        position && poiType
            ? `pois:${position.lat.toFixed(2)},${position.lng.toFixed(2)}-${poiType}`
            : null;


    const poiLastUpdatedTs = !isOnline && poiCacheKey
        ? loadCacheMeta(poiCacheKey)
        : null;

    const poiLastUpdatedText = poiLastUpdatedTs
        ? lastUpdated(poiLastUpdatedTs)
        : null;


    if (!poiType) return null;

    return (
        <div
            ref={containerRef}
            className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-end pb-6 md:pb-8 px-4 h-screen text-slate-700 pointer-events-none">

            {/* Mobile/Desktop Responsive Container */}
            <div
                className="w-full pointer-events-auto"
            >
                {/* Handle Bar for Mobile Drag hint (Visual only for now) */}
                <div className="w-full flex justify-center mb-2 md:hidden">
                    <div className="w-12 h-1.5 bg-white/50 backdrop-blur-md rounded-full shadow-sm" />
                </div>

                <div
                    className={`
    mx-auto w-full lg:max-w-5xl xl:max-w-7xl
    bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl
    rounded-[2rem] overflow-hidden flex flex-col
    transition-[max-height] duration-500 ease-in-out
    ${isExpanded ? "max-h-[50vh]" : "max-h-[30vh]"}
  `}
                >



                    {/* Header Area */}
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-black/5 flex items-center justify-between bg-white/50">
                        <h2 className="font-display font-bold text-base md:text-lg text-foreground">
                            Nearby Places {poiResults.length > 0 && <span className="text-muted-foreground text-xs md:text-sm font-normal ml-2">({poiResults.length} results)</span>}

                            {!isOnline && poiLastUpdatedText && (
                                <span className="text-muted-foreground text-2xs md:text-sm font-normal ml-2">Last updated {poiLastUpdatedText}</span>
                            )}
                        </h2>

                        <button
                            onClick={() => setIsExpanded((v) => !v)}
                            className="ml-2 p-2 rounded-full hover:bg-black/5 transition"
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                            <ChevronUp
                                className={`w-4 md:w-5 h-4 md:h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    {/* List Content */}
                    <div className="overflow-y-auto overflow-x-hidden p-4 bg-gray-50/50">
                        {poiLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-slate-700">
                                <Loader2 className="w-4 md:w-8 h-4 md:h-8 animate-spin mb-2" />
                                <p className="text-sm md:text-base">Finding best places...</p>
                            </div>
                        ) : (!isOnline && poiResults.length === 0) ? ( //OFFLINE AND NO POIs CACHED
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="font-medium">You're offline</p>
                                <p className="text-sm mt-1">
                                    No cached places available for this area.
                                </p>
                            </div>
                        ) : poiError ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="font-medium">Something went wrong</p>
                                <p className="text-sm mt-1">
                                    Unable to fetch places right now. Try again later.
                                </p>
                            </div>

                        ) : poiResults.length === 0 ? ( //ONLINE AND NO RESULTS
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No places found in this area.</p>
                                <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            // Desktop: Horizontal Scroll / Grid. Mobile: Vertical List
                            <div className="flex flex-col gap-2 md:gap-4">
                                {poiResults.map((poi) => {
                                    if (!poi.place_id) return null;

                                    const poiId = poi.place_id;
                                    const isActive = selectedPlace?.place_id === poiId;


                                    return (
                                        <POICard
                                            key={poiId}
                                            ref={(el) => (itemRefs.current[poiId] = el)}
                                            poi={poi}
                                            isActive={isActive}
                                            onMouseEnter={() => setHoverPOIId(poi.place_id)}
                                            onMouseLeave={() => setHoverPOIId(null)}
                                            onClick={() => setSelectedPlace(poi)}
                                            onDirections={onDirections}
                                        />

                                    )

                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
