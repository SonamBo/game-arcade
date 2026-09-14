/**
 * useRunLoop — the shared frame clock, ghost ticker and run lifecycle. One hook,
 * every game. Each game owns only its own mechanic; the loop owns time.
 *
 * Build brief §6: run the loop in a Reanimated worklet with useFrameCallback,
 * clamp dt to 48ms, and keep score in a shared value mirrored to React state
 * only when it changes. The ghost's displayed score is
 *   min(target, round(target * min(1, elapsed / 16s)))
 * so the rival's recorded run "replays" over roughly sixteen seconds regardless
 * of the game — the header ticker is what sells the race.
 */
import { useCallback } from 'react';
import {
  runOnJS,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { GHOST_TICK_SECONDS } from '@/types/models';

/** A per-frame worklet the game supplies to advance its own motion. */
export type FrameWorklet = (dtMs: number, elapsedMs: number) => void;

export interface RunLoop {
  /** Milliseconds of run time elapsed. Advances only while running. */
  elapsed: SharedValue<number>;
  /** The rival's displayed score, ticking toward ghostTarget over ~16s. */
  ghost: SharedValue<number>;
  /** The game's score. The game mutates this; the loop never does. */
  score: SharedValue<number>;
  running: SharedValue<boolean>;
  start: () => void;
  /** Ends the run. Idempotent — the first call wins. */
  end: () => void;
}

export function useRunLoop(opts: {
  ghostTarget?: number;
  /** Advances the game's own motion each frame. Must be a worklet. */
  onFrame?: FrameWorklet;
  /** Called on the JS thread when the displayed ghost integer changes. */
  onGhost?: (ghost: number) => void;
}): RunLoop {
  const { ghostTarget, onFrame, onGhost } = opts;

  const elapsed = useSharedValue(0);
  const ghost = useSharedValue(0);
  const score = useSharedValue(0);
  const running = useSharedValue(false);

  const tickSeconds = GHOST_TICK_SECONDS;

  const frame = useFrameCallback((info) => {
    'worklet';
    if (!running.value) return;

    // Clamp dt so a dropped frame (or a backgrounded app) can never teleport
    // the game a huge step forward.
    const dt = Math.min(48, info.timeSincePreviousFrame ?? 16);
    elapsed.value += dt;

    if (ghostTarget && ghostTarget > 0) {
      const fraction = Math.min(1, elapsed.value / 1000 / tickSeconds);
      const shown = Math.min(ghostTarget, Math.round(ghostTarget * fraction));
      if (shown !== ghost.value) {
        ghost.value = shown;
        if (onGhost) runOnJS(onGhost)(shown);
      }
    }

    if (onFrame) onFrame(dt, elapsed.value);
  }, false);

  const start = useCallback(() => {
    elapsed.value = 0;
    ghost.value = 0;
    score.value = 0;
    running.value = true;
    frame.setActive(true);
  }, [elapsed, ghost, score, running, frame]);

  const end = useCallback(() => {
    if (!running.value) return;
    running.value = false;
    frame.setActive(false);
  }, [running, frame]);

  return { elapsed, ghost, score, running, start, end };
}
