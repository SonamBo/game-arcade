/**
 * DODGE — lane-runner, pure config. Button-first input (D-007). Build brief §6
 * tuning verbatim.
 */
import { laneRunnerEngine } from '../engines/laneRunner';
import type { LaneRunnerCfg } from '../engines/laneRunner';
import type { EngineModule } from '../types';

export const dodge: EngineModule<LaneRunnerCfg> = {
  meta: {
    id: 'dodge',
    name: 'DODGE',
    code: 'DDG',
    family: 'SWIPE',
    unit: 'm',
    lowerIsBetter: false,
    blurb: 'Three lanes, one of them is about to be wrong. Move before it is.',
  },
  engine: 'lane-runner',
  config: { ...laneRunnerEngine.defaults },
};
