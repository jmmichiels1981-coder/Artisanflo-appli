import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Capture PWA install prompt event early
window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log('beforeinstallprompt fired globally');
});

// Explicitly register Service Worker
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, click on reload button to update.');
  },
  onOfflineReady() {
    console.log('Content is cached for offline use.');
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
