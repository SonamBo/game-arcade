/**
 * COMPONENTS GALLERY — stage 01 acceptance surface.
 *
 * Renders all eleven §6 components in every state they list, so the stage is
 * checkable at a glance rather than by touring fourteen screens. Not part of the
 * product; reachable at /gallery and from the Me screen during development.
 * Delete or hide before the first store build.
 */
import { Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditorialRow } from '@/components/ui/EditorialRow';
import { FeedPost } from '@/components/ui/FeedPost';
import { GhostBand } from '@/components/ui/GhostBand';
import { IndexRow } from '@/components/ui/IndexRow';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import { NotificationRow } from '@/components/ui/NotificationRow';
import { PosterBand } from '@/components/ui/PosterBand';
import { QueueRing } from '@/components/ui/QueueRing';
import { ShelfGrid, ShelfRow, ShelfTile } from '@/components/ui/ShelfTile';
import { StatStrip } from '@/components/ui/StatStrip';
import { ToastStripStatic } from '@/components/ui/ToastStrip';
import { Rule } from '@/components/ui/primitives';
import { SAMPLE_DROP, SAMPLE_NEW_GAME } from '@/data/samples';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Gallery() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
        <Text style={[text('kicker', { color: C.accentDeep }), { padding: S.inset }]}>Components · eleven patterns · every state</Text>

        <H n="01" label="Poster band — variant / new game" />
        <PosterBand data={SAMPLE_DROP} />
        <View style={{ height: S.gap }} />
        <PosterBand data={SAMPLE_NEW_GAME} />

        <H n="02" label="Editorial row — rival ahead / never played / neutral" />
        <EditorialRow code="STK" name="STACK" meta="TAP · 26 runs" reason="RAVI BEAT YOU BY 3" best={47} unit="blocks" />
        <Rule />
        <EditorialRow code="CNT" name="COUNT" meta="NUMBERS · never played" reason="9 FRIENDS PLAY THIS · YOU NEVER HAVE" best={null} unit="right" neverPlayed />
        <Rule />
        <EditorialRow code="MRG" name="MERGE" meta="NUMBERS · 7 runs" best={512} unit="score" />

        <H n="03" label="Shelf tile — played / never played / pinned" />
        <ShelfGrid>
          <ShelfRow>
            <ShelfTile name="STACK" family="TAP" best={47} unit="blocks" />
            <ShelfTile name="COUNT" family="NUMBERS" best={null} unit="right" />
          </ShelfRow>
        </ShelfGrid>

        <H n="04" label="Index row — pinned (tinted) / unpinned" />
        <IndexRow index={1} name="STACK" subline="TAP · RAVI ahead" friendsOn={9} best={47} pinned />
        <Rule />
        <IndexRow index={2} name="ORBIT" subline="TIMING · never played" friendsOn={2} best={null} />

        <H n="05" label="Stat strip — two / three cells" />
        <StatStrip cells={[{ kicker: 'Your best', value: 52 }, { kicker: 'Ravi ghost', value: 50, accent: true }, { kicker: 'Coins', value: '+31', accent: true }]} />

        <H n="06" label="Ghost band — rival ahead / player ahead / global" />
        <GhostBand handle="RAVI" score={50} unit="blocks" state="rival-ahead" />
        <View style={{ height: S.gap }} />
        <GhostBand handle="IRA" score={41} unit="blocks" state="player-ahead" />
        <View style={{ height: S.gap }} />
        <GhostBand handle="KOJI" score={88} unit="laps" state="global-rival" />

        <H n="07" label="Leaderboard row — self (tinted) / friend / global" />
        <LeaderboardRow position={1} handle="MEHA" score={63} />
        <LeaderboardRow position={2} handle="YOU" score={47} self />
        <LeaderboardRow position={3} handle="KOJI" score={88} global />

        <H n="08" label="Feed post — involves you (tinted) / neutral / global" />
        <FeedPost who="RAVI" kicker="PERSONAL BEST" time="2m" headline="STACK · 50 blocks" figure={50} unit="blocks" reactions={12} comments={3} verb="BEAT IT" involvesYou comment="left you 3 behind, catch up" />
        <Rule />
        <FeedPost who="MEHA" kicker="WON A DUEL" time="18m" headline="Took DODGE off ZAID" figure={3180} unit="m" reactions={8} comments={1} verb="RACE MEHA" />
        <Rule />
        <FeedPost who="WORLD RECORD" kicker="GLOBAL MOMENT" time="1h" headline="ORBIT · 40 laps" figure={40} unit="laps" reactions={204} comments={55} verb="TRY ORBIT" global />

        <H n="09" label="Queue ring — counting / cancelled" />
        <QueueRing nextName="DODGE" reason="ZAID BEAT YOU BY 2" autoStart={false} />
        <Rule />
        <QueueRing nextName="DODGE" reason="" startCancelled />

        <H n="10" label="Notification row — actionable (tinted) / informational" />
        <NotificationRow kind="CHALLENGE" message="RAVI called you out on STACK" time="2m" verb="RACE" actionable />
        <Rule />
        <NotificationRow kind="DROP" message="Today's variant is BLACKOUT on STACK" time="8h" verb="OPEN" />

        <H n="11" label="Toast strip — pin / unpin / refusal" />
        <ToastStripStatic label="STACK pinned to your shelf" />
        <View style={{ height: S.gap }} />
        <ToastStripStatic label="STACK unpinned" />
        <View style={{ height: S.gap }} />
        <ToastStripStatic label="Shelf full — unpin one first" refusal />
      </ScrollView>
    </View>
  );
}

function H({ n, label }: { n: string; label: string }) {
  return (
    <View style={{ paddingHorizontal: S.inset, paddingTop: 26, paddingBottom: 8, borderTopWidth: S.rule, borderTopColor: C.divider, marginTop: 18 }}>
      <Text style={text('kicker', { color: C.n600 })}>{n} · {label}</Text>
    </View>
  );
}
