/**
 * 12 · Daily drop (§6.12). The red field is gone. The variant's art fills the top
 * at 16:9, dot-screened; the title prints at T.display on paper beneath, with the
 * live tag carrying the countdown. This screen and Home's hero card read as the
 * same object at two sizes.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import { DotScreen } from '@/components/ui/Plate';
import { FamilyMark } from '@/components/ui/icons';
import { Button, Tag } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { metaFor } from '@/data/catalogue';
import { FRIEND_COUNT } from '@/data/friends';
import { SAMPLE_LEADERBOARD } from '@/data/samples';
import { markFor, plateFor } from '@/theme/plates';
import { rotationCountdown, todaysVariant, variantFriendsPlayed } from '@/data/variant';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Drop() {
  const v = todaysVariant();
  const family = metaFor(v.gameId)?.family ?? 'TAP';

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Daily drop" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* 16:9 art */}
        <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: plateFor(family), alignItems: 'center', justifyContent: 'center' }}>
          <DotScreen />
          <FamilyMark name={markFor(family)} size={96} color={C.text} />
        </View>

        <View style={{ paddingHorizontal: S.inset, paddingTop: S.rail }}>
          <Tag kind="live" label={`Live · ${rotationCountdown()}`} />
          <Text style={[text('display'), { marginTop: 12 }]}>{v.name}</Text>
          <Text style={[text('body', { color: C.n800 }), { marginTop: 8 }]}>{v.rule}</Text>
          <View style={{ marginTop: 20 }}>
            <Button label="Play the variant" variant="primary" onPress={() => router.navigate(`/match/${v.gameId}?variant=1&source=poster`)} />
          </View>
        </View>

        <View style={{ paddingTop: S.band }}>
          <StatStrip cells={[{ kicker: 'Friends played', value: `${variantFriendsPlayed()} / ${FRIEND_COUNT}` }, { kicker: 'Next new game', value: 'Thu' }]} />
        </View>

        <View style={{ paddingTop: S.band }}>
          {SAMPLE_LEADERBOARD.map((r, i) => (
            <LeaderboardRow key={r.handle} position={i + 1} handle={r.handle} score={r.score} self={r.self} global={r.global} />
          ))}
        </View>

        <Text style={[text('body', { color: C.n800 }), { paddingHorizontal: S.inset, paddingTop: S.band }]}>
          Variants rotate daily. A new game lands every Thursday and stays for good.
        </Text>
      </ScrollView>
    </View>
  );
}
