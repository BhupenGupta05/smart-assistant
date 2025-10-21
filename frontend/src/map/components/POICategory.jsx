import { Ellipsis, Utensils, ShoppingBag, Bed, Fuel, Coffee, Hospital, TramFront } from 'lucide-react'
import { useState } from 'react'
import POIMore from './POIMore'

const categories = [
    { label: "Restaurants", type: "restaurant", icon: Utensils },
    { label: "Shopping", type: "shopping_mall", icon: ShoppingBag },
    { label: "Petrol", type: "gas_station", icon: Fuel },
    { label: "Hotels", type: "lodging", icon: Bed },
    { label: "Hospitals & Clinics", type: "hospital", icon: Hospital },
    { label: "Coffee", type: "cafe", icon: Coffee },
    { label: "Transit Stations", type: "transit_station", icon: TramFront },
    { label: "More", type: "more", icon: Ellipsis }
]

const POICategory = ({ poiType, setPoiType, clearPOIs, refetchPOIs }) => {
    const [showMore, setShowMore] = useState(false);
    const handleCategoryClick = (type) => {
        if(type === "more") {
            setShowMore(true);
            return; 
        }
        if (poiType === type) {
            setPoiType(null);
            clearPOIs();
        } else {
            setPoiType(type);
            refetchPOIs();
        }
    }
    return (
        <>
            <div className='absolute top-[80px] left-1 right-1 z-[999] flex justify-center'>
                <div className='flex flex-wrap sm:flex-nowrap overflow-x-auto gap-1 sm:gap-2 md:gap-3 py-2 no-scrollbar mx-4'>
                    {categories.map(({ label, type, icon: Icon }) => (
                        <button
                            key={type}
                            onClick={() => handleCategoryClick(type)}
                            className={`flex gap-2 md:gap-3 items-center whitespace-nowrap text-xs md:text-sm px-4 py-1 rounded-full shadow-xs md:shadow-sm transition ${poiType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
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
                    onClose={() => setShowMore(false)}
                    setPoiType={setPoiType}
                    refetchPOIs={refetchPOIs} />
            )}
        </>
    )
}

export default POICategory
