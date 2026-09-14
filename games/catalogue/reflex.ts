/**
 * REFLEX — needle-band, pure config. No component, no engine change. This file
 * plus the engine is the entire game. (Build brief §6 tuning verbatim.)
 */
import { needleBandEngine } from '../engines/needleBand';
import type { NeedleBandCfg } from '../engines/needleBand';
import type { EngineModule } from '../types';

export const reflex: EngineModule<NeedleBandCfg> = {
  meta: {
    id: 'reflex',
    name: 'REFLEX',
    code: 'RFX',
    family: 'TIMING',
    unit: 'ms',
    lowerIsBetter: true,
    blurb: 'Tap the instant the needle crosses the band. The band shrinks every round.',
  },
  engine: 'needle-band',
  config: { ...needleBandEngine.defaults },
};
