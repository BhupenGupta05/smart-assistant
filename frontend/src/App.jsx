import { AssistantContext } from './hooks/useAssistant'
import { useGeolocation } from './hooks/useGeolocationContext'
import { useState, useRef, useMemo, useCallback } from 'react'
import MapView from './map/MapView'
import useNetwork from './features/network/hooks/useNetwork'
import OfflineBanner from './components/OfflineBanner'
import { loadCacheMeta } from './features/offline/utils/locationCache'
import { lastUpdated } from './features/offline/utils/lastUpdated'

const App = () => {

  const [query, setQuery] = useState(''); // Search query state
  const [poiIntent, setPoiIntent] = useState(null);
  const { position, setPosition, selectedPlace, setSelectedPlace } = useGeolocation();
  const [showTransitLayer, setShowTransitLayer] = useState(false); // Show Transit Layer only for transit_station poiType

  const isOnline = useNetwork()

  const searchRef = useRef(); // Reference to Search input instance
  const directionsRef = useRef(); // Reference to Origin/Destination input instance

  const onPOIIntent = useCallback((intent) => {
    if (!intent) return;

    const { type, query, radius } = intent;

    const poiType = (type || query)?.toLowerCase();

    setPoiIntent({
      type: poiType,
      radius: radius || 1500
    });
    console.log("POITYPE: ",poiType);
    
    return `Showing nearby ${poiType}`;
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


  const locationLastUpdatedTs = !isOnline
    ? loadCacheMeta()
    : null;

  const locationLastUpdatedText = locationLastUpdatedTs
    ? lastUpdated(locationLastUpdatedTs)
    : null;

  const offlineMessage = locationLastUpdatedText
    ? `⚠️ You’re offline — using last known location · updated ${locationLastUpdatedText}`
    : `⚠️ You’re offline — using last known location`;

  return (
    <AssistantContext.Provider value={assistantContextValue}>
      {!isOnline && <OfflineBanner message={offlineMessage} />}
      <div className='text-center text-2xl font-bold'>
        <MapView
          directionsRef={directionsRef}
          searchRef={searchRef}
          query={query}
          setQuery={handleSetQuery}
          showTransitLayer={showTransitLayer}
          setShowTransitLayer={handleSetTransitLayer}
          poiIntent={poiIntent}
        />

      </div>
    </AssistantContext.Provider>
  )
}

export default App
