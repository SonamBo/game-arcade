/**
 * The daily variant (build brief §7: "Daily reset at local midnight … variant
 * rotated"). A deterministic rule laid over a real game, rotating once a day and
 * worth double coins. Only playable games can be the variant, so it is always
 * runnable. Playing it sets Run.variant = true, which doubles the coin award
 * (coinsFor) and, for STACK, turns on the blackout field.
 */
import { GAMES } from './catalogue';
import { isPlayableId } from '@/games/registry';
import { localDayKey, startOfLocalDay } from '@/store/types';

export interface DailyVariant {
  gameId: string;
  name: string;
  rule: string;
  /** Whole days since the epoch — the rotation index and the "DAY n" label. */
  day: number;
}

interface VariantDef {
  gameId: string;
  name: string;
  rule: string;
}

// Each entry targets a playable game so the variant is always runnable. As more
// engines land, more variants can join the rotation.
const VARIANTS: VariantDef[] = [
  { gameId: 'stack', name: 'STACK BLACKOUT', rule: 'Lights cut out every third block. 2× coins while it lasts.' },
  { gameId: 'dodge', name: 'DODGE RUSH', rule: 'Everything falls faster from the first metre. 2× coins.' },
  { gameId: 'reflex', name: 'REFLEX SUDDEN DEATH', rule: 'The band is meaner and one miss ends it. 2× coins.' },
  { gameId: 'snap', name: 'SNAP DOUBLE', rule: 'Two bands, both count. 2× coins.' },
  { gameId: 'glide', name: 'GLIDE NARROW', rule: 'Lanes tighten as you go. 2× coins.' },
  { gameId: 'aim', name: 'AIM BLITZ', rule: 'Targets vanish twice as fast. 2× coins.' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** The variant for the local day containing `now`. */
export function todaysVariant(now: number = Date.now()): DailyVariant {
  const day = Math.floor(startOfLocalDay(now) / DAY_MS);
  // Skip any variant whose game is not currently playable.
  const runnable = VARIANTS.filter((v) => isPlayableId(v.gameId));
  const pick = runnable[day % runnable.length] ?? runnable[0];
  return { ...pick, day };
}

/** ms until the variant rotates (local midnight). */
export function msUntilRotation(now: number = Date.now()): number {
  return startOfLocalDay(now) + DAY_MS - now;
}

/** "4h 12m" style countdown to the next rotation. */
export function rotationCountdown(now: number = Date.now()): string {
  const ms = msUntilRotation(now);
  const h = Math.floor(ms / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${h}h ${m}m`;
}

/** How many friends "played" today's variant — deterministic, for the poster. */
export function variantFriendsPlayed(now: number = Date.now()): number {
  return 5 + (Math.floor(startOfLocalDay(now) / DAY_MS) % 12);
}

/** Today's day-key, exposed so callers can key quest/streak resets to it. */
export function todayKey(now: number = Date.now()): string {
  return localDayKey(now);
}

export const TOTAL_GAMES = GAMES.length;
