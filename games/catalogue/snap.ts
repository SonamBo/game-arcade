/**
 * SNAP — needle-band again, but faster and tighter. This file is the proof of
 * the whole architecture: a second, distinct game on the same engine, added by
 * changing numbers. No engine edit, no new component.
 */
import { needleBandEngine } from '../engines/needleBand';
import type { NeedleBandCfg } from '../engines/needleBand';
import type { EngineModule } from '../types';

export const snap: EngineModule<NeedleBandCfg> = {
  meta: {
    id: 'snap',
    name: 'SNAP',
    code: 'SNP',
    family: 'TAP',
    unit: 'ms',
    lowerIsBetter: true,
    blurb: 'A quicker needle and a meaner band. Snap it on the line.',
  },
  engine: 'needle-band',
  config: {
    ...needleBandEngine.defaults,
    speed0: 68,
    speedStep: 4.2,
    width0: 18,
    widthFloor: 6,
    maxRounds: 16,
  },
};
