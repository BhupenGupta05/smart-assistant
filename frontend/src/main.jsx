import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GeolocationProvider } from './hooks/GeolocationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GeolocationProvider>
 <App />
    </GeolocationProvider>
   
  </StrictMode>,
)
