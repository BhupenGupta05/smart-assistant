import { DirectionsProvider } from '../features/directions/context/DirectionsProvider'
import { GeolocationProvider } from '../hooks/useGeolocationContext'
import { MapUIProvider } from './MapUIProvider'
import { SearchProvider } from './SearchProvider'

const AppProvider = ({ children }) => {
  return (
    <GeolocationProvider>
      <DirectionsProvider>
        <MapUIProvider>
          <SearchProvider>
             {children}
          </SearchProvider>
        </MapUIProvider>
      </DirectionsProvider>
    </GeolocationProvider>
  )
}

export default AppProvider