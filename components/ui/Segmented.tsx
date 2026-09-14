/**
 * A two-or-more-way switch used by the feed (FRIENDS / GLOBAL), the duel list,
 * and the detail leaderboard (FRIENDS / GLOBAL / THIS WEEK). The selected chip
 * is inverted to ink; a right-aligned population note is optional.
 */
import { Pressable, Text, View } from 'react-native';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function Segmented({
  options,
  value,
  onChange,
  note,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  note?: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: S.rule,
        borderBottomColor: C.divider,
        paddingRight: S.inset,
      }}
    >
      {options.map((opt) => {
        const selected = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              minHeight: MIN_TAP,
              justifyContent: 'center',
              paddingHorizontal: S.inset,
              backgroundColor: selected ? C.text : 'transparent',
            }}
          >
            <Text style={text('kicker', { color: selected ? C.bg : C.n600 })}>{opt}</Text>
          </Pressable>
        );
      })}
      <View style={{ flex: 1 }} />
      {note ? <Text style={text('meta', { color: C.n500, numeric: true })}>{note}</Text> : null}
    </View>
  );
}
