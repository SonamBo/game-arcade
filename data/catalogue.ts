/**
 * The catalogue — all forty games as metadata (build brief §3: data/catalogue.ts).
 *
 * Playable games source their meta from their engine/bespoke module, so there
 * is one source of truth per game and no drift between what the shelf shows and
 * what the match screen scores. The rest are defined inline here until their
 * engines land (stage-09 batches) — at which point adding the module is enough,
 * and `metaFor` prefers it automatically.
 *
 * "Volume is the pitch": this file is where the forty becomes visible.
 */
import { CATALOGUE as MODULES } from '@/games/catalogue';
import type { GameMeta } from '@/games/types';

/** The canonical shelf/browse order. */
export const ORDER: string[] = [
  'stack', 'reflex', 'dodge', 'count', 'merge', 'aim', 'hold', 'lanes', 'flip', 'orbit',
  'spin', 'snap', 'tilt', 'rush', 'chain', 'split', 'echo', 'pulse', 'drift', 'sort',
  'grid', 'loop', 'jump', 'swap', 'block', 'trace', 'pivot', 'dash', 'match', 'taps',
  'glide', 'shift', 'catch', 'wave', 'zip', 'climb', 'path', 'slice', 'bounce', 'fuse',
];

/** Games without a playable module yet. Higher-is-better unless noted. */
const UNBUILT: GameMeta[] = [
  { id: 'count', name: 'COUNT', code: 'CNT', family: 'NUMBERS', unit: 'right', lowerIsBetter: false, blurb: 'Count the flashing tiles and commit before they fade.' },
  { id: 'merge', name: 'MERGE', code: 'MRG', family: 'NUMBERS', unit: 'score', lowerIsBetter: false, blurb: "Slide equal tiles together to double them. Don't fill the board." },
  { id: 'hold', name: 'HOLD', code: 'HLD', family: 'TIMING', unit: 'perfect', lowerIsBetter: false, blurb: "Hold from the mark, release on the beat. Miss and it's over." },
  { id: 'lanes', name: 'LANES', code: 'LNS', family: 'SWIPE', unit: 'm', lowerIsBetter: false, blurb: 'Four lanes, one gap. Line up before the wall arrives.' },
  { id: 'flip', name: 'FLIP', code: 'FLP', family: 'MEMORY', unit: 'pairs', lowerIsBetter: false, blurb: 'Flip two tiles, remember the pairs, clear the board.' },
  { id: 'orbit', name: 'ORBIT', code: 'ORB', family: 'TIMING', unit: 'laps', lowerIsBetter: false, blurb: 'Tap to switch orbit. Thread the moving gaps.' },
  { id: 'spin', name: 'SPIN', code: 'SPN', family: 'SWIPE', unit: 'score', lowerIsBetter: false, blurb: 'Spin the ring so the ball passes the notch, not the spike.' },
  { id: 'tilt', name: 'TILT', code: 'TLT', family: 'SWIPE', unit: 'm', lowerIsBetter: false, blurb: 'Tilt to roll. Stay on the ledge as it narrows.' },
  { id: 'rush', name: 'RUSH', code: 'RSH', family: 'TAP', unit: 'taps', lowerIsBetter: false, blurb: 'Tap as fast as you can while the meter drains.' },
  { id: 'chain', name: 'CHAIN', code: 'CHN', family: 'MEMORY', unit: 'links', lowerIsBetter: false, blurb: 'Repeat the growing chain of taps in order.' },
  { id: 'split', name: 'SPLIT', code: 'SPL', family: 'NUMBERS', unit: 'score', lowerIsBetter: false, blurb: 'Split the number into the two targets. No remainder.' },
  { id: 'echo', name: 'ECHO', code: 'ECH', family: 'MEMORY', unit: 'steps', lowerIsBetter: false, blurb: 'Watch the flashes, then echo them back in sequence.' },
  { id: 'pulse', name: 'PULSE', code: 'PLS', family: 'TIMING', unit: 'beats', lowerIsBetter: false, blurb: 'Tap on every pulse. The tempo climbs.' },
  { id: 'drift', name: 'DRIFT', code: 'DRF', family: 'SWIPE', unit: 'm', lowerIsBetter: false, blurb: 'Drift through the chicanes without clipping a wall.' },
  { id: 'sort', name: 'SORT', code: 'SRT', family: 'NUMBERS', unit: 'sorted', lowerIsBetter: false, blurb: 'Send each number to its bin before the belt fills.' },
  { id: 'grid', name: 'GRID', code: 'GRD', family: 'MEMORY', unit: 'cells', lowerIsBetter: false, blurb: 'Memorise the lit cells, then tap them on a blank grid.' },
  { id: 'loop', name: 'LOOP', code: 'LOP', family: 'TIMING', unit: 'loops', lowerIsBetter: false, blurb: 'Close the loop at the marker. The circle keeps shrinking.' },
  { id: 'jump', name: 'JUMP', code: 'JMP', family: 'TAP', unit: 'gaps', lowerIsBetter: false, blurb: 'Tap to jump the gaps. Miss one and you fall.' },
  { id: 'swap', name: 'SWAP', code: 'SWP', family: 'NUMBERS', unit: 'moves', lowerIsBetter: true, blurb: 'Swap adjacent tiles to sort the row in the fewest moves.' },
  { id: 'block', name: 'BLOCK', code: 'BLK', family: 'SWIPE', unit: 'score', lowerIsBetter: false, blurb: 'Slide the block through the gap before the gap closes.' },
  { id: 'trace', name: 'TRACE', code: 'TRC', family: 'SWIPE', unit: 'shapes', lowerIsBetter: false, blurb: 'Trace the shape in one stroke without lifting off.' },
  { id: 'pivot', name: 'PIVOT', code: 'PVT', family: 'TIMING', unit: 'turns', lowerIsBetter: false, blurb: 'Pivot at the pin. Land the swing on the next pin.' },
  { id: 'dash', name: 'DASH', code: 'DSH', family: 'TAP', unit: 'm', lowerIsBetter: false, blurb: 'Dash between cover as the gaps sweep past.' },
  { id: 'match', name: 'MATCH', code: 'MTC', family: 'MEMORY', unit: 'pairs', lowerIsBetter: false, blurb: 'Match the pairs before the timer runs out.' },
  { id: 'taps', name: 'TAPS', code: 'TPS', family: 'TAP', unit: 'taps', lowerIsBetter: false, blurb: 'Tap only the marked tiles. One wrong tap ends it.' },
  { id: 'shift', name: 'SHIFT', code: 'SHF', family: 'NUMBERS', unit: 'score', lowerIsBetter: false, blurb: 'Shift the row so the numbers read in order.' },
  { id: 'catch', name: 'CATCH', code: 'CAT', family: 'TAP', unit: 'caught', lowerIsBetter: false, blurb: 'Catch what falls in the right column. Drop nothing.' },
  { id: 'wave', name: 'WAVE', code: 'WAV', family: 'TIMING', unit: 'waves', lowerIsBetter: false, blurb: 'Ride the crest. Tap at the top, never the trough.' },
  { id: 'zip', name: 'ZIP', code: 'ZIP', family: 'SWIPE', unit: 'm', lowerIsBetter: false, blurb: 'Zip through the closing gates on the right line.' },
  { id: 'climb', name: 'CLIMB', code: 'CLM', family: 'TAP', unit: 'floors', lowerIsBetter: false, blurb: 'Tap left and right to climb without missing a hold.' },
  { id: 'path', name: 'PATH', code: 'PTH', family: 'MEMORY', unit: 'steps', lowerIsBetter: false, blurb: 'Watch the path light up, then walk it from memory.' },
  { id: 'slice', name: 'SLICE', code: 'SLC', family: 'SWIPE', unit: 'cuts', lowerIsBetter: false, blurb: 'Slice through the targets, skip the bombs.' },
  { id: 'bounce', name: 'BOUNCE', code: 'BNC', family: 'TIMING', unit: 'bounces', lowerIsBetter: false, blurb: 'Time the bounce so it clears each rising bar.' },
  { id: 'fuse', name: 'FUSE', code: 'FSE', family: 'NUMBERS', unit: 'score', lowerIsBetter: false, blurb: 'Fuse matching numbers before the fuse burns down.' },
];

const UNBUILT_MAP: Record<string, GameMeta> = Object.fromEntries(UNBUILT.map((g) => [g.id, g]));

/** Metadata for any game id — the module's if it is playable, else the inline entry. */
export function metaFor(id: string): GameMeta | undefined {
  return MODULES[id]?.meta ?? UNBUILT_MAP[id];
}

/** All forty, in shelf order. */
export const GAMES: GameMeta[] = ORDER.map(metaFor).filter((m): m is GameMeta => m != null);

export const GAME_COUNT = GAMES.length;

export const FAMILIES = ['ALL', 'TAP', 'SWIPE', 'TIMING', 'NUMBERS', 'MEMORY'] as const;
