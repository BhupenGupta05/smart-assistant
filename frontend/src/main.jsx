import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AppProvider from './providers/AppProvider.jsx'
import LandingPage from './pages/LandingPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AppProvider>
        {/* <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/app' element={<App />} />
        </Routes> */}
        <App />
      </AppProvider>
  </StrictMode>
)
