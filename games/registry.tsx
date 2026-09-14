/**
 * The registry resolves a game id to a renderable component and its metadata.
 * It is the seam between the catalogue (data) and the engines (behaviour):
 *   - a bespoke game renders its own component
 *   - an engine game renders the engine's component with its config applied
 * A game whose engine is not implemented yet resolves to undefined, and the
 * match screen shows a placeholder rather than crashing.
 */
import { CATALOGUE } from './catalogue';
import { ENGINES } from './engines';
import type { GameComponent, GameMeta, GameScreenProps } from './types';
import { isBespoke } from './types';

// Resolved components are memoised so a game's component identity is stable
// across renders (null = known-unplayable).
const resolved: Record<string, GameComponent | null> = {};

function resolve(id: string): GameComponent | undefined {
  if (id in resolved) return resolved[id] ?? undefined;

  const mod = CATALOGUE[id];
  if (!mod) {
    resolved[id] = null;
    return undefined;
  }

  if (isBespoke(mod)) {
    resolved[id] = mod.Component;
    return mod.Component;
  }

  const engine = ENGINES[mod.engine];
  if (!engine) {
    // Engine not built yet — game exists in the catalogue but is not playable.
    resolved[id] = null;
    return undefined;
  }

  const EngineComponent = engine.Component;
  const config = mod.config;
  const Wrapped: GameComponent = (props: GameScreenProps) => <EngineComponent {...props} config={config} />;
  Wrapped.displayName = `Engine(${mod.engine}:${id})`;
  resolved[id] = Wrapped;
  return Wrapped;
}

export function getGameComponent(id: string): GameComponent | undefined {
  return resolve(id);
}

export function getGameMeta(id: string): GameMeta | undefined {
  return CATALOGUE[id]?.meta;
}

export function isPlayableId(id: string): boolean {
  return resolve(id) != null;
}

export function playableIds(): string[] {
  return Object.keys(CATALOGUE).filter((id) => isPlayableId(id));
}

/**
 * Simulated runs exist so the retention loop can be tested end to end before
 * fifty games are written. They are compiled out of any build a real player
 * touches — eas.json sets this to "0" in production. A person must never be
 * shown a score they did not earn.
 */
export const SIMULATED_RUNS_ENABLED = process.env.EXPO_PUBLIC_SIMULATED_GAMES === '1';
