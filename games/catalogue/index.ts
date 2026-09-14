/**
 * The catalogue manifest. Every playable game is registered here, one line
 * each. `npm run new-game` appends to this file and writes the sibling module —
 * nothing else in the app has to change for a new game to exist.
 *
 * Stage 05 grows this toward forty; today it holds the games with real engines.
 */
import type { GameModule } from '../types';
import { aim } from './aim';
import { dodge } from './dodge';
import { reflex } from './reflex';
import { snap } from './snap';
import { stack } from './stack';
import { glide } from './glide';

export const CATALOGUE: Record<string, GameModule> = {
  stack,
  reflex,
  dodge,
  snap,
  aim,
  glide,
};
