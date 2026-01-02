import { useImperativeHandle, forwardRef } from 'react';
import { Search } from 'lucide-react';
import useSearch from '../controllers/useSearch'

const SearchBar = forwardRef(({ query, setQuery, setPosition, setSelectedPlace }, ref) => {

    const controller = useSearch({
        externalQuery: query,
        onExternalQueryChange: setQuery,
        onSetPosition: setPosition,
        onSelectPlace: setSelectedPlace
    })

    useImperativeHandle(ref, () => ({
        searchLocationAndSelectFirst: controller.searchAndSelectFirst
    }));

    return (
        <div className='w-full flex flex-col gap-3'>
            <div className='relative w-full flex items-center flex-1'>
                <input
                    type="text"
                    className='w-full px-4 py-[10px] bg-white border-slate-200 text-xs text-slate-600 outline-none md:px-5 md:py-2 lg:px-5 lg:py-[10px] font-medium md:text-sm backdrop-blur-md shadow-lg ring-1 ring-black/5 rounded-2xl transition-all focus-visible:ring-2 focus-visible:ring-cyan-400/50'
                    placeholder='Search location, places...'
                    value={controller.value}
                    onChange={(e) => {
                        controller.updateQuery(e.target.value);
                    }}
                    onFocus={() => controller.setShowResults(true)}
                    onBlur={() => setTimeout(() => controller.setShowResults(false), 150)}
                />

                <button className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer'>
                    <Search className='w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5' />
                </button>
            </div>


            {controller.showResults && controller.results.length > 0 && (
                <div
                    className="
      mt-1 max-h-64 overflow-y-auto
      rounded-xl
      bg-white/90 backdrop-blur-md
      shadow-lg
      ring-1 ring-black/5
    "
                >
                    {controller.results.map((place, idx) => (
                        <div
                            key={idx}
                            className="
          flex items-start gap-3
          px-4 py-3
          cursor-pointer
          text-xs md:text-sm font-medium
          text-slate-700

          transition-colors
          hover:bg-cyan-50/70

          border-b border-black/5
          last:border-b-0
        "
                            onMouseDown={() => controller.selectPlace(place)}
                        >
                            <span className="leading-snug">📍 {place.address}</span>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
});

export default SearchBar;

