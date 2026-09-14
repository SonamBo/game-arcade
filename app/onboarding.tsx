/**
 * 01 · Onboarding — "Pick your three". One screen, no account, no carousel.
 * A 3-up grid of twelve games; tapping a tile inverts it to accent. The primary
 * button reads "PICK n MORE" until three are chosen, then "BUILD MY SHELF →".
 * An underlined skip drops straight into a game.
 *
 * The three picks seed the twelve pinned slots; the other nine are filled by
 * popularity (build brief §5 / UI spec §01). Never block the skip.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/primitives';
import { GAMES } from '@/data/catalogue';
import { popularityOrder } from '@/data/seed';
import { useStore } from '@/store';
import { PIN_CAP } from '@/types/models';
import { C, MIN_TAP, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

const CHOICES = GAMES.slice(0, 12);

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (id: string) => {
    setPicked((p) => (p.includes(id) ? p.filter((k) => k !== id) : p.length < 3 ? [...p, id] : p));
  };

  const finish = (picks: string[]) => {
    // Seed the twelve pinned slots: the picks, then fill by popularity.
    const twelve = [...picks, ...popularityOrder(picks)].slice(0, PIN_CAP);
    completeOnboarding(twelve);
    router.replace('/');
  };

  const enough = picked.length >= 3;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ padding: S.inset, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={text('kicker', { color: C.accentDeep })}>Step 1 of 1 · {GAMES.length} games inside</Text>
        <Text style={{ fontFamily: T.display.fontFamily, fontSize: 38, letterSpacing: -1.4, color: C.text, marginTop: 8 }}>
          PICK YOUR THREE.
        </Text>
        <Text style={[text('body', { color: C.n700 }), { marginTop: 8 }]}>
          Three to start your shelf. We fill the rest by what your friends play.
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: C.divider, gap: S.gap, marginTop: 18 }}>
          {CHOICES.map((g) => {
            const on = picked.includes(g.id);
            return (
              <Pressable
                key={g.id}
                onPress={() => toggle(g.id)}
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
