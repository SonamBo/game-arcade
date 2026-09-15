/**
 * The read side of the social layer — view models for the feed, duels, inbox
 * and friend profiles, built from the seeded graph (data/friends.ts), the
 * cold-start rivals (data/seed.ts) and the player's own state (passed in). No
 * screen talks to the seed directly; they call these, so a real server later
 * replaces this file and the screens do not change.
 *
 * The feed is derived, not authored: it interleaves the player's runs and any
 * rival callout replies with deterministic seeded friend activity, by timestamp.
 */
import { metaFor } from './catalogue';
import {
  FRIENDS,
  FRIEND_COUNT,
  friendBest,
  globalActivity,
  headToHead,
  mutuals,
  presence,
  seededActivity,
} from './friends';
import { globalRivalFor, hash } from './seed';
import type { Progress } from '@/types/models';

export type FeedKind = 'personal-best' | 'won-duel' | 'streak' | 'tried' | 'called-out' | 'ran';

/** The stored shape of a feed post — minimal and timestamped; display strings
 * are derived at read time so "2m ago" stays fresh. Shared with the store. */
export interface FeedRaw {
  who: string;
  kind: FeedKind;
  gameId: string;
  figure: number;
  createdAt: number;
  involvesYou?: boolean;
  global?: boolean;
  comment?: string;
}

/** FeedPost component props. */
export interface FeedView {
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
  targetGame: string;
}

const MIN = 60 * 1000;

function relativeTime(ts: number, now: number): string {
  const m = Math.max(0, Math.round((now - ts) / MIN));
  if (m < 60) return `${m}m`;
  if (m < 60 * 24) return `${Math.round(m / 60)}h`;
  return `${Math.round(m / (60 * 24))}d`;
}

function kickerFor(kind: FeedKind): string {
  switch (kind) {
    case 'personal-best': return 'PERSONAL BEST';
    case 'won-duel': return 'WON A DUEL';
    case 'streak': return 'ON A STREAK';
    case 'called-out': return 'CALLED YOU OUT';
    case 'ran': return 'YOUR RUN';
    default: return 'TRIED';
  }
}

function verbFor(kind: FeedKind, who: string, name: string): string {
  if (kind === 'called-out' || kind === 'won-duel') return `RACE ${who}`;
  if (kind === 'ran') return 'RUN AGAIN';
  return `TRY ${name}`;
}

function toView(raw: FeedRaw, now: number): FeedView {
  const meta = metaFor(raw.gameId);
  const name = meta?.name ?? raw.gameId.toUpperCase();
  const unit = meta?.unit ?? '';
  const h = hash(raw.who + raw.gameId);
  const headline =
    raw.kind === 'called-out' ? `${raw.who} wants ${name} back` : `${name} · ${raw.figure.toLocaleString()} ${unit}`;
  return {
    who: raw.who,
    kicker: kickerFor(raw.kind),
    time: relativeTime(raw.createdAt, now),
    headline,
    figure: raw.figure,
    unit,
    reactions: 4 + (h % 60),
    comments: h % 12,
    verb: verbFor(raw.kind, raw.who, name),
    involvesYou: raw.involvesYou,
    global: raw.global,
    comment: raw.comment,
    targetGame: raw.gameId,
  };
}

/** The feed for a tab: derived player posts + replies + seeded friend activity. */
export function buildFeed(tab: 'FRIENDS' | 'GLOBAL', runPosts: FeedRaw[], replies: FeedRaw[]): FeedView[] {
  const now = Date.now();
  let raw: FeedRaw[];
  if (tab === 'GLOBAL') {
    raw = globalActivity().map((a) => ({
      who: a.handle,
      kind: 'personal-best' as FeedKind,
      gameId: a.gameId,
      figure: friendBest(a.handle, a.gameId),
      createdAt: now - a.minutesAgo * MIN,
      global: true,
    }));
  } else {
    raw = [
      ...runPosts,
      ...replies,
      ...seededActivity().map((a) => ({
        who: a.handle,
        kind: a.kind as FeedKind,
        gameId: a.gameId,
        figure: friendBest(a.handle, a.gameId),
        createdAt: now - a.minutesAgo * MIN,
      })),
    ];
  }
  return raw.sort((a, b) => b.createdAt - a.createdAt).map((r) => toView(r, now));
}

export const feedPopulation = {
  friends: `${FRIEND_COUNT} friends`,
  global: '2.1M playing',
};

/* ------------------------------------------------------------------ *
 * Duels — real ghost scores from friends' bests.
 * ------------------------------------------------------------------ */

export interface DuelView {
  handle: string;
  name: string;
  gameId: string;
  stake: string;
  soon: boolean;
}

const DUEL_GAMES = ['stack', 'reflex', 'dodge', 'snap', 'glide', 'aim'];

export function buildDuels(progress: Record<string, Progress>): DuelView[] {
  return DUEL_GAMES.map((gameId) => {
    const meta = metaFor(gameId)!;
    const friend = FRIENDS[hash(gameId + 'duel') % FRIENDS.length];
    const stakeScore = friendBest(friend.handle, gameId);
    const best = progress[gameId]?.best ?? 0;
    const played = (progress[gameId]?.runs ?? 0) > 0;
    const diff = Math.abs(stakeScore - best);
    const stake = played
      ? `${stakeScore.toLocaleString()} ${meta.unit} — you were ${diff} off`
      : `${stakeScore.toLocaleString()} ${meta.unit} — never raced`;
    return { handle: friend.handle, name: meta.name, gameId, stake, soon: hash(friend.handle + gameId) % 3 === 0 };
  });
}

/* ------------------------------------------------------------------ *
 * Inbox — actionable items launch runs directly.
 * ------------------------------------------------------------------ */

export interface InboxView {
  kind: 'CHALLENGE' | 'CUP' | 'QUEST DONE' | 'SQUAD' | 'FRIEND REQUEST' | 'DROP';
  message: string;
  time: string;
  verb: string;
  actionable: boolean;
  target: string; // route or game id
}

export function buildInbox(replies: FeedRaw[]): InboxView[] {
  const now = Date.now();
  const items: InboxView[] = [];

  // Fresh callouts first — each launches the run directly.
  for (const r of replies.slice(0, 3)) {
    const name = metaFor(r.gameId)?.name ?? r.gameId.toUpperCase();
    items.push({ kind: 'CHALLENGE', message: `${r.who} called you out on ${name}`, time: relativeTime(r.createdAt, now), verb: 'RACE', actionable: true, target: r.gameId });
  }

  items.push(
    { kind: 'CUP', message: "Saturday Cup — you're in the last eight", time: '1h', verb: 'PLAY', actionable: true, target: 'bracket' },
    { kind: 'QUEST DONE', message: 'Cleared all five dailies', time: '3h', verb: 'CLAIM', actionable: true, target: 'stack' },
    { kind: 'FRIEND REQUEST', message: 'NEHA wants to follow you', time: '5h', verb: 'ACCEPT', actionable: true, target: 'friend/neha' },
    { kind: 'DROP', message: "Today's variant is BLACKOUT on STACK", time: '8h', verb: 'OPEN', actionable: false, target: 'drop' },
  );
  return items;
}

/* ------------------------------------------------------------------ *
 * Friend profile — head-to-head and where they beat you.
 * ------------------------------------------------------------------ */

export interface BeatRow {
  gameId: string;
  name: string;
  them: number;
  you: number;
  lead: 'them' | 'you';
}

export interface FriendProfileView {
  handle: string;
  initial: string;
  mutuals: number;
  presence: string;
  h2h: { you: number; them: number; note: string };
  beats: BeatRow[];
}

export function friendProfile(handle: string, progress: Record<string, Progress>): FriendProfileView {
  const H = handle.toUpperCase();
  const h2h = headToHead(H);
  const pres = presence(H);
  const presName = metaFor(pres.gameId)?.name ?? pres.gameId.toUpperCase();

  const beats: BeatRow[] = DUEL_GAMES.slice(0, 3).map((gameId) => {
    const meta = metaFor(gameId)!;
    const them = friendBest(H, gameId);
    const you = progress[gameId]?.best ?? 0;
    const lead = meta.lowerIsBetter ? (you === 0 || them < you ? 'them' : 'you') : them > you ? 'them' : 'you';
    return { gameId, name: meta.name, them, you, lead };
  });

  return {
    handle: H,
    initial: H[0],
    mutuals: mutuals(H),
    presence: `Played ${presName} ${pres.minutesAgo} minutes ago`,
    h2h: { you: h2h.you, them: h2h.them, note: `Duels since ${h2h.sinceMonth}. They lead by ${Math.max(0, h2h.them - h2h.you)}.` },
    beats,
  };
}
