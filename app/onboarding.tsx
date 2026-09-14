/**
 * 01 · Onboarding — "Pick your three". One screen, no account, no carousel.
 * Kicker "STEP 1 OF 1 · 40 GAMES INSIDE", a 38px headline, one line of
 * explanation, then a 3-up grid of twelve games. Tapping a tile inverts it to
 * accent. The primary button reads "PICK n MORE" until three are chosen, then
 * accent "BUILD MY SHELF →". An underlined skip drops straight into STACK.
 *
 * The three picks seed the twelve pinned slots; the other nine fill by
 * popularity (stage 05). Never block the skip.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/primitives';
import { useStore } from '@/store';
import { SAMPLE_GAMES } from '@/data/samples';
import { C, MIN_TAP, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

// Twelve to choose from — a slice of the eventual forty.
const CHOICES = [...SAMPLE_GAMES, ...SAMPLE_GAMES].slice(0, 12).map((g, i) => ({ ...g, key: `${g.id}-${i}` }));

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (key: string) => {
    setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : p.length < 3 ? [...p, key] : p));
  };

  const finish = (ids: string[]) => {
    completeOnboarding(ids);
    router.replace('/');
  };

  const enough = picked.length >= 3;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ padding: S.inset, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={text('kicker', { color: C.accentDeep })}>Step 1 of 1 · 40 games inside</Text>
        <Text style={{ fontFamily: T.display.fontFamily, fontSize: 38, letterSpacing: -1.4, color: C.text, marginTop: 8 }}>
          PICK YOUR THREE.
        </Text>
        <Text style={[text('body', { color: C.n700 }), { marginTop: 8 }]}>
          Three to start your shelf. We fill the rest by what your friends play.
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: C.divider, gap: S.gap, marginTop: 18 }}>
          {CHOICES.map((g) => {
            const on = picked.includes(g.key);
            return (
              <Pressable
                key={g.key}
                onPress={() => toggle(g.key)}
                style={{ width: '32.6%', minHeight: 74, backgroundColor: on ? C.accent : C.bg, padding: 10, justifyContent: 'space-between' }}
              >
                <Text style={text('rowTitle', { color: on ? C.bg : C.text })}>{g.name}</Text>
                <Text style={text('kicker', { color: on ? C.bg : C.n500 })}>{g.family}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ padding: S.inset, paddingBottom: insets.bottom + 12, gap: 14, borderTopWidth: S.rule, borderTopColor: C.divider }}>
        {enough ? (
          <Button label="Build my shelf →" variant="accent" full onPress={() => finish(picked)} />
        ) : (
          <View style={{ minHeight: MIN_TAP, alignItems: 'center', justifyContent: 'center', backgroundColor: C.n300 }}>
            <Text style={text('kicker', { color: C.n600 })}>Pick {3 - picked.length} more</Text>
          </View>
        )}
        <Pressable onPress={() => finish(['stack', 'reflex', 'dodge'])} style={{ alignItems: 'center', paddingVertical: 6 }}>
          <Text style={[text('meta', { color: C.n700 }), { textDecorationLine: 'underline' }]}>
            Skip — just put me in a game
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
