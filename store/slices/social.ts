import type { Rival } from '@/types/models';
import type { SliceCreator } from '../types';

/**
 * Everything social lives behind this interface, which is shaped like the
 * eventual network layer. Stage 06 fills it from data/seed.ts; swapping in a
 * real server later is a module replacement, not a rewrite.
 *
 * Two rules the implementation must keep:
 *   - never fabricate a friend or a head-to-head record
 *   - a cold-start rival is real and skill-matched, and is labelled GLOBAL RIVAL
 */
export interface SocialSlice {
  /** One rival per game the player has a ghost for. Persisted. */
  rivals: Record<string, Rival>;

  getRival: (gameId: string) => Rival | undefined;
  setRival: (gameId: string, rival: Rival) => void;
  /**
   * Cold start: creates one named global rival for a game, matched within
   * ±10% of the player's first score.
   */
  seedGlobalRival: (gameId: string, firstScore: number, handle: string) => void;
}

export const createSocialSlice: SliceCreator<SocialSlice> = (set, get) => ({
  rivals: {},

  getRival: (gameId) => get().rivals[gameId],

  setRival: (gameId, rival) =>
    set((s) => ({ rivals: { ...s.rivals, [gameId]: rival } })),

  seedGlobalRival: (gameId, firstScore, handle) =>
    set((s) => {
      if (s.rivals[gameId]) return {};
      // Deterministic, not random, so screenshots are reproducible.
      const offset = Math.round(firstScore * 0.1);
      return {
        rivals: {
          ...s.rivals,
          [gameId]: {
            handle,
            score: Math.max(1, firstScore + offset),
            recordedAt: Date.now(),
            isGlobal: true,
          },
        },
      };
    }),
});
