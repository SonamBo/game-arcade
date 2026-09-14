/**
 * 05 · In-match. Match chrome only — no tabs, no coin balance. The playfield
 * takes the rest. STACK and REFLEX take a tap anywhere in the field; DODGE adds
 * a two-button lane control strip at the bottom.
 *
 * Stage 01 renders the frame and a placeholder field with a "run" button that
 * jumps to results. The real games and run loop arrive in stages 02 and 04.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { MatchChrome } from '@/components/chrome/MatchChrome';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Match() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDodge = id === 'dodge';

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <MatchChrome
        score={31}
        rivalHandle="RAVI"
        ghost={30}
        progress={0.62}
        onQuit={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
      />

      {/* playfield placeholder — the real engine renders here from stage 02 */}
      <Pressable
        onPress={() => router.replace(`/results?game=${id}`)}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontFamily: T.display.fontFamily, fontSize: 42, color: C.n400 }}>{String(id ?? '').toUpperCase()}</Text>
        <Text style={[text('kicker', { color: C.n500 }), { marginTop: 8 }]}>Tap anywhere — playfield lands stage 02</Text>
      </Pressable>

      {isDodge ? (
        <View style={{ flexDirection: 'row', gap: S.gap, backgroundColor: C.divider }}>
          <LaneButton label="← Left" />
          <LaneButton label="Right →" />
        </View>
      ) : null}
    </View>
  );
}

function LaneButton({ label }: { label: string }) {
  return (
    <View style={{ flex: 1, height: 56, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={text('kicker', { color: C.text })}>{label}</Text>
    </View>
  );
}
