/**
 * Cold-start seed and shared ranking.
 *
 * Stage 05 needs two things the store does not have on a fresh install: a named
 * GLOBAL RIVAL for every game, and a friends-on count to break rank ties. Both
 * are deterministic (hashed from the id), never random — so a fresh install
 * always shows a named rival and a reason line on every top-three row, and
 * screenshots are reproducible (build brief §7).
 *
 * The full social layer (23 seeded friends, head-to-head, the derived feed)
 * replaces and expands this in stage 06. What lives here is only the cold-start
 * minimum plus the one ranking path used by BOTH the shelf and the queue.
 */
import { GAMES, metaFor } from './catalogue';
import { isPlayableId } from '@/games/registry';
import type { Progress } from '@/types/models';
import { compareRank, nextInQueue } from '@/types/models';
import type { Game, RankInput } from '@/types/models';

/** Typical score for each game — the baseline a global rival is built around. */
const BASELINE: Record<string, number> = {
  stack: 47, reflex: 184, dodge: 2910, count: 31, merge: 512, aim: 68, hold: 9, lanes: 1104,
  flip: 6, orbit: 5, spin: 340, snap: 212, tilt: 880, rush: 96, chain: 14, split: 220,
  echo: 11, pulse: 38, drift: 1520, sort: 44, grid: 19, loop: 7, jump: 61, swap: 29,
  block: 730, trace: 16, pivot: 23, dash: 2140, match: 22, taps: 143, glide: 1980, shift: 410,
  catch: 52, wave: 12, zip: 1650, climb: 74, path: 17, slice: 88, bounce: 41, fuse: 620,
};

const RIVAL_NAMES = ['RAVI', 'MEHA', 'ARJUN', 'ZAID', 'NEHA', 'KABIR', 'IRA', 'DEV', 'KOJI', 'LARA'];

/** FNV-1a — small, stable string hash for deterministic seeding. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 2–12 friends playing a given game today. */
export function friendsOn(id: string): number {
  return 2 + (hash(id + 'f') % 11);
}

export interface SeedRival {
  handle: string;
  score: number;
  isGlobal: boolean;
}

/** One named, skill-matched global rival per game. Never fabricates a friend. */
export function globalRivalFor(id: string): SeedRival {
  const base = BASELINE[id] ?? 100;
  const meta = metaFor(id);
  const lower = meta?.lowerIsBetter ?? false;
  // A rival that sits a little the "hard" side of the baseline.
  const swing = 1 + (hash(id + 'r') % 12) / 100; // 1.00–1.11
  const score = Math.max(1, Math.round(lower ? base / swing : base * swing));
  return { handle: RIVAL_NAMES[hash(id) % RIVAL_NAMES.length], score, isGlobal: true };
}

function toGame(id: string): Game {
  const m = metaFor(id)!;
  return {
    id: m.id,
    name: m.name,
    code: m.code,
    family: m.family,
    unit: m.unit,
    lowerIsBetter: m.lowerIsBetter,
    playable: isPlayableId(m.id),
    blurb: m.blurb,
  };
}

/** Rank input for one game, given the player's progress. */
export function rankInputFor(id: string, progress: Record<string, Progress>): RankInput {
  const meta = metaFor(id)!;
  const p = progress[id];
  const best = p?.best ?? 0;
  const played = (p?.runs ?? 0) > 0;
  const rival = globalRivalFor(id);
  // A rival can only be "ahead" once you have a score of your own.
  const rivalAhead = played && (meta.lowerIsBetter ? rival.score < best : rival.score > best);
  return {
    game: toGame(id),
    rivalAhead,
    neverPlayed: !played,
    friendsOn: friendsOn(id),
    rivalHandle: rival.handle,
    rivalScore: rival.score,
    best,
  };
}

/** Rank inputs for a set of ids (e.g. the pinned shelf), sorted. */
export function rankInputs(ids: string[], progress: Record<string, Progress>): RankInput[] {
  return ids.map((id) => rankInputFor(id, progress)).sort(compareRank);
}

/** The whole catalogue, ranked. The queue and the shelf share this path. */
export function rankedGames(progress: Record<string, Progress>): RankInput[] {
  return rankInputs(GAMES.map((g) => g.id), progress);
}

/** The next game to auto-queue: first ranked game that is not the one just played. */
export function nextQueued(progress: Record<string, Progress>, justPlayedId: string): RankInput | undefined {
  return nextInQueue(rankedGames(progress), justPlayedId);
}

/** Popularity order (friends-on desc) — used to fill the shelf at onboarding. */
export function popularityOrder(excludeIds: string[] = []): string[] {
  const exclude = new Set(excludeIds);
  return GAMES.map((g) => g.id)
    .filter((id) => !exclude.has(id))
    .sort((a, b) => friendsOn(b) - friendsOn(a));
}
