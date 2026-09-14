/**
 * Instrumentation (UI spec §10). The thesis is a DAU/MAU thesis, so the UI has
 * to be measurable at the seams where it claims to earn stickiness. These are
 * the seven events the spec names, with the properties it lists.
 *
 * The two numbers that decide whether the product works fall out of these:
 *   - distinct games per session   (does volume actually get consumed?)
 *   - queue acceptance rate        (queue_accepted / queue_shown)
 *
 * The destination is still open (question 7 — PostHog / Amplitude / own
 * endpoint). Until it is decided, events buffer in memory and, in dev, print to
 * the console. Swapping in a real sink is a one-function change: replace `sink`.
 */
import type { RunSource } from '@/types/models';

export type AnalyticsEvent =
  | { name: 'run_started'; game: string; source: RunSource; carried_score: number; variant: boolean }
  | { name: 'run_ended'; game: string; score: number; improved: boolean; beat_ghost: boolean; coins: number; duration: number }
  | { name: 'queue_shown'; next_game: string; reason_type: ReasonType; seconds_elapsed: number }
  | { name: 'queue_accepted'; next_game: string; reason_type: ReasonType; seconds_elapsed: number }
  | { name: 'queue_cancelled'; next_game: string; reason_type: ReasonType; seconds_elapsed: number }
  | { name: 'retry_taken'; free: boolean; delta_to_best: number; coins_spent: number }
  | { name: 'pin_changed'; game: string; pinned: boolean; refused: boolean }
  | { name: 'social_action'; type: 'react' | 'comment' | 'challenge' | 'race_from_feed'; target_game: string }
  | { name: 'session'; runs: number; distinct_games: number; ended_by: 'queue_cancel' | 'app_background' | 'navigation' };

export type ReasonType = 'rival-ahead' | 'never-played' | 'quest';

/** Every event carries when it happened. */
export type LoggedEvent = AnalyticsEvent & { at: number };

const buffer: LoggedEvent[] = [];

/**
 * The one place to change when a destination is chosen. Today: dev console plus
 * an in-memory buffer that a debug screen can read.
 */
function sink(event: LoggedEvent): void {
  buffer.push(event);
  if (__DEV__) {
    const { name, at, ...rest } = event;
    // eslint-disable-next-line no-console
    console.log(`▸ ${name}`, rest);
  }
}

export function track(event: AnalyticsEvent): void {
  sink({ ...event, at: Date.now() });
}

/** Recent events, newest last. For a future in-app debug view. */
export function recentEvents(limit = 100): LoggedEvent[] {
  return buffer.slice(-limit);
}

/** Reason line kind for the queue, derived from a game's rank state. */
export function reasonType(rivalAhead: boolean, neverPlayed: boolean): ReasonType {
  return rivalAhead ? 'rival-ahead' : neverPlayed ? 'never-played' : 'quest';
}
