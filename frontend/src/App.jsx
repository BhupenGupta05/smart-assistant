import { AssistantContext } from './hooks/useAssistant'
import { useGeolocation } from './hooks/useGeolocationContext'
import { usePOI } from './hooks/usePOIContext'
import { useState, useRef } from 'react'
import MapView from './map/MapView'

const App = () => {

  const [query, setQuery] = useState(''); // Search query state
  const { position, setPosition, selectedPlace, setSelectedPlace } = useGeolocation();
  const { poiResults, setPoiResults, poiType, setPoiType, refetchPOIs, clearPOIs } = usePOI();
  const [showTransitLayer, setShowTransitLayer] = useState(false); // Show Transit Layer only for transit_station poiType
  
  const searchRef = useRef(); // Reference to Search input instance
  const directionsRef = useRef(); // Reference to Origin/Destination input instance

  return (
    <AssistantContext.Provider value={{
      position,
      setPosition,
      selectedPlace,
      setSelectedPlace,
      poiType,
      setPoiType,
      poiResults,
      setPoiResults,
      refetchPOIs,
      clearPOIs,
      query,
      setQuery,
      showTransitLayer,
      setShowTransitLayer,
      searchRef,
      directionsRef
    }}>
      <div className='text-center text-2xl font-bold'>
        <MapView
          directionsRef={directionsRef}
          searchRef={searchRef}
          query={query}
          setQuery={setQuery}
          showTransitLayer={showTransitLayer}
          setShowTransitLayer={setShowTransitLayer}
        />

        {/* <SimpleMap /> */}
      </div>
    </AssistantContext.Provider>
  )
}

export default App
