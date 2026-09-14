/**
 * 06 · Results — the retention screen. Reads the real Run just committed
 * (store.lastRun). Accent banner on a personal best, ink otherwise; the score at
 * 72px and one plain-language headline. A three-cell strip, a near-miss band
 * only when the run fell within 18% of the player's best, then the auto-queue.
 *
 * The live three-second countdown, the near-miss retry economy and the real
 * next-ranked game are stage 03; here the ring is static and the numbers are
 * real. If there is no committed run (e.g. deep-linked), it falls back to a
 * neutral empty state.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QueueRing } from '@/components/ui/QueueRing';
import { Button, Rule } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { SAMPLE_GAMES } from '@/data/samples';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Results() {
  const insets = useSafeAreaInsets();
  const run = useStore((s) => s.lastRun);
  const getProgress = useStore((s) => s.getProgress);
  const [cancelled, setCancelled] = useState(false);

  if (!run) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={text('kicker', { color: C.n500 })}>No run to show</Text>
        <View style={{ height: 12 }} />
        <Button label="Shelf" variant="outlined" onPress={() => router.navigate('/')} />
      </View>
    );
  }

  const game = SAMPLE_GAMES.find((g) => g.id === run.gameId);
  const name = game?.name ?? run.gameId.toUpperCase();
  const rival = game?.rival?.handle ?? 'KOJI';
  const ghost = game?.rival ? (game.best ?? 0) + game.rival.by : undefined;
  const best = getProgress(run.gameId).best;

  const headline = run.improved
    ? `Up ${run.score - run.prevBest} on your old best. Posted to the feed.`
    : run.beatGhost
      ? `You took ${rival}'s ghost.`
      : `${rival}'s ghost held. ${run.delta} short.`;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* banner — accent on a personal best, ink otherwise */}
        <View style={{ backgroundColor: run.improved ? C.accent : C.text, paddingHorizontal: S.inset, paddingVertical: 18 }}>
          <Text style={text('kicker', { color: C.bg })}>
            {run.improved ? `New personal best · ${name}` : `Run over · ${name}`}
          </Text>
          <Text style={{ fontFamily: T.run.fontFamily, fontSize: 72, letterSpacing: -2.9, color: C.bg, fontVariant: ['tabular-nums'] }}>
            {run.score.toLocaleString()}
          </Text>
          <Text style={text('body', { color: C.bg })}>{headline}</Text>
        </View>

        <StatStrip
          cells={[
            { kicker: 'Your best', value: best },
            { kicker: `${rival} ghost`, value: ghost ?? '—', accent: run.beatGhost },
            { kicker: 'Coins', value: `+${run.coins}`, accent: true },
          ]}
        />

        {/* near-miss band — only inside 18% of the best, without beating it */}
        {run.nearMiss ? (
          <View style={{ backgroundColor: C.accentTint, paddingHorizontal: S.inset, paddingVertical: 14 }}>
            <Text style={text('kicker', { color: C.accentDeep })}>So close</Text>
            <Text style={[{ fontFamily: T.figure.fontFamily, fontSize: 22, color: C.text }, { marginTop: 4 }]}>
              YOU WERE {run.delta} OFF YOUR BEST
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, alignItems: 'center' }}>
              <Button label="Retry free" variant="accent" onPress={() => router.replace(`/match/${run.gameId}`)} />
              <Text style={text('meta', { color: C.n700 })}>3 free retries left today. Retry restarts at the score reached.</Text>
            </View>
          </View>
        ) : null}

        {/* auto-queue (static until stage 03) */}
        <View style={{ height: S.rule }} />
        <QueueRing
          seconds={3}
          nextName="DODGE"
          reason="ZAID BEAT YOU BY 2"
          cancelled={cancelled}
          onCancel={() => setCancelled(true)}
          onPlay={() => router.replace('/match/dodge')}
        />
        <Rule />

        <Text style={[text('meta', { color: C.n600 }), { paddingHorizontal: S.inset, paddingVertical: 12 }]}>
          {run.improved ? `Posted to your feed: ${name} · +${run.coins} coins.` : `+${run.coins} coins earned.`}
        </Text>

        <View style={{ flexDirection: 'row', gap: S.gap, backgroundColor: C.divider, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Button label="Run it again" variant="accent" full onPress={() => router.replace(`/match/${run.gameId}`)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Shelf" variant="inverse" full onPress={() => router.navigate('/')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
