import MapView from './map/MapView'
import useNetwork from './features/network/hooks/useNetwork'
import OfflineBanner from './components/OfflineBanner'
import { loadCacheMeta } from './features/offline/utils/locationCache'
import { lastUpdated } from './features/offline/utils/lastUpdated'
import { useMemo } from 'react'

const App = () => {
  const isOnline = useNetwork();

  // Only runs when isOnline changes not on every render
  const offlineMessage = useMemo(() => {
    if (isOnline) return null;

    const locationLastUpdatedTs = loadCacheMeta();
    const locationLastUpdatedText = locationLastUpdatedTs
      ? lastUpdated(locationLastUpdatedTs)
      : null;

    return locationLastUpdatedText
      ? `⚠️ You’re offline — using last known location · updated ${locationLastUpdatedText}`
      : `⚠️ You’re offline — using last known location`;
  }, [isOnline]);

  return (
    <>
      {!isOnline && <OfflineBanner message={offlineMessage} />}
      <MapView
      />
    </>
  )
}

export default App
