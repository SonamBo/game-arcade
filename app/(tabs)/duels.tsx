/**
 * 08 · Duels. Header kicker "ASYNC · NOBODY WAITS" over a count. Then one row
 * per duel: a 44px ink initial block, the stake line (accent when under twelve
 * hours), and an accent RACE button; rows expiring soon sit on accent tint.
 * Below, a full-bleed accent banner for the live tournament, and a link to the
 * inbox.
 *
 * Cold start seeds a named, skill-matched GLOBAL RIVAL and never fabricates
 * friends — enforced in the social slice at stage 06.
 */
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { Button, Rule } from '@/components/ui/primitives';
import { SAMPLE_DUELS } from '@/data/samples';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Duels() {
  const waiting = SAMPLE_DUELS.length;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: 18, paddingBottom: 10 }}>
          <Text style={text('kicker', { color: C.n600 })}>Async · nobody waits</Text>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 26, color: C.text, letterSpacing: -0.8, marginTop: 2 }}>
            {waiting} ghosts waiting
          </Text>
        </View>
        <Rule weight="section" />

        {SAMPLE_DUELS.map((d, i) => (
          <View key={i}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 56,
                paddingHorizontal: S.inset,
                paddingVertical: 10,
                gap: 12,
                backgroundColor: d.soon ? C.accentTint : C.bg,
              }}
            >
              <View style={{ width: 44, height: 44, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={text('rowTitle', { color: C.bg })}>{d.handle[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={text('rowTitle')}>
                  {d.handle} · {d.code}
                </Text>
                <Text style={[text('meta', { color: d.soon ? C.accentDeep : C.n600 }), { marginTop: 2 }]}>{d.stake}</Text>
              </View>
              <Button label="Race" variant="accent" onPress={() => router.navigate(`/match/${d.code.toLowerCase()}`)} />
            </View>
            <Rule />
          </View>
        ))}

        {/* live tournament banner */}
        <Pressable onPress={() => router.navigate('/bracket')} style={{ backgroundColor: C.accent, paddingHorizontal: S.inset, paddingVertical: 18, marginTop: 12 }}>
          <Text style={text('kicker', { color: C.bg })}>Saturday Cup · Round 2</Text>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 26, color: C.bg, letterSpacing: -0.8, marginTop: 4 }}>
            You're in the last eight →
          </Text>
        </Pressable>

        <Pressable onPress={() => router.navigate('/inbox')} style={{ paddingHorizontal: S.inset, paddingVertical: 16 }}>
          <Text style={text('kicker', { color: C.accentDeep })}>4 challenges in your inbox →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
