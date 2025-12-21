import { AssistantContext } from './hooks/useAssistant'
import { useGeolocation } from './hooks/useGeolocationContext'
import { usePOI } from './hooks/usePOIContext'
import { useState, useRef, useMemo, useCallback } from 'react'
import MapView from './map/MapView'

const App = () => {

  const [query, setQuery] = useState(''); // Search query state
  const { position, setPosition, selectedPlace, setSelectedPlace } = useGeolocation();
  const { poiResults, setPoiResults, poiType, setPoiType, refetchPOIs, clearPOIs } = usePOI();
  const [showTransitLayer, setShowTransitLayer] = useState(false); // Show Transit Layer only for transit_station poiType

  const searchRef = useRef(); // Reference to Search input instance
  const directionsRef = useRef(); // Reference to Origin/Destination input instance

  const assistantContextValue = useMemo(() => ({
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
  }), [
    position,
    selectedPlace,
    poiType,
    poiResults,
    query,
    showTransitLayer
  ])

  const handleSetQuery = useCallback((val) => setQuery(val), []);
  const handleSetTransitLayer = useCallback((val) => setShowTransitLayer(val), []);

  return (
    <AssistantContext.Provider value={assistantContextValue }>
      <div className='text-center text-2xl font-bold'>
        <MapView
          directionsRef={directionsRef}
          searchRef={searchRef}
          query={query}
          setQuery={handleSetQuery}
          showTransitLayer={showTransitLayer}
          setShowTransitLayer={handleSetTransitLayer}
        />

      </div>
    </AssistantContext.Provider>
  )
}

export default App
