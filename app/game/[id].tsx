/**
 * 04 · Game detail. A 96px ink code block beside the title (family · plays
 * today, name, one-line rule), a three-cell stat strip (YOUR BEST · FRIEND RANK
 * · RUNS), the ghost duel band, a leaderboard with FRIENDS / GLOBAL / THIS WEEK,
 * a daily-quest row with its coin value in accent, and a full-width PLAY button
 * that closes the screen into a run.
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
import { getGameMeta, isPlayableId } from '@/games/registry';
import { SAMPLE_GAMES, SAMPLE_LEADERBOARD } from '@/data/samples';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function GameDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = SAMPLE_GAMES.find((g) => g.id === id) ?? SAMPLE_GAMES[0];
  const meta = getGameMeta(game.id);
  const [board, setBoard] = useState('FRIENDS');
  const playable = isPlayableId(game.id);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label={game.name} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* title block */}
        <View style={{ flexDirection: 'row', gap: 14, padding: S.inset }}>
          <View style={{ width: 96, height: 96, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={text('title', { color: C.bg })}>{game.code}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={text('kicker', { color: C.n600 })}>{game.family} · {game.friendsOn} playing today</Text>
            <Text style={{ fontFamily: T.title.fontFamily, fontSize: 30, letterSpacing: -0.9, color: C.text, marginTop: 2 }}>{game.name}</Text>
            <Text style={[text('meta', { color: C.n700 }), { marginTop: 4 }]}>{meta?.blurb ?? 'A quick one. Beat the number.'}</Text>
          </View>
        </View>

        <StatStrip
          cells={[
            { kicker: 'Your best', value: game.best ?? '—' },
            { kicker: 'Friend rank', value: game.rival ? '#3' : '#1' },
            { kicker: 'Runs', value: game.runs },
          ]}
        />

        <View style={{ height: S.rule }} />
        <GhostBand
          handle={game.rival?.handle ?? 'KOJI'}
          score={game.best ? game.best + (game.rival?.by ?? 5) : 40}
          unit={game.unit}
          state={game.rival ? 'rival-ahead' : 'global-rival'}
          onRace={() => router.navigate(`/match/${game.id}`)}
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
          <Button label={playable ? 'Play' : `Play ${game.name} (simulated)`} variant="accent" full onPress={() => router.navigate(`/match/${game.id}`)} />
        </View>
      </ScrollView>
    </View>
  );
}
