import MapView from './map/MapView'
import useNetwork from './features/network/hooks/useNetwork'
import OfflineBanner from './components/OfflineBanner'
import { loadCacheMeta } from './features/offline/utils/locationCache'
import { lastUpdated } from './features/offline/utils/lastUpdated'

const App = () => {
  const isOnline = useNetwork();

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
    <>
      {!isOnline && <OfflineBanner message={offlineMessage} />}
      <div className='text-center text-2xl font-bold'>
        <MapView
        />

      </div>
    </>
  )
}

export default App
