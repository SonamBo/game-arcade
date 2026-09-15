import { globalRivalFor } from '@/data/seed';
import type { FeedRaw } from '@/data/social';
import type { Rival, Run } from '@/types/models';
import type { SliceCreator } from '../types';

/**
 * The write side of the social layer. Reads (feed / duels / inbox / profile view
 * models) live in data/social.ts; the seeded graph lives in data/friends.ts.
 * Together they are shaped like the eventual network layer — swapping in a real
 * server replaces these, it does not touch the screens.
 *
 * Two rules the implementation keeps:
 *   - never fabricate a friend or a head-to-head record
 *   - a cold-start rival is real and skill-matched, labelled GLOBAL RIVAL
 */

/** A rival's callout reply lands a short while after you take their ghost, so
 * the loop closes while the player is still in the app (build brief §7). Tuned
 * short for a hypercasual session. */
export const REPLY_DELAY_MS = 90 * 1000;

const POST_CAP = 40;

export interface SocialSlice {
  /** One rival per game the player has a ghost for. Persisted. */
  rivals: Record<string, Rival>;
  /** The player's own runs as feed posts. Transient (this session). */
  runPosts: FeedRaw[];
  /** Rival callout replies that have surfaced. Transient. */
  replies: FeedRaw[];

  getRival: (gameId: string) => Rival | undefined;
  setRival: (gameId: string, rival: Rival) => void;
  seedGlobalRival: (gameId: string, firstScore: number, handle: string) => void;

  /**
   * Every finished run generates a post; if it beat the rival's ghost, that
   * rival's "called you out" reply is scheduled to surface a couple of minutes
   * later. Called by commitRun.
   */
  onRunCommitted: (run: Run) => void;
}

export const createSocialSlice: SliceCreator<SocialSlice> = (set, get) => ({
  rivals: {},
  runPosts: [],
  replies: [],

  getRival: (gameId) => get().rivals[gameId],

  setRival: (gameId, rival) => set((s) => ({ rivals: { ...s.rivals, [gameId]: rival } })),

  seedGlobalRival: (gameId, firstScore, handle) =>
    set((s) => {
      if (s.rivals[gameId]) return {};
      const offset = Math.round(firstScore * 0.1);
      return {
        rivals: {
          ...s.rivals,
          [gameId]: { handle, score: Math.max(1, firstScore + offset), recordedAt: Date.now(), isGlobal: true },
        },
      };
    }),

  onRunCommitted: (run) => {
    // The player's own post — derived, never authored.
    const post: FeedRaw = {
      who: 'YOU',
      kind: run.improved ? 'personal-best' : 'ran',
      gameId: run.gameId,
      figure: run.score,
      createdAt: run.endedAt,
    };
    set((s) => ({ runPosts: [post, ...s.runPosts].slice(0, POST_CAP) }));

    // Beat the rival's ghost → they call you out, on a delay.
    if (run.beatGhost) {
      const rival = globalRivalFor(run.gameId);
      setTimeout(() => {
        const reply: FeedRaw = {
          who: rival.handle,
          kind: 'called-out',
          gameId: run.gameId,
          figure: rival.score,
          createdAt: Date.now(),
          involvesYou: true,
          comment: `You took my ghost. Not for long.`,
        };
        set((s) => ({ replies: [reply, ...s.replies].slice(0, POST_CAP) }));
      }, REPLY_DELAY_MS);
    }
  },
});
