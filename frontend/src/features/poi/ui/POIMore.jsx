import { Bed, Fuel, Binoculars, Clapperboard, Croissant, IceCreamCone, IndianRupee, LibraryBig, Martini, PillBottle, Plug, ShoppingBag, Siren, Sofa, Trees, X } from "lucide-react";

const sections = [
    {
        title: "🍽️ Food & Drinks",
        items: [
            { label: "Bakeries", type: "bakery", icon: Croissant },
            { label: "Bars & Pubs", type: "bar", icon: Martini },
            { label: "Ice Cream", type: "ice_cream", icon: IceCreamCone },
            { label: "Hotels", type: "lodging", icon: Bed },
        ],
    },
    {
        title: "🛍️ Shopping",
        items: [
            { label: "Malls", type: "shopping_mall", icon: ShoppingBag },
            { label: "Electronics", type: "electronics_store", icon: Plug },
            { label: "Bookstores", type: "book_store", icon: LibraryBig },
            { label: "Furniture", type: "furniture_store", icon: Sofa },
        ],
    },
    {
        title: "🏥 Services",
        items: [
            { label: "Pharmacies", type: "pharmacy", icon: PillBottle },
            { label: "Police Stations", type: "police", icon: Siren },
            { label: "ATMs", type: "atm", icon: IndianRupee },
            { label: "Petrol", type: "gas_station", icon: Fuel },
        ],
    },
    {
        title: "🎭 Leisure & Attractions",
        items: [
            { label: "Parks", type: "park", icon: Trees },
            { label: "Tourist Attractions", type: "tourist_attraction", icon: Binoculars },
            { label: "Movie Theaters", type: "movie_theater", icon: Clapperboard },
        ],
    }
];

const POIMore = ({ onClose, onSelect }) => {
    console.log("Rendering POIMore");

    return (
        <div className="fixed inset-0 bg-white z-[1000] animate-slide-up overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">Explore Nearby</h2>
                <button onClick={onClose}>
                    <X size={22} className="text-gray-600" />
                </button>
            </div>

            {/* Category Sections */}
            <div className="p-4 space-y-6">
                {sections.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-sm font-semibold text-gray-600 mb-3">
                            {section.title}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {section.items.map(({ label, type, icon: Icon }) => (
                                <button
                                    key={type}
                                    onClick={() =>
                                        onSelect(type)
                                    }
                                    className="flex gap-2 items-center bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-sm text-gray-800 transition"
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default POIMore
