/**
 * Leaderboard row (§6.04) — position, name, score. No hairlines, no tint. The
 * player's own row is marked by a cyan left rail; a global entry is labelled.
 * Props unchanged.
 */
import { Text, View } from 'react-native';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function LeaderboardRow({
  position,
  handle,
  score,
  self,
  global,
}: {
  position: number;
  handle: string;
  score: number;
  self?: boolean;
  global?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: MIN_TAP, paddingRight: S.inset, gap: 12 }}>
      <View style={{ width: 3, alignSelf: 'stretch', backgroundColor: self ? C.accent : 'transparent' }} />
      <Text style={[text('meta', { color: C.n700, numeric: true }), { width: 20 }]}>{position}</Text>
      <Text style={[text('rowTitle', { color: self ? C.text : C.n800 }), { flex: 1 }]}>
        {handle}
        {global ? <Text style={text('meta', { color: C.n700 })}>{'  global'}</Text> : null}
      </Text>
      <Text style={text('figure', { numeric: true })}>{score.toLocaleString()}</Text>
    </View>
  );
}
