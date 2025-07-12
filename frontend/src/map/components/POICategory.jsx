import { Ellipsis, Utensils, ShoppingBag, Bed, Fuel, Coffee, Hospital, TramFront } from 'lucide-react'

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

const POICategory = ({ poiType, setPoiType }) => {
    return (
        <div className='absolute top-[80px] left-1 right-1 z-[999] flex justify-center'>
            <div className='flex overflow-x-auto gap-2 py-2 no-scrollbar'>
                {categories.map(({ label, type, icon: Icon }) => (
                    <button
                        key={type}
                        onClick={() => setPoiType(type)}
                        className={`flex gap-2 items-center whitespace-nowrap text-sm px-4 py-1 rounded-full shadow-sm transition ${poiType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default POICategory
