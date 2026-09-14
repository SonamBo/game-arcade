/**
 * Stat strip (§6). Two or three equal cells, a kicker over a figure. Used on
 * the game detail screen, the results banner strip and the profile grid.
 *
 * A cell's figure may be tinted accent — used for a beaten ghost score or
 * coins earned. Cells are divided by 1px vertical rules.
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
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: S.rule,
        borderBottomWidth: S.rule,
        borderColor: C.divider,
      }}
    >
      {cells.map((cell, i) => (
        <View
          key={cell.kicker}
          style={{
            flex: 1,
            paddingHorizontal: S.inset,
            paddingVertical: 14,
            borderRightWidth: i < cells.length - 1 ? S.hairline : 0,
            borderRightColor: C.divider,
          }}
        >
          <Text style={text('kicker', { color: C.n600 })}>{cell.kicker}</Text>
          <Text
            style={[text('figure', { color: cell.accent ? C.accent : C.text }), { marginTop: 4 }]}
          >
            {typeof cell.value === 'number' ? cell.value.toLocaleString() : cell.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
