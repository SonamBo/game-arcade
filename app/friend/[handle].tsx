/**
 * 14 · Friend profile (§6.14). Mirrors Profile: 72px neutral circle, handle in
 * T.title, meta lines beneath. The head-to-head is one line — "You lead 7 to 4"
 * — with the number in T.figure, magenta if you are behind. A rail of the games
 * you both play follows, with your delta as each tile's meta line.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { GameTile } from '@/components/ui/GameTile';
import { Rail } from '@/components/ui/Rail';
import { BandHeader, Button } from '@/components/ui/primitives';
import { metaFor } from '@/data/catalogue';
import { friendProfile } from '@/data/social';
import { useStore } from '@/store';
import { C, R, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function FriendProfile() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const progress = useStore((s) => s.progress);
  const p = friendProfile(String(handle ?? 'ravi'), progress);
  const behind = p.h2h.you < p.h2h.them;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label={p.handle} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', gap: S.rail, paddingHorizontal: S.inset, paddingTop: S.rail, alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, borderRadius: R.pill, backgroundColor: C.n300, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={text('title', { color: C.n800 })}>{p.initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={text('title')}>{p.handle}</Text>
            <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{p.mutuals} mutuals</Text>
            <Text style={text('meta', { color: C.n700 })}>{p.presence}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: S.inset, paddingTop: S.band }}>
          <Text style={text('meta', { color: C.n700 })}>Head to head</Text>
          <Text style={{ marginTop: 4 }}>
            <Text style={text('body')}>{behind ? 'They lead ' : 'You lead '}</Text>
            <Text style={{ fontFamily: T.figure.fontFamily, fontSize: T.figure.fontSize, color: behind ? C.urgentDeep : C.text, fontVariant: ['tabular-nums'] }}>
              {p.h2h.you} to {p.h2h.them}
            </Text>
          </Text>
          <Text style={[text('meta', { color: C.n700 }), { marginTop: 4 }]}>{p.h2h.note}</Text>
        </View>

        <BandHeader kicker="Where you both play" />
        <Rail>
          {p.beats.map((b) => {
            const m = metaFor(b.gameId);
            const behindHere = b.lead === 'them';
            const delta = Math.abs(b.them - b.you);
            return (
              <GameTile
                key={b.gameId}
                family={m?.family ?? 'TAP'}
                name={b.name}
                meta={behindHere ? `${p.handle} +${delta}` : `You +${delta}`}
                metaUrgent={behindHere}
                onPress={() => router.navigate(`/match/${b.gameId}?source=duel`)}
              />
            );
          })}
        </Rail>

        <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: S.inset, paddingTop: S.band }}>
          <View style={{ flex: 1 }}>
            <Button label="Challenge" variant="primary" full onPress={() => router.navigate(`/match/${p.beats[0]?.gameId ?? 'stack'}?source=duel`)} />
          </View>
          <Button label="Following" variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}
