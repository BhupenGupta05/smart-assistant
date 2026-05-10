import { DirectionsProvider } from '../features/directions/context/DirectionsProvider'
import { POIProvider } from '../features/poi/hooks/usePOIContext'
import { GeolocationProvider } from '../hooks/useGeolocationContext'
import { MapUIProvider } from './MapUIProvider'
import { SearchProvider } from './SearchProvider'

const AppProvider = ({ children }) => {
  return (
    <GeolocationProvider>
      <DirectionsProvider>
        <MapUIProvider>
          <SearchProvider>
            <POIProvider>
              {children}
            </POIProvider>
          </SearchProvider>
        </MapUIProvider>
      </DirectionsProvider>
    </GeolocationProvider>
  )
}

export default AppProvider