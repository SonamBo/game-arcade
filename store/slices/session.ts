import type { Run, Session, SessionRecord } from '@/types/models';
import type { SliceCreator } from '../types';

/**
 * Distinct games per session is one of the two numbers that decide whether
 * this product works, so the session is first-class state rather than
 * something analytics infers later.
 *
 * The in-flight session is transient. Finished sessions persist.
 */
export interface SessionSlice {
  current: Session | null;
  history: SessionRecord[];

  beginSession: (now: number) => void;
  noteRun: (run: Run) => void;
  endSession: (reason: SessionRecord['endedBy'], now: number) => void;
  distinctGamesThisSession: () => number;
}

/** Keep the tail bounded; the metric only needs recent shape. */
const HISTORY_CAP = 200;

export const createSessionSlice: SliceCreator<SessionSlice> = (set, get) => ({
  current: null,
  history: [],

  beginSession: (now) =>
    set((s) =>
      s.current ? {} : { current: { runs: [], distinctGames: [], startedAt: now } }
    ),

  noteRun: (run) =>
    set((s) => {
      const cur = s.current ?? { runs: [], distinctGames: [], startedAt: run.startedAt };
      const distinct = cur.distinctGames.includes(run.gameId)
        ? cur.distinctGames
        : [...cur.distinctGames, run.gameId];
      return { current: { ...cur, runs: [...cur.runs, run], distinctGames: distinct } };
    }),

  endSession: (reason, now) =>
    set((s) => {
      const cur = s.current;
      if (!cur) return {};
      const record: SessionRecord = {
        startedAt: cur.startedAt,
        endedAt: now,
        runs: cur.runs.length,
        distinctGames: cur.distinctGames.length,
        endedBy: reason,
      };
      return {
        current: null,
        history: [...s.history, record].slice(-HISTORY_CAP),
      };
    }),

  distinctGamesThisSession: () => get().current?.distinctGames.length ?? 0,
});
