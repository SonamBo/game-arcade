import type { Wallet } from '@/types/models';
import { FREE_RETRIES_PER_DAY, RETRY_COST } from '@/types/models';
import type { SliceCreator } from '../types';
import { localDayKey, nextLocalMidnight } from '../types';

export type RetryResult = 'free' | 'paid' | 'insufficient';

export interface EconomySlice {
  /** One wallet. Coins are global and never labelled per-game. Persisted. */
  wallet: Wallet;
  /** Persisted. Incremented on any run, once per local day. */
  streak: { days: number; lastRunDay: string | null };

  awardCoins: (n: number) => void;
  /** Returns false when the balance is short; the caller routes to Shop. */
  spendCoins: (n: number) => boolean;
  /**
   * Takes a retry. Free while any remain, otherwise charges RETRY_COST.
   * 'insufficient' means the caller must route to Shop rather than fail silently.
   */
  takeRetry: () => RetryResult;
  /** Rolls free retries and the streak over at local midnight. Idempotent. */
  dailyReset: (now: number) => void;
  noteRunForStreak: (now: number) => void;
}

export const createEconomySlice: SliceCreator<EconomySlice> = (set, get) => ({
  wallet: {
    coins: 0,
    freeRetriesLeft: FREE_RETRIES_PER_DAY,
    retriesResetAt: 0,
  },
  streak: { days: 0, lastRunDay: null },

  awardCoins: (n) =>
    set((s) => ({ wallet: { ...s.wallet, coins: s.wallet.coins + Math.max(0, n) } })),

  spendCoins: (n) => {
    if (get().wallet.coins < n) return false;
    set((s) => ({ wallet: { ...s.wallet, coins: s.wallet.coins - n } }));
    return true;
  },

  takeRetry: () => {
    const { wallet } = get();
    if (wallet.freeRetriesLeft > 0) {
      set((s) => ({
        wallet: { ...s.wallet, freeRetriesLeft: s.wallet.freeRetriesLeft - 1 },
      }));
      return 'free';
    }
    if (wallet.coins < RETRY_COST) return 'insufficient';
    set((s) => ({ wallet: { ...s.wallet, coins: s.wallet.coins - RETRY_COST } }));
    return 'paid';
  },

  dailyReset: (now) =>
    set((s) => {
      if (now < s.wallet.retriesResetAt) return {};
      return {
        wallet: {
          ...s.wallet,
          freeRetriesLeft: FREE_RETRIES_PER_DAY,
          retriesResetAt: nextLocalMidnight(now),
        },
      };
    }),

  noteRunForStreak: (now) =>
    set((s) => {
      const today = localDayKey(now);
      if (s.streak.lastRunDay === today) return {};

      const yesterday = localDayKey(now - 24 * 60 * 60 * 1000);
      const continued = s.streak.lastRunDay === yesterday;
      return {
        streak: { days: continued ? s.streak.days + 1 : 1, lastRunDay: today },
      };
    }),
});
