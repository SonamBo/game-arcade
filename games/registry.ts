/**
 * The game registry. `npm run new-game` appends to this file — it is the one
 * place a game is wired in, and it is the reason adding a game cannot break a
 * screen.
 *
 * Stage 00 ships it empty on purpose: the shell must be provably independent
 * of whether any game exists yet.
 */
import type { GameModule } from './types';

const MODULES: Record<string, GameModule<unknown>> = {
  // stage 02: stack
  // stage 04: reflex, dodge
  // stage 09+: everything else
};

export function getGameModule(id: string): GameModule<unknown> | undefined {
  return MODULES[id];
}

export function playableIds(): string[] {
  return Object.keys(MODULES);
}

/**
 * Simulated runs exist so the retention loop can be tested end to end before
 * fifty games are written. They are compiled out of any build a real player
 * touches — see eas.json, where the production profile sets this to "0".
 *
 * A person must never be shown a score they did not earn.
 */
export const SIMULATED_RUNS_ENABLED =
  process.env.EXPO_PUBLIC_SIMULATED_GAMES === '1';
