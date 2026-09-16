/**
 * 02 · Home (§6.02). Hero card, then rails — "Your shelf" in ranked order, and
 * "Someone passed you" only when a rival is ahead. The old editorial rows and
 * 2-up seam grid are gone; ranking now shows as rail order, and a reason becomes
 * a tile's urgent meta line. Same rankInputs() call, same slicing.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { GameTile } from '@/components/ui/GameTile';
import { PosterBand } from '@/components/ui/PosterBand';
import { Rail } from '@/components/ui/Rail';
import { BandHeader, Button } from '@/components/ui/primitives';
import { GAME_COUNT, metaFor } from '@/data/catalogue';
import { rankInputs } from '@/data/seed';
import { rotationCountdown, todaysVariant, variantFriendsPlayed } from '@/data/variant';
import { useStore } from '@/store';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import type { RankInput } from '@/types/models';

function tileMeta(ri: RankInput): { meta: string; urgent: boolean } {
  if (ri.rivalAhead && ri.rivalHandle != null) {
    const delta = Math.abs((ri.rivalScore ?? 0) - (ri.best ?? 0));
    return { meta: `${ri.rivalHandle} +${delta}`, urgent: true };
  }
  if (ri.neverPlayed) return { meta: 'Never played', urgent: false };
  return { meta: `Best ${(ri.best ?? 0).toLocaleString()}`, urgent: false };
}

export default function Home() {
  const pinnedOrder = useStore((s) => s.pinnedOrder);
  const progress = useStore((s) => s.progress);

  const ranked = rankInputs(pinnedOrder, progress);
  const passed = ranked.filter((r) => r.rivalAhead);

  const v = todaysVariant();
  const poster = {
    kicker: "Today's variant",
    name: v.name,
    rule: v.rule,
    countdown: rotationCountdown(),
    friendsPlayed: variantFriendsPlayed(),
    topLine: 'Top: Meha 31',
    family: metaFor(v.gameId)?.family,
  };

  const openGame = (id: string) => router.navigate(`/game/${id}`);

  const tile = (ri: RankInput) => {
    const m = tileMeta(ri);
    return (
      <GameTile
        key={ri.game.id}
        family={ri.game.family}
        name={ri.game.name}
        meta={m.meta}
        metaUrgent={m.urgent}
        onPress={() => openGame(ri.game.id)}
        onLongPress={() => router.navigate('/browse')}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: S.rail }}>
          <PosterBand data={poster} onPlay={() => router.navigate(`/match/${v.gameId}?variant=1&source=poster`)} onSecondary={() => router.navigate('/drop')} />
        </View>

        {passed.length > 0 ? (
          <>
            <BandHeader kicker="Someone passed you" />
            <Rail>{passed.map(tile)}</Rail>
          </>
        ) : null}

        <BandHeader kicker="Your shelf" />
        <Rail>{ranked.map(tile)}</Rail>

        <View style={{ paddingHorizontal: S.inset, paddingTop: S.band, gap: 10 }}>
          <Button label={`Browse ${Math.max(0, GAME_COUNT - pinnedOrder.length)} more`} variant="secondary" full onPress={() => router.navigate('/browse')} />
          <Text style={text('meta', { color: C.n700 })}>Long-press any game to pin or unpin.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
