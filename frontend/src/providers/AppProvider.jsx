import React from 'react'
import { GeolocationProvider } from '../hooks/useGeolocationContext'
import { POIProvider } from '../features/poi/hooks/usePOIContext'

const AppProvider = ({ children }) => {
  return (
    <GeolocationProvider>
      <POIProvider>
        {children}
      </POIProvider>
    </GeolocationProvider>
  )
}

export default AppProvider
