import { AssistantContext } from './hooks/useAssistant'
import { useGeolocation } from './hooks/useGeolocationContext'
import { useState, useRef, useMemo, useCallback } from 'react'
import MapView from './map/MapView'
import useNetwork from './features/network/hooks/useNetwork'
import OfflineBanner from './components/OfflineBanner'

const App = () => {

  const [query, setQuery] = useState(''); // Search query state
  const [poiIntent, setPoiIntent] = useState(null);
  const { position, setPosition, selectedPlace, setSelectedPlace } = useGeolocation();
  const [showTransitLayer, setShowTransitLayer] = useState(false); // Show Transit Layer only for transit_station poiType

  const isOnline = useNetwork()

  const searchRef = useRef(); // Reference to Search input instance
  const directionsRef = useRef(); // Reference to Origin/Destination input instance

  const onPOIIntent = useCallback((type) => {
    if (!type) return;

    setPoiIntent(type.toLowerCase());
    return `Showing nearby ${type}`;
  }, []);


  const assistantContextValue = useMemo(() => ({
    position,
    setPosition,
    selectedPlace,
    setSelectedPlace,
    query,
    setQuery,
    showTransitLayer,
    setShowTransitLayer,
    searchRef,
    directionsRef,
    poiIntent,
    onPOIIntent,
    isOnline
  }), [
    position,
    selectedPlace,
    query,
    showTransitLayer,
    poiIntent,
    isOnline
  ])

  const handleSetQuery = useCallback((val) => {
    setQuery(val);
    setPoiIntent(null);
  }, []);
  const handleSetTransitLayer = useCallback((val) => setShowTransitLayer(val), []);

  return (
    <AssistantContext.Provider value={assistantContextValue}>
      {!isOnline && <OfflineBanner />}
      <div className='text-center text-2xl font-bold'>
        <MapView
          directionsRef={directionsRef}
          searchRef={searchRef}
          query={query}
          setQuery={handleSetQuery}
          showTransitLayer={showTransitLayer}
          setShowTransitLayer={handleSetTransitLayer}
          poiIntent={poiIntent}
          isOnline={isOnline}
        />

      </div>
    </AssistantContext.Provider>
  )
}

export default App
