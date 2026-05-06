import { AssistantContext } from './hooks/useAssistant'
import { useGeolocation } from './hooks/useGeolocationContext'
import { useState, useRef, useMemo, useCallback } from 'react'
import MapView from './map/MapView'
import useNetwork from './features/network/hooks/useNetwork'
import OfflineBanner from './components/OfflineBanner'
import { loadCacheMeta } from './features/offline/utils/locationCache'
import { lastUpdated } from './features/offline/utils/lastUpdated'

const App = () => {

  const [poiIntent, setPoiIntent] = useState(null);
  const { position, setPosition, selectedPlace, setSelectedPlace } = useGeolocation();
  const isOnline = useNetwork()

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
    poiIntent,
    onPOIIntent,
    isOnline
  }), [
    position,
    setPosition,
    selectedPlace,
    setSelectedPlace,
    poiIntent,
    onPOIIntent,
    isOnline
  ])

  // const handleSetQuery = useCallback((val) => {
  //   setQuery(val);
  //   setPoiIntUsedirectioncontrolslogicent(null);
  // }, []);
  // const handleSetTransitLayer = useCallback((val) => setShowTransitLayer(val), []);


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
          // setQuery={handleSetQuery}
          poiIntent={poiIntent}
        />

      </div>
    </AssistantContext.Provider>
  )
}

export default App
