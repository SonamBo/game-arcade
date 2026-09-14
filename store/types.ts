import type { StateCreator } from 'zustand';
import type { EconomySlice } from './slices/economy';
import type { GamesSlice } from './slices/games';
import type { SessionSlice } from './slices/session';
import type { SocialSlice } from './slices/social';

export type Store = GamesSlice & EconomySlice & SocialSlice & SessionSlice;

/** Every slice creator is typed against the whole store, under persist. */
export type SliceCreator<T> = StateCreator<
  Store,
  [['zustand/persist', unknown]],
  [],
  T
>;

/** Local-midnight timestamp for the day containing `now`. */
export function startOfLocalDay(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Next local midnight after `now`. Free retries reset here. */
export function nextLocalMidnight(now: number): number {
  return startOfLocalDay(now) + 24 * 60 * 60 * 1000;
}

/** Stable YYYY-MM-DD key in local time, for streak comparisons. */
export function localDayKey(now: number): string {
  const d = new Date(now);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
