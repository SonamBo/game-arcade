/**
 * 04 · Game detail. A 96px ink code block beside the title (family · plays
 * today, name, one-line rule), a three-cell stat strip, the ghost duel band, a
 * leaderboard, a daily-quest row, and a full-width PLAY button.
 *
 * Works for any of the forty. A game the player has never touched shows a named
 * GLOBAL RIVAL on the ghost band — never an empty screen, never a fake friend.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { GhostBand } from '@/components/ui/GhostBand';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import { BandHeader, Button, Rule } from '@/components/ui/primitives';
import { Segmented } from '@/components/ui/Segmented';
import { StatStrip } from '@/components/ui/StatStrip';
import { metaFor } from '@/data/catalogue';
import { friendsOn, globalRivalFor } from '@/data/seed';
import { isPlayableId } from '@/games/registry';
import { SAMPLE_LEADERBOARD } from '@/data/samples';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function GameDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = String(id ?? 'stack');
  const meta = metaFor(gameId);
  const progress = useStore((s) => s.getProgress(gameId));
  const [board, setBoard] = useState('FRIENDS');

  if (!meta) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <BackBar label="Not found" />
        <View style={{ padding: S.inset }}>
          <Text style={text('body', { color: C.n700 })}>No game with id “{gameId}”.</Text>
        </View>
      </View>
    );
  }

  const playable = isPlayableId(gameId);
  const rival = globalRivalFor(gameId);
  const played = progress.runs > 0;
  const rivalAhead = played && (meta.lowerIsBetter ? rival.score < progress.best : rival.score > progress.best);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label={meta.name} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* title block */}
        <View style={{ flexDirection: 'row', gap: 14, padding: S.inset }}>
          <View style={{ width: 96, height: 96, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={text('title', { color: C.bg })}>{meta.code}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={text('kicker', { color: C.n600 })}>{meta.family} · {friendsOn(gameId)} playing today</Text>
            <Text style={{ fontFamily: T.title.fontFamily, fontSize: 30, letterSpacing: -0.9, color: C.text, marginTop: 2 }}>{meta.name}</Text>
            <Text style={[text('meta', { color: C.n700 }), { marginTop: 4 }]}>{meta.blurb}</Text>
          </View>
        </View>

        <StatStrip
          cells={[
            { kicker: 'Your best', value: played ? progress.best : '—' },
            { kicker: 'Friend rank', value: rivalAhead ? '#3' : '#1' },
            { kicker: 'Runs', value: progress.runs },
          ]}
        />

        <View style={{ height: S.rule }} />
        <GhostBand
          handle={rival.handle}
          score={rival.score}
          unit={meta.unit}
          state={rivalAhead ? 'rival-ahead' : 'global-rival'}
          onRace={() => router.navigate(`/match/${gameId}?source=duel`)}
        />

        <BandHeader kicker="Leaderboard" />
        <Segmented options={['FRIENDS', 'GLOBAL', 'THIS WEEK']} value={board} onChange={setBoard} />
        {SAMPLE_LEADERBOARD.map((r, i) => (
          <LeaderboardRow key={r.handle} position={i + 1} handle={r.handle} score={r.score} self={r.self} global={r.global} />
        ))}

        <BandHeader kicker="Daily quest" />
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.inset, minHeight: 48, gap: 12 }}>
          <Text style={[text('body', { color: C.text }), { flex: 1 }]}>Beat your best today</Text>
          <Text style={text('kicker', { color: C.accentDeep, numeric: true })}>+40 coins</Text>
        </View>
        <Rule />

        <View style={{ padding: S.inset }}>
          <Button
            label={playable ? 'Play' : `${meta.name} — coming soon`}
            variant="accent"
            full
            onPress={() => (playable ? router.navigate(`/match/${gameId}?source=shelf`) : undefined)}
          />
          {!playable ? (
            <Text style={[text('meta', { color: C.n600 }), { marginTop: 8 }]}>
              This game arrives with its engine in a later drop.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
