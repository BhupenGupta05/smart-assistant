import { useImperativeHandle, forwardRef } from 'react';
import { Search } from 'lucide-react';
import useSearchController from './useSearchController';

const SearchBar = forwardRef(({ query, setQuery, setPosition, setSelectedPlace }, ref) => {

    const controller = useSearchController({
        externalQuery: query,
        onExternalQueryChange: setQuery,
        onSetPosition: setPosition,
        onSelectPlace: setSelectedPlace
    })

    useImperativeHandle(ref, () => ({
        searchLocationAndSelectFirst: controller.searchAndSelectFirst
    }));

    return (
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-[36%] sm:w-[33%] md:w-[30%] lg:w-[27%] rounded-md'>
            <div className='relative w-full flex items-center'>
                <input
                    type="text"
                    className='w-full p-2 rounded bg-white shadow-md border-slate-200 text-xs focus:outline-none font-medium sm:text-sm md:text-base'
                    placeholder='Search...'
                    value={controller.value}
                    onChange={(e) => {
                        controller.updateQuery(e.target.value);
                    }}
                    onFocus={() => controller.setShowResults(true)}
                    onBlur={() => setTimeout(() => controller.setShowResults(false), 150)}
                />

                <button className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer'>
                    <Search className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5' />
                </button>
            </div>

            {controller.showResults && controller.results.length > 0 && (
                <div className='bg-white rounded mt-1 max-h-60 overflow-y-auto shadow-md'>
                    {controller.results.map((place, idx) => (
                        <div
                            key={idx}
                            className='p-2 font-medium cursor-pointer hover:bg-slate-300 text-xs sm:text-sm md:text-base border-slate-200 border-[1px]'
                            onMouseDown={() => controller.selectPlace(place)}
                        >
                            📍 {place.address}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

export default SearchBar;


