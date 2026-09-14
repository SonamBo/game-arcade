import type { Progress, Run } from '@/types/models';
import { PIN_CAP } from '@/types/models';
import type { SliceCreator } from '../types';

export type PinResult = 'pinned' | 'unpinned' | 'refused';

export interface GamesSlice {
  /** Per-game progress. Persisted. */
  progress: Record<string, Progress>;
  /** The curated twelve, in shelf order. Persisted. */
  pinnedOrder: string[];
  /** Persisted so onboarding never runs twice. */
  onboardingComplete: boolean;

  getProgress: (gameId: string) => Progress;
  recordRun: (run: Run) => void;
  togglePin: (gameId: string) => PinResult;
  completeOnboarding: (picks: string[]) => void;
}

const EMPTY: Progress = { best: 0, runs: 0, lastPlayed: null, pinned: false };

export const createGamesSlice: SliceCreator<GamesSlice> = (set, get) => ({
  progress: {},
  pinnedOrder: [],
  onboardingComplete: false,

  getProgress: (gameId) => get().progress[gameId] ?? EMPTY,

  recordRun: (run) =>
    set((s) => {
      const prev = s.progress[run.gameId] ?? EMPTY;
      // `improved` is decided by the caller, which knows whether the game is
      // lower-is-better. The store only records what it is told.
      const best = run.improved ? run.score : prev.best;
      return {
        progress: {
          ...s.progress,
          [run.gameId]: {
            ...prev,
            best,
            runs: prev.runs + 1,
            lastPlayed: run.endedAt,
          },
        },
      };
    }),

  togglePin: (gameId) => {
    const { pinnedOrder } = get();
    const already = pinnedOrder.includes(gameId);

    if (already) {
      set((s) => ({
        pinnedOrder: s.pinnedOrder.filter((id) => id !== gameId),
        progress: markPinned(s.progress, gameId, false),
      }));
      return 'unpinned';
    }

    // A thirteenth pin is refused until one is dropped. No dialog, no forced
    // swap — the caller shows the ink toast.
    if (pinnedOrder.length >= PIN_CAP) return 'refused';

    set((s) => ({
      pinnedOrder: [...s.pinnedOrder, gameId],
      progress: markPinned(s.progress, gameId, true),
    }));
    return 'pinned';
  },

  completeOnboarding: (picks) =>
    set((s) => {
      const seeded = picks.slice(0, PIN_CAP);
      let progress = s.progress;
      for (const id of seeded) progress = markPinned(progress, id, true);
      return { onboardingComplete: true, pinnedOrder: seeded, progress };
    }),
});

function markPinned(
  progress: Record<string, Progress>,
  gameId: string,
  pinned: boolean
): Record<string, Progress> {
  const prev = progress[gameId] ?? EMPTY;
  return { ...progress, [gameId]: { ...prev, pinned } };
}
