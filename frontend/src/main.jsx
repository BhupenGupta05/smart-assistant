import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AppProvider from './providers/AppProvider.jsx'
import LandingPage from './pages/LandingPage.jsx'
import NetworkProvider from './features/network/providers/NetworkProvider.jsx'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("SW registered"))
      .catch((err) => console.error("SW failed", err));
  });
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NetworkProvider>
      <AppProvider>
        {/* <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/app' element={<App />} />
        </Routes> */}
        <App />
      </AppProvider>

    </NetworkProvider>

  </StrictMode>
)
