/**
 * Family → plate colour and family mark. A game leads with its plate (§2 rule
 * 01), and the plate is always a neutral from PLATE — no colour ever lands on a
 * plate (rule 02). The spec names four archetype plates; the catalogue groups
 * by five Families, so all five are mapped here.
 */
import { PLATE } from './tokens';
import type { Family } from '@/types/models';

export type FamilyMarkName = 'tap' | 'swipe' | 'timing' | 'numbers' | 'memory';

const PLATE_BY_FAMILY: Record<Family, string> = {
  TAP: PLATE.precision,
  SWIPE: PLATE.runner,
  TIMING: PLATE.timing,
  NUMBERS: PLATE.numbers,
  MEMORY: PLATE.memory,
};

const MARK_BY_FAMILY: Record<Family, FamilyMarkName> = {
  TAP: 'tap',
  SWIPE: 'swipe',
  TIMING: 'timing',
  NUMBERS: 'numbers',
  MEMORY: 'memory',
};

export function plateFor(family: Family): string {
  return PLATE_BY_FAMILY[family] ?? PLATE.precision;
}

export function markFor(family: Family): FamilyMarkName {
  return MARK_BY_FAMILY[family] ?? 'tap';
}
