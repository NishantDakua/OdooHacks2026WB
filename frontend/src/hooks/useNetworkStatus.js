import { useState, useEffect } from "react";
import { processOfflineQueue } from "../lib/db/offlineSync";

/**
 * Hook to monitor online/offline network status and handle auto-synchronization when connection restores.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      console.log("[NetworkStatus] Network restored. Processing offline queue...");
      await processOfflineQueue();
      setIsSyncing(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("[NetworkStatus] Network connection lost. App running in offline mode.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, isSyncing };
}
