import { Ellipsis, Utensils, Coffee, Hospital, TramFront, Landmark } from 'lucide-react'
import POIMore from './POIMore'

const categories = [
    { label: "Restaurants", type: "restaurant", icon: Utensils },
    { label: "Health", type: "hospital", icon: Hospital },
    { label: "Cafes", type: "cafe", icon: Coffee },
    { label: "Banks", type: "bank", icon: Landmark },
    { label: "Transit", type: "transit_station", icon: TramFront },
    { label: "More", type: "more", icon: Ellipsis }
]

const POICategory = ({ poiType, showMore, onCategorySelect, closeMore }) => {

    // CLOSE MORE PAGE WHEN A CATEGORY IS SELECTED
    const handleSelect = (type) => {
        onCategorySelect(type);
        closeMore();
    };

    return (
        <>
            <div className='absolute top-[56px] sm:top-[60px] md:top-[64px]
    lg:top-[68px] justify-start z-[999] flex'>
                <div className='flex flex-wrap items-center sm:flex-nowrap overflow-x-auto gap-1 sm:gap-2 md:gap-3 py-2 no-scrollbar mx-4'>
                    {categories.map(({ label, type, icon: Icon }) => (
                        <button
                            key={type}
                            onClick={() => onCategorySelect(type)}
                            className={`flex gap-2 md:gap-3 items-center whitespace-nowrap text-xs text-slate-500 px-4 py-2 rounded-full drop-shadow-md transition ${poiType === type ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                                }`}
                        >
                            <Icon className='w-3 h-3 md:w-4 md:h-4' />
                            {label}
                        </button>

                    ))}
                </div>
            </div>

            {showMore && (
                <POIMore
                    onClose={closeMore}
                    onSelect={handleSelect} />
            )}
        </>
    )
}

export default POICategory
