/**
 * Connectivity, for the OFFLINE · SYNCING label (UI spec §9 offline state).
 *
 * v1 has no server, so there is nothing to actually sync — but the app must be
 * honest about being offline, and this is the seam a real sync queue plugs into
 * later. Runs, coins and feed posts already work fully offline because they are
 * local; on reconnect there is currently nothing to reconcile.
 */
import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export function useOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let mounted = true;
    Network.getNetworkStateAsync()
      .then((s) => mounted && setOnline(s.isConnected ?? true))
      .catch(() => {});
    const sub = Network.addNetworkStateListener((s) => setOnline(!!s.isConnected));
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return online;
}
