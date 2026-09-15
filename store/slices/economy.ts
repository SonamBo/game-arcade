import { DAILY_QUESTS } from '@/data/quests';
import type { QuestMetric } from '@/data/quests';
import type { Run, Wallet } from '@/types/models';
import { FREE_RETRIES_PER_DAY, RETRY_COST } from '@/types/models';
import type { SliceCreator } from '../types';
import { localDayKey, nextLocalMidnight } from '../types';

export type RetryResult = 'free' | 'paid' | 'insufficient';
export type PowerUp = 'retry' | 'ghostScout' | 'streakFreeze';
export type BuyResult = 'ok' | 'insufficient';

export const POWERUP_COST: Record<PowerUp, number> = {
  retry: 50,
  ghostScout: 120,
  streakFreeze: 300,
};

/** Per-day quest counters, keyed to the local day. */
export interface QuestState {
  day: string;
  runs: number;
  distinct: string[];
  bestsBeaten: number;
  ghostsTaken: number;
  variantCleared: number;
  claimed: string[];
}

function freshQuests(day: string): QuestState {
  return { day, runs: 0, distinct: [], bestsBeaten: 0, ghostsTaken: 0, variantCleared: 0, claimed: [] };
}

export interface EconomySlice {
  /** One wallet. Coins are global and never labelled per-game. Persisted. */
  wallet: Wallet;
  /** Persisted. Incremented on any run, once per local day. */
  streak: { days: number; lastRunDay: string | null };
  /** Persisted daily quest progress. */
  quests: QuestState;
  /** Persisted power-ups the player has bought. */
  powerups: { ghostScout: boolean; streakFreeze: boolean };

  awardCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  takeRetry: () => RetryResult;
  buyPowerUp: (kind: PowerUp) => BuyResult;
  dailyReset: (now: number) => void;
  noteRunForStreak: (now: number) => void;
  /** Advance quest counters from a finished run. */
  noteQuestRun: (run: Run) => void;
  /** Claim a completed, unclaimed quest for its coins. */
  claimQuest: (id: string) => boolean;
  /** Current count for a quest metric. */
  questValue: (metric: QuestMetric) => number;
}

export const createEconomySlice: SliceCreator<EconomySlice> = (set, get) => ({
  wallet: { coins: 0, freeRetriesLeft: FREE_RETRIES_PER_DAY, retriesResetAt: 0 },
  streak: { days: 0, lastRunDay: null },
  quests: freshQuests(localDayKey(Date.now())),
  powerups: { ghostScout: false, streakFreeze: false },

  awardCoins: (n) => set((s) => ({ wallet: { ...s.wallet, coins: s.wallet.coins + Math.max(0, n) } })),

  spendCoins: (n) => {
    if (get().wallet.coins < n) return false;
    set((s) => ({ wallet: { ...s.wallet, coins: s.wallet.coins - n } }));
    return true;
  },

  takeRetry: () => {
    const { wallet } = get();
    if (wallet.freeRetriesLeft > 0) {
      set((s) => ({ wallet: { ...s.wallet, freeRetriesLeft: s.wallet.freeRetriesLeft - 1 } }));
      return 'free';
    }
    if (wallet.coins < RETRY_COST) return 'insufficient';
    set((s) => ({ wallet: { ...s.wallet, coins: s.wallet.coins - RETRY_COST } }));
    return 'paid';
  },

  buyPowerUp: (kind) => {
    const cost = POWERUP_COST[kind];
    if (!get().spendCoins(cost)) return 'insufficient';
    if (kind === 'retry') {
      // A banked retry on top of the free three.
      set((s) => ({ wallet: { ...s.wallet, freeRetriesLeft: s.wallet.freeRetriesLeft + 1 } }));
    } else {
      set((s) => ({ powerups: { ...s.powerups, [kind]: true } }));
    }
    return 'ok';
  },

  dailyReset: (now) => {
    const today = localDayKey(now);
    set((s) => {
      const next: Partial<EconomySlice> = {};
      if (now >= s.wallet.retriesResetAt) {
        next.wallet = { ...s.wallet, freeRetriesLeft: FREE_RETRIES_PER_DAY, retriesResetAt: nextLocalMidnight(now) };
      }
      if (s.quests.day !== today) next.quests = freshQuests(today);
      return next;
    });
  },

  noteRunForStreak: (now) =>
    set((s) => {
      const today = localDayKey(now);
      if (s.streak.lastRunDay === today) return {};
      const yesterday = localDayKey(now - 24 * 60 * 60 * 1000);
      let continued = s.streak.lastRunDay === yesterday || s.streak.lastRunDay === null;
      let powerups = s.powerups;
      // A streak freeze covers exactly one missed day, then is consumed.
      if (!continued && s.streak.lastRunDay !== null && s.powerups.streakFreeze) {
        continued = true;
        powerups = { ...s.powerups, streakFreeze: false };
      }
      return { streak: { days: continued ? s.streak.days + 1 : 1, lastRunDay: today }, powerups };
    }),

  noteQuestRun: (run) =>
    set((s) => {
      const today = localDayKey(run.endedAt);
      const q = s.quests.day === today ? s.quests : freshQuests(today);
      const distinct = q.distinct.includes(run.gameId) ? q.distinct : [...q.distinct, run.gameId];
      return {
        quests: {
          ...q,
          runs: q.runs + 1,
          distinct,
          bestsBeaten: q.bestsBeaten + (run.improved ? 1 : 0),
          ghostsTaken: q.ghostsTaken + (run.beatGhost ? 1 : 0),
          variantCleared: q.variantCleared + (run.variant ? 1 : 0),
        },
      };
    }),

  claimQuest: (id) => {
    const def = DAILY_QUESTS.find((d) => d.id === id);
    if (!def) return false;
    const q = get().quests;
    if (q.claimed.includes(id)) return false;
    if (get().questValue(def.metric) < def.goal) return false;
    get().awardCoins(def.coin);
    set((s) => ({ quests: { ...s.quests, claimed: [...s.quests.claimed, id] } }));
    return true;
  },

  questValue: (metric) => {
    const q = get().quests;
    return metric === 'distinct' ? q.distinct.length : q[metric];
  },
});
