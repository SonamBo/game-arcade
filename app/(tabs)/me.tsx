/**
 * 09 · Profile (§6.09). A 72px neutral circle with the initial, handle in
 * T.title, season and streak as meta lines beneath. Stats become a rail of
 * figures. Daily quests follow, then a best-of rail of the player's top plates.
 * No rules, no ink square.
 */
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { GameTile } from '@/components/ui/GameTile';
import { Rail } from '@/components/ui/Rail';
import { BandHeader, Button } from '@/components/ui/primitives';
import { GAME_COUNT, metaFor } from '@/data/catalogue';
import { DAILY_QUESTS } from '@/data/quests';
import { useStore } from '@/store';
import { C, R, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

const TIERS: [string, number][] = [
  ['Rookie', 0], ['Contender', 300], ['Challenger', 1000], ['Elite', 2500], ['Legend', 6000],
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

  const playedEntries = Object.entries(progress).filter(([, p]) => p.runs > 0);
  const totalRuns = playedEntries.reduce((a, [, p]) => a + p.runs, 0);
  const sea = season(totalRuns * 8 + playedEntries.length * 25);

  const stats = [
    { label: 'Runs today', value: quests.runs },
    { label: 'Games', value: `${playedEntries.length}/${GAME_COUNT}` },
    { label: 'Coins', value: coins.toLocaleString() },
    { label: 'Streak', value: streak },
    { label: 'Sessions', value: history.length },
  ];

  const onClaim = (id: string) => { if (claimQuest(id)) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', gap: S.rail, paddingHorizontal: S.inset, paddingTop: S.rail, alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, borderRadius: R.pill, backgroundColor: C.n300, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={text('title', { color: C.n800 })}>S</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={text('title')}>Sonu</Text>
            <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{sea.name} · {playedEntries.length} of {GAME_COUNT} games</Text>
            <Text style={text('meta', { color: C.n700 })}>{streak}-day streak</Text>
          </View>
        </View>

        {/* stats rail */}
        <View style={{ paddingTop: S.band }}>
          <Rail>
            {stats.map((st) => (
              <View key={st.label} style={{ minWidth: 90 }}>
                <Text style={text('figure')}>{typeof st.value === 'number' ? st.value.toLocaleString() : st.value}</Text>
                <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{st.label}</Text>
              </View>
            ))}
          </Rail>
        </View>

        {/* season */}
        <BandHeader kicker="Season" />
        <View style={{ paddingHorizontal: S.inset }}>
          <Text style={text('title')}>{sea.name}</Text>
          <View style={{ height: 10, backgroundColor: C.n300, borderRadius: R.pill, marginTop: 10, overflow: 'hidden' }}>
            <View style={{ height: 10, width: `${Math.round(sea.pct * 100)}%`, backgroundColor: C.accent }} />
          </View>
          <Text style={[text('meta', { color: C.n700, numeric: true }), { marginTop: 6 }]}>
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
            <View key={q.id} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingHorizontal: S.inset, paddingVertical: 8, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={text('rowTitle')}>{q.label}</Text>
                <Text style={[text('meta', { color: C.n700, numeric: true }), { marginTop: 2 }]}>{value}/{q.goal} · +{q.coin} coins</Text>
              </View>
              {claimed ? (
                <Text style={text('meta', { color: C.n700 })}>Claimed</Text>
              ) : done ? (
                <Button label={`Claim ${q.coin}`} variant="primary" onPress={() => onClaim(q.id)} />
              ) : (
                <Text style={text('meta', { color: C.n700, numeric: true })}>{q.goal - value} to go</Text>
              )}
            </View>
          );
        })}

        {/* best games */}
        {playedEntries.length > 0 ? (
          <>
            <BandHeader kicker="Your best games" />
            <Rail>
              {playedEntries.slice(0, 8).map(([id, p]) => {
                const m = metaFor(id);
                if (!m) return null;
                return (
                  <GameTile key={id} family={m.family} name={m.name} meta={`Best ${p.best.toLocaleString()}`} onPress={() => router.navigate(`/game/${id}`)} />
                );
              })}
            </Rail>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
