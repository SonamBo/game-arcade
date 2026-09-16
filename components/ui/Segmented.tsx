/**
 * Segmented control — family filter and the feed switch. Cyan selection: the
 * selected label is cyan with a 2px cyan underline; the rest sit at the n700
 * floor. No ink fill, no rules. Props unchanged.
 */
import { Pressable, ScrollView, Text, View } from 'react-native';

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
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: S.inset }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.inset, gap: 4, alignItems: 'center' }} style={{ flex: 1 }}>
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={{ minHeight: MIN_TAP, justifyContent: 'center', paddingHorizontal: 10 }}
            >
              <Text style={text('rowTitle', { color: selected ? C.accent : C.n700 })}>{opt}</Text>
              <View style={{ height: 2, marginTop: 4, backgroundColor: selected ? C.accent : 'transparent' }} />
            </Pressable>
          );
        })}
      </ScrollView>
      {note ? <Text style={text('meta', { color: C.n700, numeric: true })}>{note}</Text> : null}
    </View>
  );
}
