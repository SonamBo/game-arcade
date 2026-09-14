/**
 * AIM — target-tap, pure config. A third engine, a fourth config game, proving
 * the pattern holds across engines, not just within one.
 */
import { targetTapEngine } from '../engines/targetTap';
import type { TargetTapCfg } from '../engines/targetTap';
import type { EngineModule } from '../types';

export const aim: EngineModule<TargetTapCfg> = {
  meta: {
    id: 'aim',
    name: 'AIM',
    code: 'AIM',
    family: 'TAP',
    unit: 'hits',
    lowerIsBetter: false,
    blurb: 'Squares appear and fade. Hit them before they go.',
  },
  engine: 'target-tap',
  config: { ...targetTapEngine.defaults },
};
