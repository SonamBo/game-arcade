/**
 * Ghost band (§6, §04). On accent tint: the rival's name and score, a context
 * line, and an accent RACE button. The header ticker is what sells the race,
 * so this band is where a rivalry lives on the detail screen.
 *
 * States: rival ahead · player ahead · global rival (labelled, never faked).
 */
import { Text, View } from 'react-native';

import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import { Button } from './primitives';

export type GhostState = 'rival-ahead' | 'player-ahead' | 'global-rival';

export function GhostBand({
  handle,
  score,
  unit,
  state,
  recorded = '2h ago',
  onRace,
}: {
  handle: string;
  score: number;
  unit: string;
  state: GhostState;
  recorded?: string;
  onRace?: () => void;
}) {
  const label =
    state === 'global-rival' ? 'GLOBAL RIVAL' : state === 'player-ahead' ? "YOU'RE AHEAD" : 'RIVAL AHEAD';
  const context =
    state === 'player-ahead'
      ? `You lead. Recorded ${recorded}. Their ghost races you live.`
      : `Recorded ${recorded}. Their ghost races you live.`;

  return (
    <View style={{ backgroundColor: C.accentTint, paddingHorizontal: S.inset, paddingVertical: 14 }}>
      <Text style={text('kicker', { color: C.accentDeep })}>{label}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 6,
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={text('rowTitle')}>
            {handle}{' '}
            <Text style={text('rowTitle', { color: C.accentDeep, numeric: true })}>
              {score.toLocaleString()} {unit}
            </Text>
          </Text>
          <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{context}</Text>
        </View>
        <Button label="Race it" variant="accent" onPress={onRace} />
      </View>
    </View>
  );
}
