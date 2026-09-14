/**
 * SAMPLE DATA — stage 01 only.
 *
 * The real catalogue (data/catalogue.ts, stage 05) and the seeded social layer
 * (data/seed.ts, stage 06) do not exist yet. These few hand-written rows exist
 * so the eleven components and the fourteen screens have something faithful to
 * render while the shell is built. Copy matches the UI spec's voice exactly.
 *
 * Everything here is illustrative placeholder data, not the player's own
 * figures. Delete or supersede at stage 05.
 */
import type { Family } from '@/types/models';

export interface SampleGame {
  id: string;
  name: string;
  code: string;
  family: Family;
  unit: string;
  best: number | null;
  runs: number;
  friendsOn: number;
  rival?: { handle: string; by: number };
  neverPlayed?: boolean;
  pinned?: boolean;
}

/** A handful of games spanning every rank state and both score directions. */
export const SAMPLE_GAMES: SampleGame[] = [
  { id: 'stack', name: 'STACK', code: 'STK', family: 'TAP', unit: 'blocks', best: 47, runs: 26, friendsOn: 9, rival: { handle: 'RAVI', by: 3 }, pinned: true },
  { id: 'reflex', name: 'REFLEX', code: 'RFX', family: 'TIMING', unit: 'ms', best: 184, runs: 12, friendsOn: 6, rival: { handle: 'IRA', by: 8 }, pinned: true },
  { id: 'dodge', name: 'DODGE', code: 'DDG', family: 'SWIPE', unit: 'm', best: 2910, runs: 18, friendsOn: 11, pinned: true },
  { id: 'count', name: 'COUNT', code: 'CNT', family: 'NUMBERS', unit: 'right', best: null, runs: 0, friendsOn: 9, neverPlayed: true },
  { id: 'flip', name: 'FLIP', code: 'FLP', family: 'MEMORY', unit: 'pairs', best: null, runs: 0, friendsOn: 4, neverPlayed: true },
  { id: 'orbit', name: 'ORBIT', code: 'ORB', family: 'TIMING', unit: 'laps', best: null, runs: 0, friendsOn: 2, neverPlayed: true },
  { id: 'merge', name: 'MERGE', code: 'MRG', family: 'NUMBERS', unit: 'score', best: 512, runs: 7, friendsOn: 3, pinned: true },
  { id: 'snap', name: 'SNAP', code: 'SNP', family: 'TAP', unit: 'ms', best: 212, runs: 5, friendsOn: 1, pinned: true },
];

export interface SampleFriend {
  handle: string;
  score: number;
  self?: boolean;
  global?: boolean;
}

/** A leaderboard slice: the player's own row is tinted, friends and one global. */
export const SAMPLE_LEADERBOARD: SampleFriend[] = [
  { handle: 'MEHA', score: 63 },
  { handle: 'RAVI', score: 50 },
  { handle: 'YOU', score: 47, self: true },
  { handle: 'ARJUN', score: 41 },
  { handle: 'KOJI', score: 88, global: true },
];

export interface SampleDuel {
  handle: string;
  code: string;
  stake: string;
  soon: boolean;
}

export const SAMPLE_DUELS: SampleDuel[] = [
  { handle: 'RAVI', code: 'STACK', stake: '50 blocks — 3 clear of your best', soon: true },
  { handle: 'IRA', code: 'REFLEX', stake: '176ms — you were 8 off', soon: false },
  { handle: 'ZAID', code: 'DODGE', stake: '3,140m — a lane ahead', soon: false },
];

export interface SampleFeedItem {
  who: string;
  kicker: string;
  time: string;
  headline: string;
  figure: number;
  unit: string;
  reactions: number;
  comments: number;
  verb: string;
  involvesYou?: boolean;
  global?: boolean;
  comment?: string;
}

export const SAMPLE_FEED: SampleFeedItem[] = [
  { who: 'RAVI', kicker: 'PERSONAL BEST', time: '2m', headline: 'STACK · 50 blocks', figure: 50, unit: 'blocks', reactions: 12, comments: 3, verb: 'BEAT IT', involvesYou: true, comment: 'left you 3 behind, catch up' },
  { who: 'MEHA', kicker: 'WON A DUEL', time: '18m', headline: 'Took DODGE off ZAID', figure: 3180, unit: 'm', reactions: 8, comments: 1, verb: 'RACE MEHA' },
  { who: 'WORLD RECORD', kicker: 'GLOBAL MOMENT', time: '1h', headline: 'ORBIT · 40 laps', figure: 40, unit: 'laps', reactions: 204, comments: 55, verb: 'TRY ORBIT', global: true },
];

export interface SampleNotification {
  kind: 'CHALLENGE' | 'CUP' | 'QUEST DONE' | 'SQUAD' | 'FRIEND REQUEST' | 'DROP';
  text: string;
  time: string;
  verb: string;
  actionable: boolean;
}

export const SAMPLE_INBOX: SampleNotification[] = [
  { kind: 'CHALLENGE', text: 'RAVI called you out on STACK', time: '2m', verb: 'RACE', actionable: true },
  { kind: 'CUP', text: "Saturday Cup — you're in the last eight", time: '1h', verb: 'PLAY', actionable: true },
  { kind: 'QUEST DONE', text: 'Cleared all five dailies', time: '3h', verb: 'CLAIM', actionable: true },
  { kind: 'FRIEND REQUEST', text: 'NEHA wants to follow you', time: '5h', verb: 'ACCEPT', actionable: true },
  { kind: 'DROP', text: "Today's variant is BLACKOUT on STACK", time: '8h', verb: 'OPEN', actionable: false },
];

/** The daily drop poster. */
export const SAMPLE_DROP = {
  kicker: "TODAY'S VARIANT",
  name: 'STACK BLACKOUT',
  rule: 'Lights cut out every third block. 2× coins while it lasts.',
  countdown: '4h 12m',
  friendsPlayed: 8,
  topLine: 'Top: MEHA 31',
};

/** The weekly new-game poster (the other poster-band state). */
export const SAMPLE_NEW_GAME = {
  kicker: 'NEW THURSDAY',
  name: 'PULSE',
  rule: 'Tap on the beat. The beat speeds up. It stays on the shelf for good.',
  countdown: 'LIVE NOW',
  friendsPlayed: 0,
  topLine: 'Be the first',
};
