/**
 * 15 · Gallery (§6.15). The screen this direction was made for: a 3-up grid of
 * 116px plates, grouped into bands by family with a T.band head over each. No
 * seams, no labels on the plates — forty games as a catalogue worth browsing.
 */
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackBar } from '@/components/chrome/BackBar';
import { GameTile } from '@/components/ui/GameTile';
import { BandHeader } from '@/components/ui/primitives';
import { GAMES } from '@/data/catalogue';
import { useStore } from '@/store';
import { C, S } from '@/theme/tokens';
import type { Family } from '@/types/models';

const FAMILY_ORDER: Family[] = ['TAP', 'SWIPE', 'TIMING', 'NUMBERS', 'MEMORY'];
const FAMILY_LABEL: Record<Family, string> = {
  TAP: 'Tap', SWIPE: 'Swipe', TIMING: 'Timing', NUMBERS: 'Numbers', MEMORY: 'Memory',
};

export default function Gallery() {
  const insets = useSafeAreaInsets();
  const progress = useStore((s) => s.progress);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Gallery" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {FAMILY_ORDER.map((fam) => {
          const games = GAMES.filter((g) => g.family === fam);
          if (games.length === 0) return null;
          return (
            <View key={fam}>
              <BandHeader kicker={FAMILY_LABEL[fam]} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: S.inset, gap: S.rail }}>
                {games.map((g) => {
                  const p = progress[g.id];
                  const played = (p?.runs ?? 0) > 0;
                  return (
                    <GameTile
                      key={g.id}
                      family={g.family}
                      name={g.name}
                      meta={played ? `Best ${p!.best.toLocaleString()}` : 'Never played'}
                      onPress={() => router.navigate(`/game/${g.id}`)}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
