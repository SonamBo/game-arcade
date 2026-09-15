/**
 * 10 · Your profile. Accent initial block, handle, level/streak lines, a 2-up
 * stat grid, the season ladder (a real tier derived from lifetime play), the
 * five daily quests with claim buttons, and best games.
 */
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { BandHeader, Button, Rule } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { GAME_COUNT, metaFor } from '@/data/catalogue';
import { DAILY_QUESTS } from '@/data/quests';
import { useStore } from '@/store';
import { C, MIN_TAP, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

const TIERS: [string, number][] = [
  ['Rookie', 0],
  ['Contender', 300],
  ['Challenger', 1000],
  ['Elite', 2500],
  ['Legend', 6000],
];

function season(points: number) {
  let i = 0;
  for (let t = 0; t < TIERS.length; t++) if (points >= TIERS[t][1]) i = t;
  const [name, floor] = TIERS[i];
  const next = TIERS[i + 1];
  const pct = next ? Math.min(1, (points - floor) / (next[1] - floor)) : 1;
  return { name, pct, next: next?.[0], toNext: next ? next[1] - points : 0, points };
}

export default function Me() {
  const streak = useStore((s) => s.streak.days);
  const coins = useStore((s) => s.wallet.coins);
  const progress = useStore((s) => s.progress);
  const quests = useStore((s) => s.quests);
  const history = useStore((s) => s.history);
  const questValue = useStore((s) => s.questValue);
  const claimQuest = useStore((s) => s.claimQuest);

  const played = Object.values(progress).filter((p) => p.runs > 0);
  const totalRuns = played.reduce((a, p) => a + p.runs, 0);
  const points = totalRuns * 8 + played.length * 25;
  const sea = season(points);

  const bestGames = played
    .map((_, i) => Object.entries(progress).filter(([, p]) => p.runs > 0)[i])
    .filter(Boolean)
    .slice(0, 4);

  const onClaim = (id: string) => {
    if (claimQuest(id)) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', gap: 14, padding: S.inset, alignItems: 'center' }}>
          <View style={{ width: 88, height: 88, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: T.display.fontFamily, fontSize: 42, color: C.bg }}>S</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: T.title.fontFamily, fontSize: 24, color: C.text, letterSpacing: -0.8 }}>SONU</Text>
            <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{sea.name} · {played.length} of {GAME_COUNT} games</Text>
            <Text style={[text('kicker', { color: C.accentDeep }), { marginTop: 4 }]}>{streak}-day streak</Text>
          </View>
        </View>

        <StatStrip cells={[{ kicker: 'Runs today', value: quests.runs }, { kicker: 'Games played', value: `${played.length} / ${GAME_COUNT}` }]} />
        <StatStrip cells={[{ kicker: 'Coins', value: coins }, { kicker: 'Day streak', value: streak }]} />
        <StatStrip cells={[{ kicker: 'Sessions', value: history.length }, { kicker: 'Bests today', value: quests.bestsBeaten }]} />

        {/* season ladder */}
        <BandHeader kicker="Season" />
        <View style={{ paddingHorizontal: S.inset }}>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 30, color: C.text, letterSpacing: -0.9 }}>{sea.name}</Text>
          <View style={{ height: 10, backgroundColor: C.n300, marginTop: 10 }}>
            <View style={{ height: 10, width: `${Math.round(sea.pct * 100)}%`, backgroundColor: C.accent }} />
          </View>
          <Text style={[text('meta', { color: C.n600, numeric: true }), { marginTop: 6 }]}>
            {sea.next ? `${sea.points} pts · ${sea.toNext} to ${sea.next}` : `${sea.points} pts · top tier`}
          </Text>
        </View>

        {/* daily quests */}
        <BandHeader kicker="Daily quests" />
        {DAILY_QUESTS.map((q) => {
          const value = Math.min(q.goal, questValue(q.metric));
          const done = value >= q.goal;
          const claimed = quests.claimed.includes(q.id);
          return (
            <View key={q.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: MIN_TAP, paddingHorizontal: S.inset, paddingVertical: 8, gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={text('rowTitle')}>{q.label}</Text>
                  <Text style={[text('meta', { color: C.n600, numeric: true }), { marginTop: 2 }]}>{value}/{q.goal} · +{q.coin} coins</Text>
                </View>
                {claimed ? (
                  <Text style={text('kicker', { color: C.n500 })}>Claimed</Text>
                ) : done ? (
                  <Button label={`Claim ${q.coin}`} variant="accent" onPress={() => onClaim(q.id)} />
                ) : (
                  <Text style={text('kicker', { color: C.n500, numeric: true })}>{q.goal - value} to go</Text>
                )}
              </View>
              <Rule />
            </View>
          );
        })}

        <BandHeader kicker="Your best games" />
        {bestGames.length === 0 ? (
          <Text style={[text('meta', { color: C.n600 }), { paddingHorizontal: S.inset }]}>No runs yet — play a game.</Text>
        ) : (
          bestGames.map(([id, p]) => (
            <View key={id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingHorizontal: S.inset, gap: 12 }}>
                <Text style={[text('rowTitle'), { flex: 1 }]} onPress={() => router.navigate(`/game/${id}`)}>{metaFor(id)?.name ?? id.toUpperCase()}</Text>
                <Text style={text('meta', { color: C.n600, numeric: true })}>{p.runs} runs</Text>
                <Text style={text('figure', { numeric: true })}>{p.best.toLocaleString()}</Text>
              </View>
              <Rule />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
