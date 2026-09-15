/**
 * The seeded social graph — 23 friends, deterministic (build brief §7). Handles,
 * per-(friend, game) bests, head-to-head records and mutuals are all hashed from
 * stable keys, so nothing is random and screenshots reproduce. Never fabricated
 * at runtime; a cold-start rival that is not a real friend is labelled GLOBAL
 * RIVAL elsewhere (see data/seed.ts).
 *
 * This file plus store/slices/social.ts and data/social.ts is the whole social
 * layer. It is shaped like the eventual network layer on purpose: swapping in a
 * server is replacing these reads, not rewriting the screens.
 */
import { BASELINE, hash } from './seed';
import { metaFor } from './catalogue';

export interface Friend {
  handle: string;
  /** Single-letter avatar block. */
  initial: string;
}

const HANDLES = [
  'RAVI', 'MEHA', 'ARJUN', 'ZAID', 'NEHA', 'KABIR', 'IRA', 'DEV', 'KOJI', 'LARA',
  'OMAR', 'PRIYA', 'SAM', 'TARA', 'UMA', 'VIK', 'WREN', 'YASH', 'ZED', 'ANA',
  'BODE', 'CRUZ', 'ELI',
];

export const FRIENDS: Friend[] = HANDLES.map((handle) => ({ handle, initial: handle[0] }));

export const FRIEND_COUNT = FRIENDS.length;

/** A friend's best on a given game — deterministic, clustered near the baseline. */
export function friendBest(handle: string, gameId: string): number {
  const base = BASELINE[gameId] ?? 100;
  const lower = metaFor(gameId)?.lowerIsBetter ?? false;
  const swing = 0.78 + (hash(handle + gameId) % 45) / 100; // 0.78–1.22
  return Math.max(1, Math.round(lower ? base / swing : base * swing));
}

/** How many friends actively play a game (a subset of the 23), deterministic. */
export function friendsWhoPlay(gameId: string): Friend[] {
  return FRIENDS.filter((f) => hash(f.handle + gameId + 'plays') % 3 !== 0);
}

export interface HeadToHead {
  you: number;
  them: number;
  sinceMonth: string;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];

/** Seeded duel record between the player and a friend. */
export function headToHead(handle: string): HeadToHead {
  const h = hash(handle + 'h2h');
  const total = 20 + (h % 24);
  const them = Math.round(total * (0.42 + (hash(handle + 'w') % 30) / 100));
  return { you: total - them, them, sinceMonth: MONTHS[h % MONTHS.length] };
}

export function mutuals(handle: string): number {
  return 3 + (hash(handle + 'm') % 12);
}

/** "Played STACK 4 minutes ago" — a deterministic presence line. */
export function presence(handle: string): { gameId: string; minutesAgo: number } {
  const games = ['stack', 'reflex', 'dodge', 'snap', 'aim', 'glide'];
  const h = hash(handle + 'p');
  return { gameId: games[h % games.length], minutesAgo: 1 + (h % 58) };
}

/* ------------------------------------------------------------------ *
 * Seeded activity — the friend half of the feed, interleaved with the
 * player's own runs by timestamp in data/social.ts.
 * ------------------------------------------------------------------ */

export type ActivityKind = 'personal-best' | 'won-duel' | 'streak' | 'tried';

export interface SeededActivity {
  handle: string;
  gameId: string;
  kind: ActivityKind;
  minutesAgo: number;
}

/** Deterministic recent friend activity, newest first. */
export function seededActivity(): SeededActivity[] {
  const games = ['stack', 'dodge', 'reflex', 'merge', 'snap', 'orbit', 'aim', 'glide', 'lanes', 'flip'];
  const kinds: ActivityKind[] = ['personal-best', 'won-duel', 'streak', 'tried'];
  return FRIENDS.slice(0, 10)
    .map((f, i) => {
      const h = hash(f.handle + 'act');
      return {
        handle: f.handle,
        gameId: games[h % games.length],
        kind: kinds[h % kinds.length],
        minutesAgo: 2 + i * 7 + (h % 5),
      };
    })
    .sort((a, b) => a.minutesAgo - b.minutesAgo);
}

/** World-record / global-moment posts for the GLOBAL feed tab. */
export function globalActivity(): SeededActivity[] {
  const games = ['orbit', 'dodge', 'fuse', 'climb'];
  return games.map((gameId, i) => ({
    handle: 'WORLD RECORD',
    gameId,
    kind: 'personal-best' as const,
    minutesAgo: 20 + i * 45,
  }));
}
