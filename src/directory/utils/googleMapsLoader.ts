let loadingPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  // If already loaded, return immediately
  if (window.google?.maps) {
    return Promise.resolve();
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  // Create new loading promise
  loadingPromise = new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Wait for it to load
      const checkGoogle = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogle);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkGoogle);
        reject(new Error('Google Maps API failed to load'));
      }, 5000);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;

    script.onload = () => {
      // Wait for google.maps to be available
      const checkGoogle = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogle);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkGoogle);
        reject(new Error('Google Maps API failed to initialize'));
      }, 5000);
    };

    script.onerror = () => {
      loadingPromise = null;
      reject(new Error('Failed to load Google Maps API'));
    };

    document.body.appendChild(script);
  });

  return loadingPromise;
};
