import '../styles/globals.css'
import { useRef, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    const intervalRef = useRef(null);
    const pendingReloadRef = useRef(false);

    const hardReload = () => {
    window.location.replace(window.location.pathname + '?v=' + Date.now());
  };

  const checkAppVersion = async () => {
    try {
      console.log(' =====>> |Check App Version| <<=====');

      const latestClientVersion = process.env.APP_VERSION || '3.0.3';

      if (!latestClientVersion) {
        console.log('--- No client version found ---');
        return;
      }

      const healthCheckResponse = await fetch(`https://test-api-app-version-inb1.vercel.app/api/health/app-version`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!healthCheckResponse.ok) {
        console.error('[Version Checker] API health check failed');
        return;
      }

      const healthCheckData = await healthCheckResponse.json();
      console.log('healthCheckData: ', healthCheckData);
      const latestAPIVersion = healthCheckData?.version;

      if (!latestAPIVersion) {
        console.log('--- No API version found ---');
        return;
      }

      console.log('latestClientVersion: ', latestClientVersion);
      console.log('latestAPIVersion: ', latestAPIVersion);
      const isDiffVersion = latestClientVersion !== latestAPIVersion;
      if (isDiffVersion) {
        // Mark that we need to reload
        pendingReloadRef.current = true;

        // If tab is already active, reload immediately
        if (!document.hidden) {
          hardReload();
        }
      }
    } catch (error) {
      console.error('[Version Checker] Error checking version:', error);
    }
  };

  useEffect(() => {
    pendingReloadRef.current = false;

    const onVisibility = () => {
      if (document.hidden) return;

      // If user returns to tab → perform pending reload
      if (pendingReloadRef.current) {
        hardReload();
        return;
      }

      // Register SW only when user is active
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            // Clear any existing interval
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
              checkAppVersion();
            }, 5000);
          },
          function (err) {
            console.log('Service Worker registration failed: ', err);
          },
        );
      }
    };

    // Initial
    onVisibility();

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);


  return <Component {...pageProps} />
}

export default MyApp
