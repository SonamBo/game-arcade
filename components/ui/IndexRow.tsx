/**
 * Index row (§6, §03). The Browse row: a number, the name with a PINNED flag,
 * a sub-line, friends-on count, and the best right-aligned in a 54px column.
 * Pinned rows sit on accent tint. Long-press (420ms) toggles the pin.
 *
 * States: pinned (tinted) · unpinned · pressed (long-press).
 */
import { Pressable, Text, View } from 'react-native';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function IndexRow({
  index,
  name,
  subline,
  friendsOn,
  best,
  pinned,
  onPress,
  onLongPress,
}: {
  index: number;
  name: string;
  subline: string;
  friendsOn: number;
  best: number | null;
  pinned?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={420}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: MIN_TAP,
        paddingHorizontal: S.inset,
        paddingVertical: 10,
        gap: 12,
        backgroundColor: pressed ? C.surface : pinned ? C.accentTint : C.bg,
      })}
    >
      <Text style={[text('meta', { color: C.n500, numeric: true }), { width: 22 }]}>
        {`${index}`.padStart(2, '0')}
      </Text>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={text('rowTitle')}>{name}</Text>
          {pinned ? <Text style={text('kicker', { color: C.accentDeep })}>Pinned</Text> : null}
        </View>
        <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{subline}</Text>
      </View>

      <Text style={[text('meta', { color: C.n600, numeric: true }), { width: 28, textAlign: 'right' }]}>
        {friendsOn > 0 ? `${friendsOn}` : ''}
      </Text>

      <View style={{ width: 54, alignItems: 'flex-end' }}>
        <Text style={text('figure', { color: best == null ? C.n400 : C.text })}>
          {best == null ? '—' : best.toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}
