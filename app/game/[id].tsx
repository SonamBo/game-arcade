/**
 * 04 · Game detail (§6.04). A full-width 16:10 art plate, the title on paper
 * beneath with the family as a meta line, a rule-free stat strip, the rivalry in
 * magenta on paper, a leaderboard without hairlines, a quest row, and one cyan
 * primary button pinned to the bottom inset.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar } from '@/components/chrome/BackBar';
import { GhostBand } from '@/components/ui/GhostBand';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import { DotScreen } from '@/components/ui/Plate';
import { FamilyMark } from '@/components/ui/icons';
import { BandHeader, Button } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { Segmented } from '@/components/ui/Segmented';
import { metaFor } from '@/data/catalogue';
import { friendsOn, globalRivalFor } from '@/data/seed';
import { isPlayableId } from '@/games/registry';
import { markFor, plateFor } from '@/theme/plates';
import { SAMPLE_LEADERBOARD } from '@/data/samples';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function GameDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = String(id ?? 'stack');
  const meta = metaFor(gameId);
  const progress = useStore((s) => s.getProgress(gameId));
  const [board, setBoard] = useState('Friends');

  if (!meta) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <BackBar label="Not found" />
        <Text style={[text('body', { color: C.n700 }), { padding: S.inset }]}>No game with id “{gameId}”.</Text>
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>
        {/* 16:10 art */}
        <View style={{ width: '100%', aspectRatio: 16 / 10, backgroundColor: plateFor(meta.family), alignItems: 'center', justifyContent: 'center' }}>
          <DotScreen />
          <FamilyMark name={markFor(meta.family)} size={84} color={C.text} />
        </View>

        <View style={{ paddingHorizontal: S.inset, paddingTop: S.rail }}>
          <Text style={text('title')}>{meta.name}</Text>
          <Text style={[text('meta', { color: C.n700 }), { marginTop: 4 }]}>{meta.family} · {friendsOn(gameId)} playing today</Text>
          <Text style={[text('body', { color: C.n800 }), { marginTop: 8 }]}>{meta.blurb}</Text>
        </View>

        <View style={{ paddingTop: S.band }}>
          <StatStrip
            cells={[
              { kicker: 'Your best', value: played ? progress.best : '—' },
              { kicker: 'Friend rank', value: rivalAhead ? '#3' : '#1' },
              { kicker: 'Runs', value: progress.runs },
            ]}
          />
        </View>

        <GhostBand
          handle={rival.handle}
          score={rival.score}
          unit={meta.unit}
          state={rivalAhead ? 'rival-ahead' : 'global-rival'}
          onRace={() => router.navigate(`/match/${gameId}?source=duel`)}
        />

        <BandHeader kicker="Leaderboard" />
        <Segmented options={['Friends', 'Global', 'This week']} value={board} onChange={setBoard} />
        <View style={{ paddingTop: 6 }}>
          {SAMPLE_LEADERBOARD.map((r, i) => (
            <LeaderboardRow key={r.handle} position={i + 1} handle={r.handle} score={r.score} self={r.self} global={r.global} />
          ))}
        </View>

        <BandHeader kicker="Daily quest" />
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.inset, gap: 12 }}>
          <Text style={[text('body'), { flex: 1 }]}>Beat your best today</Text>
          <Text style={{ fontFamily: T.figure.fontFamily, fontSize: 20, color: C.accentDeep }}>+40</Text>
        </View>
      </ScrollView>

      {/* pinned primary action */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: S.inset, paddingTop: 12, paddingBottom: insets.bottom + 12, backgroundColor: C.bg }}>
        <Button
          label={playable ? 'Play' : `${meta.name} — coming soon`}
          variant={playable ? 'primary' : 'secondary'}
          full
          onPress={() => (playable ? router.navigate(`/match/${gameId}?source=shelf`) : undefined)}
        />
      </View>
    </View>
  );
}
