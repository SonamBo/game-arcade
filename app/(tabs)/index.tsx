/**
 * 02 · Home — the ranked shelf. Four bands: the daily drop poster, three
 * editorial "ranked for you" rows (reason lines on the top three only), the
 * remaining pinned games as a 2-up grid, and a footer that opens Browse.
 *
 * Ranking is the shared rankInputs() path — the same one the auto-queue uses —
 * so the shelf and the queue can never disagree (build brief §5). Rival-ahead
 * first, then never-played, ties broken by friends-on.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { EditorialRow } from '@/components/ui/EditorialRow';
import { PosterBand } from '@/components/ui/PosterBand';
import { BandHeader, Button, Rule } from '@/components/ui/primitives';
import { ShelfGrid, ShelfRow, ShelfTile } from '@/components/ui/ShelfTile';
import { GAME_COUNT } from '@/data/catalogue';
import { rankInputs } from '@/data/seed';
import { rotationCountdown, todaysVariant, variantFriendsPlayed } from '@/data/variant';
import { useStore } from '@/store';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import { reasonLine } from '@/types/models';

export default function Home() {
  const pinnedOrder = useStore((s) => s.pinnedOrder);
  const progress = useStore((s) => s.progress);

  const ranked = rankInputs(pinnedOrder, progress);
  const editorial = ranked.slice(0, 3);
  const grid = ranked.slice(3, 12);

  const v = todaysVariant();
  const poster = {
    kicker: "TODAY'S VARIANT",
    name: v.name,
    rule: v.rule,
    countdown: rotationCountdown(),
    friendsPlayed: variantFriendsPlayed(),
    topLine: 'Top: MEHA 31',
  };

  const openGame = (id: string) => router.navigate(`/game/${id}`);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <PosterBand data={poster} onPlay={() => router.navigate(`/match/${v.gameId}?variant=1&source=poster`)} onSecondary={() => router.navigate('/drop')} />

        <BandHeader kicker="Ranked for you" />
        {editorial.map((ri) => {
          const runs = progress[ri.game.id]?.runs ?? 0;
          return (
            <EditorialRow
              key={ri.game.id}
              code={ri.game.code}
              name={ri.game.name}
              meta={ri.neverPlayed ? `${ri.game.family} · never played` : `${ri.game.family} · ${runs} runs`}
              reason={reasonLine(ri)}
              best={ri.neverPlayed ? null : ri.best ?? null}
              unit={ri.game.unit}
              neverPlayed={ri.neverPlayed}
              onPress={() => openGame(ri.game.id)}
            />
          );
        })}

        {grid.length > 0 ? (
          <>
            <BandHeader kicker="Your shelf" />
            <ShelfGrid>
              {chunk(grid, 2).map((row, i) => (
                <ShelfRow key={i}>
                  {row.map((ri) => (
                    <ShelfTile
                      key={ri.game.id}
                      name={ri.game.name}
                      family={ri.game.family}
                      best={ri.neverPlayed ? null : ri.best ?? null}
                      unit={ri.game.unit}
                      onPress={() => openGame(ri.game.id)}
                      onLongPress={() => router.navigate('/browse')}
                    />
                  ))}
                  {row.length === 1 ? <View style={{ flex: 1, backgroundColor: C.bg }} /> : null}
                </ShelfRow>
              ))}
            </ShelfGrid>
          </>
        ) : null}

        <View style={{ paddingHorizontal: S.inset, paddingTop: 22, gap: 10 }}>
          <Button label={`Browse ${Math.max(0, GAME_COUNT - pinnedOrder.length)} more`} variant="outlined" full onPress={() => router.navigate('/browse')} />
          <Text style={text('meta', { color: C.n600 })}>Long-press any game to pin or unpin.</Text>
        </View>

        <View style={{ paddingTop: 20 }}>
          <Rule />
        </View>
      </ScrollView>
    </View>
  );
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}
