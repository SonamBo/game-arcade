/**
 * 01 · Onboarding (§6.01). "Pick your three" in T.display, sentence case, over a
 * line of body copy. The grid becomes GameTile plates — art first, name beneath,
 * friend count as the single meta line. Selected is a 2px cyan ring, not a
 * colour change. The counter moves into the button label. Never block the skip.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameTile } from '@/components/ui/GameTile';
import { Button } from '@/components/ui/primitives';
import { GAMES } from '@/data/catalogue';
import { friendsOn, popularityOrder } from '@/data/seed';
import { useStore } from '@/store';
import { PIN_CAP } from '@/types/models';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

const CHOICES = GAMES.slice(0, 12);

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((k) => k !== id) : p.length < 3 ? [...p, id] : p));

  const finish = (picks: string[]) => {
    completeOnboarding([...picks, ...popularityOrder(picks)].slice(0, PIN_CAP));
    router.replace('/');
  };

  const enough = picked.length >= 3;
  const remaining = 3 - picked.length;
  const buttonLabel = enough
    ? 'Build my shelf →'
    : picked.length === 0
      ? 'Pick three to start'
      : `Start with ${picked.length} — pick ${remaining} more`;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: S.band }}>
          <Text style={{ fontFamily: T.display.fontFamily, fontSize: T.display.fontSize, color: C.text }}>Pick your three</Text>
          <Text style={[text('body', { color: C.n800 }), { marginTop: 8 }]}>
            Three to start your shelf — we fill the rest by what your friends play. {GAMES.length} games inside.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: S.inset, gap: S.rail, marginTop: S.band }}>
          {CHOICES.map((g) => (
            <GameTile
              key={g.id}
              family={g.family}
              name={g.name}
              meta={`${friendsOn(g.id)} friends`}
              selected={picked.includes(g.id)}
              onPress={() => toggle(g.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={{ padding: S.inset, paddingBottom: insets.bottom + 12, gap: 14 }}>
        <Button label={buttonLabel} variant={enough ? 'primary' : 'secondary'} full onPress={() => (enough ? finish(picked) : undefined)} />
        <Pressable onPress={() => finish(['stack', 'reflex', 'dodge'])} style={{ alignItems: 'center', paddingVertical: 6 }}>
          <Text style={text('rowTitle', { color: C.accent })}>Skip — just put me in a game</Text>
        </Pressable>
      </View>
    </View>
  );
}
