/**
 * The game registry. `npm run new-game` appends to this file — it is the one
 * place a game is wired in, and it is the reason adding a game cannot break a
 * screen.
 *
 * Stage 00 ships it empty on purpose: the shell must be provably independent
 * of whether any game exists yet.
 */
import type { GameComponent, GameModule } from './types';
import { StackGame } from './stack/StackGame';

const MODULES: Record<string, GameModule<unknown>> = {
  // stage 04: reflex, dodge (as configs against the engines)
  // stage 09+: everything else
};

/**
 * Games that render for real. STACK is here from stage 02; REFLEX and DODGE
 * join at stage 04 once the engines exist. The match screen looks a game up
 * here — if it is absent, the game is not yet playable.
 */
const COMPONENTS: Record<string, GameComponent> = {
  stack: StackGame,
};

export function getGameModule(id: string): GameModule<unknown> | undefined {
  return MODULES[id];
}

export function getGameComponent(id: string): GameComponent | undefined {
  return COMPONENTS[id];
}

export function isPlayableId(id: string): boolean {
  return id in COMPONENTS;
}

export function playableIds(): string[] {
  return Object.keys(COMPONENTS);
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
