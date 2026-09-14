/**
 * STACK — the hero game. Bespoke: it ships its own component. Every other game
 * in this folder is config for an engine; STACK is the exception that proves the
 * contract works both ways.
 */
import { StackGame } from '../stack/StackGame';
import type { BespokeModule } from '../types';

export const stack: BespokeModule = {
  meta: {
    id: 'stack',
    name: 'STACK',
    code: 'STK',
    family: 'TAP',
    unit: 'blocks',
    lowerIsBetter: false,
    blurb: 'Tap to drop. Overhang gets sliced off. The tower narrows until it cannot.',
  },
  engine: 'bespoke',
  Component: StackGame,
};
