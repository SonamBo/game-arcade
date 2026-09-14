/**
 * Shelf tile (§6, §02c). The pinned-games grid item: name, family label
 * right-aligned, and best-or-"NEVER PLAYED" at the bottom. No reason lines —
 * ranking order is the only signal on the shelf grid.
 *
 * Grid mechanics live on the parent: a divider-coloured container with 2px
 * gaps; tiles are background-coloured. Tile min-height 62 (2-up).
 * States: played · never played · pinned.
 */
import { Pressable, Text, View } from 'react-native';

import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function ShelfTile({
  name,
  family,
  best,
  unit,
  onPress,
  onLongPress,
}: {
  name: string;
  family: string;
  best: number | null;
  unit: string;
  onPress?: () => void;
  onLongPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={420}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 62,
        backgroundColor: pressed ? C.surface : C.bg,
        padding: 10,
        justifyContent: 'space-between',
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={text('rowTitle')}>{name}</Text>
        <Text style={text('kicker', { color: C.n500 })}>{family}</Text>
      </View>
      {best == null ? (
        <Text style={text('kicker', { color: C.accentDeep })}>Never played</Text>
      ) : (
        <Text style={text('meta', { color: C.n600, numeric: true })}>
          Best {best.toLocaleString()} {unit}
        </Text>
      )}
    </Pressable>
  );
}

/** A 2-up grid of tiles with the spec's 2px divider seams. */
export function ShelfGrid({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: C.divider, gap: S.gap }}>
      {children}
    </View>
  );
}

/** One 2-up row inside a ShelfGrid. */
export function ShelfRow({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: S.gap }}>{children}</View>;
}
