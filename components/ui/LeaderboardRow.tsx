/**
 * Leaderboard row (§6, §04). Position, name, score. The player's own row is
 * tinted; a global entry is labelled. Scores are tabular so a column of them
 * does not jitter.
 *
 * States: self (tinted) · friend · global.
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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: MIN_TAP,
        paddingHorizontal: S.inset,
        gap: 12,
        backgroundColor: self ? C.accentTint : C.bg,
      }}
    >
      <Text style={[text('meta', { color: C.n500, numeric: true }), { width: 22 }]}>{position}</Text>
      <Text style={[text('rowTitle'), { flex: 1 }]}>
        {handle}
        {global ? <Text style={text('kicker', { color: C.n500 })}>{'  GLOBAL'}</Text> : null}
      </Text>
      <Text style={text('figure', { numeric: true })}>{score.toLocaleString()}</Text>
    </View>
  );
}
