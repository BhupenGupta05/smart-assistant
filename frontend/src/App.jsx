import { AssistantContext } from './hooks/useAssistant'
import { useGeolocation } from './hooks/useGeolocationContext'
import { useMemo } from 'react'
import MapView from './map/MapView'
import useNetwork from './features/network/hooks/useNetwork'
import OfflineBanner from './components/OfflineBanner'
import { loadCacheMeta } from './features/offline/utils/locationCache'
import { lastUpdated } from './features/offline/utils/lastUpdated'

const App = () => {
  const { position, setPosition, selectedPlace, setSelectedPlace } = useGeolocation();
  const isOnline = useNetwork()


  const assistantContextValue = useMemo(() => ({
    position,
    setPosition,
    selectedPlace,
    setSelectedPlace,
    isOnline
  }), [
    position,
    setPosition,
    selectedPlace,
    setSelectedPlace,
    isOnline
  ])

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
        />

      </div>
    </AssistantContext.Provider>
  )
}

export default App
