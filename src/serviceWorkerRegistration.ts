// src/serviceWorkerRegistration.ts
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker.register(swUrl).then((registration) => {
        console.log('SW registered: ', registration);
      }).catch((error) => {
        console.log('SW registration failed: ', error);
      });
    });
  }
}