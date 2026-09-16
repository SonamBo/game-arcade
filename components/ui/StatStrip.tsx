/**
 * Stat strip (§6.04) — three figures in a row with a T.meta label above each.
 * No rules, no tint. One figure per cell.
 */
import { Text, View } from 'react-native';

import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export interface StatCell {
  kicker: string;
  value: string | number;
  accent?: boolean;
}

export function StatStrip({ cells }: { cells: StatCell[] }) {
  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: S.inset, gap: S.card }}>
      {cells.map((cell) => (
        <View key={cell.kicker} style={{ flex: 1, gap: 4 }}>
          <Text style={text('meta', { color: C.n700 })}>{cell.kicker}</Text>
          <Text style={text('figure')}>
            {typeof cell.value === 'number' ? cell.value.toLocaleString() : cell.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
