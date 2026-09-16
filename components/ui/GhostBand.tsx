/**
 * Ghost band (§6.04) — the rivalry on the detail screen. No tint: the rival's
 * name and number sit on paper, in magenta only when they are ahead of you
 * (a rival who passed you). A cyan Race button. Props unchanged.
 */
import { Text, View } from 'react-native';

import { Button } from './primitives';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

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
  const ahead = state === 'rival-ahead';
  const numColor = ahead ? C.urgentDeep : C.text;
  const label = state === 'global-rival' ? 'Global rival' : ahead ? `${handle} passed you` : "You're ahead";
  const context =
    state === 'player-ahead'
      ? `You lead. Recorded ${recorded}, their ghost races you live.`
      : `Recorded ${recorded}. Their ghost races you live.`;

  return (
    <View style={{ paddingHorizontal: S.inset, paddingTop: S.band }}>
      <Text style={text('meta', { color: ahead ? C.urgentDeep : C.n700 })}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginTop: 6 }}>
        <View style={{ flex: 1 }}>
          <Text style={text('rowTitle')}>
            {handle}{'  '}
            <Text style={{ fontFamily: T.figure.fontFamily, fontSize: T.figure.fontSize, color: numColor, fontVariant: ['tabular-nums'] }}>
              {score.toLocaleString()}
            </Text>
            <Text style={text('meta', { color: C.n700 })}>{`  ${unit}`}</Text>
          </Text>
          <Text style={[text('meta', { color: C.n700 }), { marginTop: 4 }]}>{context}</Text>
        </View>
        <Button label="Race" variant="primary" onPress={onRace} />
      </View>
    </View>
  );
}
