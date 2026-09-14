/**
 * 06 · Results — the retention screen. Accent banner if it is a personal best,
 * ink otherwise; the score at 72px and one plain-language headline. A three-cell
 * strip, a near-miss band (only inside 18%), the auto-queue ring counting three
 * seconds down with a cancel that always works, a feed receipt, and a two-up
 * footer.
 *
 * The ring's live countdown and the real next-ranked game arrive at stage 03;
 * here the anatomy and the cancel are wired against the QueueRing component.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QueueRing } from '@/components/ui/QueueRing';
import { Button, Rule } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Results() {
  const insets = useSafeAreaInsets();
  const { game } = useLocalSearchParams<{ game: string }>();
  const [cancelled, setCancelled] = useState(false);

  // Illustrative: a personal best on STACK. Real values come from the Run record.
  const isBest = true;
  const score = 52;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* banner */}
        <View style={{ backgroundColor: isBest ? C.accent : C.text, paddingHorizontal: S.inset, paddingVertical: 18 }}>
          <Text style={text('kicker', { color: C.bg })}>{isBest ? 'New personal best · STACK' : 'Run over · STACK'}</Text>
          <Text style={{ fontFamily: T.run.fontFamily, fontSize: 72, letterSpacing: -2.9, color: C.bg, fontVariant: ['tabular-nums'] }}>
            {score}
          </Text>
          <Text style={text('body', { color: C.bg })}>Up 5 on your old best. Posted to the feed.</Text>
        </View>

        <StatStrip
          cells={[
            { kicker: 'Your best', value: 52 },
            { kicker: 'Ravi ghost', value: 50, accent: true },
            { kicker: 'Coins', value: '+31', accent: true },
          ]}
        />

        {/* auto-queue */}
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

        {/* feed receipt */}
        <Text style={[text('meta', { color: C.n600 }), { paddingHorizontal: S.inset, paddingVertical: 12 }]}>
          Posted to your feed: beat RAVI · +31 coins.
        </Text>

        {/* two-up footer */}
        <View style={{ flexDirection: 'row', gap: S.gap, backgroundColor: C.divider, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Button label="Run it again" variant="accent" full onPress={() => router.replace(`/match/${game ?? 'stack'}`)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Shelf" variant="inverse" full onPress={() => router.navigate('/')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
