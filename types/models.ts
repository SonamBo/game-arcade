/**
 * The data model — transcribed from the build brief §5.
 * Every persisted shape in the app is defined here and nowhere else.
 */

export type Family = 'TAP' | 'SWIPE' | 'TIMING' | 'NUMBERS' | 'MEMORY';

/** Where a run was started from. Feeds the `run_started` event (UI spec §10). */
export type RunSource =
  | 'shelf'
  | 'ranked'
  | 'queue'
  | 'duel'
  | 'inbox'
  | 'feed'
  | 'poster'
  | 'retry';

export interface Game {
  id: string;
  name: string;
  /** Three letters, e.g. 'STK'. */
  code: string;
  family: Family;
  /** 'blocks' | 'ms' | 'm' | ... */
  unit: string;
  /** True for time-style units where a smaller number is a better score. */
  lowerIsBetter: boolean;
  /** Whether a real engine backs this game yet. */
  playable: boolean;
  /** One sentence: the rule, not a pitch. */
  blurb: string;
}

export interface Progress {
  best: number;
  runs: number;
  lastPlayed: number | null;
  pinned: boolean;
}

export interface Rival {
  handle: string;
  score: number;
  recordedAt: number;
  /** True for a cold-start rival, which must be labelled GLOBAL RIVAL. */
  isGlobal: boolean;
}

export interface Run {
  gameId: string;
  score: number;
  prevBest: number;
  improved: boolean;
  beatGhost: boolean;
  delta: number;
  nearMiss: boolean;
  coins: number;
  /** Score this run inherited from a retry, if any. */
  carriedFrom?: number;
  /** True when played under the day's variant rules. */
  variant: boolean;
  startedAt: number;
  endedAt: number;
  source: RunSource;
}

export interface Wallet {
  coins: number;
  freeRetriesLeft: number;
  /** Local-midnight timestamp at which free retries go back to 3. */
  retriesResetAt: number;
}

export interface Session {
  runs: Run[];
  distinctGames: string[];
  startedAt: number;
}

/** A finished session, kept for the distinct-games-per-session metric. */
export interface SessionRecord {
  startedAt: number;
  endedAt: number;
  runs: number;
  distinctGames: number;
  endedBy: 'queue_cancel' | 'app_background' | 'navigation';
}

/* ------------------------------------------------------------------ *
 * Ranking — implemented once, used by both the shelf and the queue.
 * Build brief §5.
 * ------------------------------------------------------------------ */

export interface RankInput {
  game: Game;
  rivalAhead: boolean;
  neverPlayed: boolean;
  friendsOn: number;
  rivalHandle?: string;
  rivalScore?: number;
  best?: number;
}

/** Ascending: 0 sorts first. */
export function rankScore(g: RankInput): number {
  if (g.rivalAhead) return 0;
  if (g.neverPlayed) return 1;
  return 2;
}

/** Ties broken by friends-on count, descending. */
export function compareRank(a: RankInput, b: RankInput): number {
  const d = rankScore(a) - rankScore(b);
  return d !== 0 ? d : b.friendsOn - a.friendsOn;
}

/** Rendered on the top three rows only. */
export function reasonLine(g: RankInput): string {
  if (g.rivalAhead && g.rivalHandle != null) {
    const by = Math.abs((g.rivalScore ?? 0) - (g.best ?? 0));
    return `${g.rivalHandle} BEAT YOU BY ${by}`;
  }
  if (g.neverPlayed) {
    return `${g.friendsOn} FRIENDS PLAY THIS · YOU NEVER HAVE`;
  }
  return `QUEST 1/3 · ${g.friendsOn} FRIENDS ON TODAY`;
}

/** First ranked game that is not the one just played. */
export function nextInQueue(
  ranked: RankInput[],
  justPlayedId: string
): RankInput | undefined {
  return ranked.find((g) => g.game.id !== justPlayedId);
}

/* ------------------------------------------------------------------ *
 * Economy — build brief §6 shared rules, UI spec §7.
 * ------------------------------------------------------------------ */

export const RETRY_COST = 50;
export const FREE_RETRIES_PER_DAY = 3;
export const NEAR_MISS_BAND = 0.18;
export const PIN_CAP = 12;
export const QUEUE_SECONDS = 3;
/** The rival's recorded score ticks up over roughly this many seconds. */
export const GHOST_TICK_SECONDS = 16;

/** Coins earned: distance-scored games divide by 40, everything else by 1.6. */
export function coinsFor(score: number, unit: string, variant: boolean): number {
  const divisor = unit === 'm' ? 40 : 1.6;
  return Math.max(8, Math.round(score / divisor)) * (variant ? 2 : 1);
}

/** Within 18% of the player's best, without beating it. */
export function isNearMiss(
  prevBest: number,
  improved: boolean,
  delta: number
): boolean {
  return prevBest > 0 && !improved && delta <= Math.max(2, prevBest * NEAR_MISS_BAND);
}

/** Ghost score displayed at `elapsed` seconds into a run. */
export function ghostDisplayed(target: number, elapsed: number): number {
  return Math.min(target, Math.round(target * Math.min(1, elapsed / GHOST_TICK_SECONDS)));
}
