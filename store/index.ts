import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createEconomySlice } from './slices/economy';
import { createGamesSlice } from './slices/games';
import { createSessionSlice } from './slices/session';
import { createSocialSlice } from './slices/social';
import type { Store } from './types';

export type { Store } from './types';

/**
 * One store, slices per domain.
 *
 * Build brief §5: persist progress per game, wallet, streak, session history,
 * pin set and onboarding completion. Nothing else needs to survive a restart —
 * in particular the in-flight session does not, because an app that was killed
 * did not have its session continue.
 */
export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createGamesSlice(...a),
      ...createEconomySlice(...a),
      ...createSocialSlice(...a),
      ...createSessionSlice(...a),
    }),
    {
      name: 'game-arcade/v1',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        progress: s.progress,
        pinnedOrder: s.pinnedOrder,
        onboardingComplete: s.onboardingComplete,
        wallet: s.wallet,
        streak: s.streak,
        quests: s.quests,
        powerups: s.powerups,
        rivals: s.rivals,
        history: s.history,
      }),
    }
  )
);

/**
 * True once the persisted state has been read off disk.
 *
 * Nothing should render real numbers before this flips, or a cold start shows
 * a zeroed wallet for a frame and the player sees their coins vanish.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  return hydrated;
}
