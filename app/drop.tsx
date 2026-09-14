/**
 * 11 · Daily drop. A full accent field: "DAILY VARIANT · DAY 141" with a
 * countdown, the 46px variant name, the rule in one sentence, and a white "PLAY
 * THE VARIANT" button. Then a 2-up strip (FRIENDS PLAYED / NEXT NEW GAME), then
 * the variant leaderboard with the player's row tinted. Closing line explains
 * the cadence.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import { Button } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { SAMPLE_DROP, SAMPLE_LEADERBOARD } from '@/data/samples';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Drop() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Daily drop" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ backgroundColor: C.accent, paddingHorizontal: S.inset, paddingVertical: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={text('kicker', { color: C.bg })}>Daily variant · day 141</Text>
            <Text style={text('kicker', { color: C.bg, numeric: true })}>{SAMPLE_DROP.countdown}</Text>
          </View>
          <Text style={{ fontFamily: T.display.fontFamily, fontSize: 46, letterSpacing: -1.8, color: C.bg, marginTop: 6 }}>
            {SAMPLE_DROP.name}
          </Text>
          <Text style={[text('body', { color: C.bg }), { marginTop: 6, marginBottom: 14 }]}>{SAMPLE_DROP.rule}</Text>
          <Button label="Play the variant" variant="inverse" onPress={() => router.navigate('/match/stack')} />
        </View>

        <StatStrip cells={[{ kicker: 'Friends played', value: '8 / 23' }, { kicker: 'Next new game', value: 'THU' }]} />

        {SAMPLE_LEADERBOARD.map((r, i) => (
          <LeaderboardRow key={r.handle} position={i + 1} handle={r.handle} score={r.score} self={r.self} global={r.global} />
        ))}

        <Text style={[text('body', { color: C.n700 }), { paddingHorizontal: S.inset, paddingTop: 20 }]}>
          Variants rotate daily. A new game lands every Thursday and stays for good.
        </Text>
      </ScrollView>
    </View>
  );
}
