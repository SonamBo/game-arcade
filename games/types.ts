/**
 * THE GAME CONTRACT — draft. Freezes at stage 04.
 *
 * This is the file that decides whether game #50 costs what game #12 cost.
 * Everything a game is allowed to know about the app is in RunContext; every
 * game either names an engine and hands it numbers, or is bespoke and
 * implements GameInstance itself.
 *
 * Rules that must survive the freeze:
 *   - a game never imports the store, the feed, the wallet or a screen
 *   - a game never decides what happens after the run ends
 *   - adding a game touches exactly one file
 */
import type { ComponentType } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { Family, Run } from '@/types/models';

/** The nine archetype engines. Stage 04 implements these. */
export type EngineId =
  | 'stacker'
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

export type InputEvent =
  | { type: 'tap'; x: number; y: number }
  | { type: 'press'; action: 'left' | 'right' }
  | { type: 'release'; action: 'left' | 'right' }
  | { type: 'swipe'; dx: number; dy: number }
  | { type: 'drag'; x: number; y: number; phase: 'start' | 'move' | 'end' };

export type HapticWeight = 'light' | 'medium' | 'error' | 'success';

/**
 * What the engine may do to the world. Deliberately small: a game reports
 * what happened and the app decides what that means.
 */
export interface RunContext {
  /** Playfield size in dp, excluding chrome. */
  readonly width: number;
  readonly height: number;
  /** The rival's score for this run, already resolved. May be undefined. */
  readonly ghostTarget?: number;
  /** True when the day's variant rules apply. */
  readonly variant: boolean;
  /** Light on placement or hit, medium on perfect, error on miss, success on PB. */
  haptic: (weight: HapticWeight) => void;
  /** Ends the run. Idempotent — the first call wins. */
  end: () => void;
}

/**
 * A live game. `onFrame` runs in a Reanimated worklet on the UI thread with
 * dt already clamped to 48ms, so it must not touch React state directly —
 * score is a shared value, mirrored to React only when it changes.
 */
export interface GameInstance {
  onFrame: (dt: number) => void;
  onInput: (e: InputEvent) => void;
  /** Mutated on the UI thread, mirrored to React only when it changes. */
  score: SharedValue<number>;
  isOver: () => boolean;
  /** Optional teardown for engines that allocate. */
  dispose?: () => void;
}

/**
 * How a game is rendered on screen. STACK (stage 02) is a bespoke component
 * built directly on `useRunLoop`; the archetype engines (stage 04) will be
 * wrapped in one shared host that renders GameInstance. Either way the game
 * reports its score and reports when the run ends — it never navigates, never
 * touches the store, and never decides what the score means.
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

/** What a finished run needs from the game, before the app adds meaning. */
export type { Run };

export interface Engine<Cfg> {
  id: EngineId;
  defaults: Cfg;
  create: (cfg: Cfg, ctx: RunContext) => GameInstance;
}

/**
 * A game. Archetype games stop at `config`; only a bespoke game implements
 * `create`. `npm run new-game` writes one of these and nothing else.
 */
export type GameModule<Cfg = unknown> =
  | {
      meta: GameMeta;
      engine: EngineId;
      config: Cfg;
      create?: never;
    }
  | {
      meta: GameMeta;
      engine: 'bespoke';
      config?: never;
      create: (ctx: RunContext) => GameInstance;
    };

/** True when a real engine backs this game. Drives Game.playable. */
export function isPlayable(m: GameModule<unknown> | undefined): boolean {
  return m != null;
}
