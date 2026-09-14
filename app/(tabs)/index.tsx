/**
 * 02 · Home — the ranked shelf. Four bands: the daily drop poster, three
 * editorial "ranked for you" rows (reason lines on the top three only), the
 * pinned games as a 2-up grid, and a footer that opens Browse.
 *
 * Ranking is illustrative here; the real rankScore()-ordered shelf lands at
 * stage 05 when the catalogue exists.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { EditorialRow } from '@/components/ui/EditorialRow';
import { PosterBand } from '@/components/ui/PosterBand';
import { BandHeader, Button, Rule } from '@/components/ui/primitives';
import { ShelfGrid, ShelfRow, ShelfTile } from '@/components/ui/ShelfTile';
import { SAMPLE_DROP, SAMPLE_GAMES } from '@/data/samples';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Home() {
  const ranked = SAMPLE_GAMES.slice(0, 3);
  const pinned = SAMPLE_GAMES.filter((g) => g.pinned);

  const openGame = (id: string) => router.navigate(`/game/${id}`);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <PosterBand data={SAMPLE_DROP} onPlay={() => openGame('stack')} onSecondary={() => router.navigate('/drop')} />

        <BandHeader kicker="Ranked for you" />
        {ranked.map((g) => (
          <EditorialRow
            key={g.id}
            code={g.code}
            name={g.name}
            meta={`${g.family} · ${g.runs} runs`}
            reason={
              g.rival
                ? `${g.rival.handle} BEAT YOU BY ${g.rival.by}`
                : g.neverPlayed
                  ? `${g.friendsOn} FRIENDS PLAY THIS · YOU NEVER HAVE`
                  : `QUEST 1/3 · ${g.friendsOn} FRIENDS ON TODAY`
            }
            best={g.best}
            unit={g.unit}
            neverPlayed={g.neverPlayed}
            onPress={() => openGame(g.id)}
          />
        ))}

        <BandHeader kicker="Your shelf" />
        <ShelfGrid>
          {chunk(pinned, 2).map((row, i) => (
            <ShelfRow key={i}>
              {row.map((g) => (
                <ShelfTile
                  key={g.id}
                  name={g.name}
                  family={g.family}
                  best={g.best}
                  unit={g.unit}
                  onPress={() => openGame(g.id)}
                  onLongPress={() => router.navigate('/browse')}
                />
              ))}
              {row.length === 1 ? <View style={{ flex: 1, backgroundColor: C.bg }} /> : null}
            </ShelfRow>
          ))}
        </ShelfGrid>

        <View style={{ paddingHorizontal: S.inset, paddingTop: 22, gap: 10 }}>
          <Button label="Browse 28 more" variant="outlined" full onPress={() => router.navigate('/browse')} />
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
