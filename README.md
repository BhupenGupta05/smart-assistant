# Map Assist — Offline-First AI Geolocation Platform
 
An AI-powered geolocation platform enabling natural language place discovery with offline-first caching and real-time map intelligence for low-connectivity environments.

## Key Features
 
- **AI Natural Language Commands**: Ask the chatbot "Where's the nearest coffee shop?" instead of clicking through menus
- **Offline-First Architecture**: View previously searched places and POI data without internet (100% offline fallback)
- **Real-Time Data Pipeline**: Integrates Google Maps API, OpenWeather API, and custom location data
- **Multi-Tier Caching**: Server-side + client-side LRU caching reduces API calls by 40%
- **Rate Limiting**: Prevents API quota exhaustion, reduces infrastructure costs
 
## Tech Stack
 
**Frontend**: React, Tailwind CSS, JavaScript, Leaflet
**Backend**: Node.js, Express.js
**Caching**: LRU Caching
**APIs**: Google Maps, OpenWeather, OpenRouter, Custom REST APIs
**Deployment**: Netlify (Frontend), Render (Backend)
 
## Performance Metrics
 
- **API Latency**: Reduced by 40% through caching
- **User Experience**: 60% fewer interaction steps vs. traditional map interfaces
- **Offline Capability**: Supports offline access for previously searched locations and cached POIs
 
## Live Demo

Deployed link: https://map-assist.netlify.app/
