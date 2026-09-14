/**
 * THE GAME CONTRACT — FROZEN at stage 04.
 *
 * This is the file that decides whether game #50 costs what game #12 cost.
 * Do not widen it casually: everything downstream (the engines, the scaffold,
 * the catalogue, the match host) depends on these shapes staying still.
 *
 * The three rules the freeze protects:
 *   1. a game never imports the store, the feed, the wallet or a screen
 *   2. a game never decides what happens after the run ends — it reports its
 *      score and reports when it is over; the app assigns meaning
 *   3. adding a game touches exactly one file (games/catalogue/<id>.ts)
 *
 * The model is component-based. A game is rendered by a component that takes
 * GameScreenProps. Two kinds:
 *   - bespoke: the game ships its own component (STACK)
 *   - engine:  the game is a config handed to a shared engine component
 *              (REFLEX -> needle-band, DODGE -> lane-runner, ...)
 * Both satisfy the same GameScreenProps contract, so the match host does not
 * care which kind it is rendering.
 */
import type { ComponentType } from 'react';

import type { Family, Run } from '@/types/models';

/** The nine archetype engines. Their games are pure config. */
export type EngineId =
  | 'needle-band'
  | 'lane-runner'
  | 'target-tap'
  | 'orbit-timing'
  | 'grid-merge'
  | 'number-pick'
  | 'memory-recall'
  | 'trace-path';

export interface GameMeta {
  id: string;
  name: string;
  /** Three letters, e.g. 'STK'. */
  code: string;
  family: Family;
  unit: string;
  lowerIsBetter: boolean;
  /** One sentence: the rule, not a pitch. */
  blurb: string;
}

export type HapticWeight = 'light' | 'medium' | 'error' | 'success';

/**
 * What every game is handed. The host measures the field, resolves the ghost,
 * and receives the score and the end signal back. Nothing here can reach the
 * store, a screen, or navigation — that is the point.
 */
export interface GameScreenProps {
  /** Playfield size in dp, excluding chrome. Measured by the host. */
  width: number;
  height: number;
  /** The rival's final score for this run. Undefined on a cold first run. */
  ghostTarget?: number;
  /** True when the day's variant rules apply (e.g. STACK blackout). */
  variant?: boolean;
  /** A retry resumes at the score reached, not zero. Defaults to 0. */
  carriedScore?: number;
  /** Live score mirror for the match header. Fires only when the score changes. */
  onScore?: (score: number) => void;
  /** Live ghost mirror for the match header. Fires only when it changes. */
  onGhost?: (ghost: number) => void;
  /** The run has ended at this final score. The host builds the Run record. */
  onEnd: (score: number) => void;
}

export type GameComponent = ComponentType<GameScreenProps>;

/**
 * An engine renders a whole family of games from config. `Component` takes the
 * usual GameScreenProps plus the typed config for this run. `defaults` is what
 * `npm run new-game` copies into a new game's file as a starting point.
 */
export interface Engine<Cfg> {
  id: EngineId;
  defaults: Cfg;
  Component: ComponentType<GameScreenProps & { config: Cfg }>;
}

/** A game that ships its own component (STACK). */
export interface BespokeModule {
  meta: GameMeta;
  engine: 'bespoke';
  Component: GameComponent;
}

/** A game that is config for one of the archetype engines. */
export interface EngineModule<Cfg = unknown> {
  meta: GameMeta;
  engine: EngineId;
  config: Cfg;
}

/**
 * A game. `npm run new-game` writes one of these and nothing else — one file in
 * games/catalogue/, registered in games/catalogue/index.ts.
 */
export type GameModule = BespokeModule | EngineModule;

export function isBespoke(m: GameModule): m is BespokeModule {
  return m.engine === 'bespoke';
}

/** What a finished run needs from the game, before the app adds meaning. */
export type { Run };
