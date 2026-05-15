import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppProvider from './providers/AppProvider.jsx'

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
      <AppProvider>
        <App />
      </AppProvider>

  </StrictMode>
)
