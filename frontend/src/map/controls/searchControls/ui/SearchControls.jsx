import SearchBar from "../../../../features/search/ui/SearchBar"
import "leaflet/dist/leaflet.css"
import LayersTile from "../../../../features/layers/ui/Layers"
import Report from "../../../../features/report/ui/Report"
import { useSearchRefs } from "../../../../providers/SearchProvider"


const SearchControls = ({
  setPosition,
  setSelectedPlace,
  isOnline,
}) => {

  const { searchRef } = useSearchRefs();

  return (
    <>
      <div className="absolute
    top-4 left-4
    z-[1000]
    flex items-start
    gap-2
    w-[90vw]
    sm:w-[70vw]
    md:w-[55vw]
    lg:w-[45vw]
    max-w-[640px]">
        <div className="flex-1 min-w-0">
          <SearchBar
            ref={searchRef}
            setPosition={setPosition}
            setSelectedPlace={setSelectedPlace}
            isOnline={isOnline}
          />
        </div>

        <div className="shrink-0 h-10 w-10">
          <LayersTile />
        </div>

        <div className="shrink-0 h-10 w-10">
          <Report />
        </div>

      </div>

    </>
  )
}

export default SearchControls

