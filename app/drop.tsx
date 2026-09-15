/**
 * 11 · Daily drop. A full accent field: "DAILY VARIANT · DAY n" with a
 * countdown, the variant name, the rule, and a "PLAY THE VARIANT" button.
 * Then a 2-up strip (FRIENDS PLAYED / NEXT NEW GAME), then the variant
 * leaderboard. The variant rotates at local midnight and pays double coins.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import { Button } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { rotationCountdown, todaysVariant, variantFriendsPlayed } from '@/data/variant';
import { FRIEND_COUNT } from '@/data/friends';
import { SAMPLE_LEADERBOARD } from '@/data/samples';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Drop() {
  const v = todaysVariant();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Daily drop" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ backgroundColor: C.accent, paddingHorizontal: S.inset, paddingVertical: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={text('kicker', { color: C.bg })}>Daily variant · day {v.day}</Text>
            <Text style={text('kicker', { color: C.bg, numeric: true })}>{rotationCountdown()}</Text>
          </View>
          <Text style={{ fontFamily: T.display.fontFamily, fontSize: 44, letterSpacing: -1.7, color: C.bg, marginTop: 6, lineHeight: 46 }}>
            {v.name}
          </Text>
          <Text style={[text('body', { color: C.bg }), { marginTop: 6, marginBottom: 14 }]}>{v.rule}</Text>
          <Button label="Play the variant" variant="inverse" onPress={() => router.navigate(`/match/${v.gameId}?variant=1&source=poster`)} />
        </View>

        <StatStrip cells={[{ kicker: 'Friends played', value: `${variantFriendsPlayed()} / ${FRIEND_COUNT}` }, { kicker: 'Next new game', value: 'THU' }]} />

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
