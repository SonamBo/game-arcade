/**
 * The engine table. Three of the nine archetypes are implemented; the rest are
 * added in stage-09 game batches, when there are real games to validate them
 * against (PLAN.md hazard #1). A game whose engine is not yet here resolves to
 * "not playable" and shows the placeholder in the match screen — it never
 * crashes.
 */
import type { Engine, EngineId } from '../types';
import { laneRunnerEngine } from './laneRunner';
import { needleBandEngine } from './needleBand';
import { targetTapEngine } from './targetTap';

// The registry hands each engine its own config type; at this table boundary the
// configs are heterogeneous, so the value type is deliberately loose.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEngine = Engine<any>;

export const ENGINES: Partial<Record<EngineId, AnyEngine>> = {
  'needle-band': needleBandEngine,
  'lane-runner': laneRunnerEngine,
  'target-tap': targetTapEngine,
  // stage 09+: orbit-timing, grid-merge, number-pick, memory-recall, trace-path
};
