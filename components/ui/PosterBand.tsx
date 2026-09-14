/**
 * Poster band (§6, §02a). Full-bleed accent field: kicker + countdown, a
 * 42-46px name, a rule line, an inverse PLAY button, and a secondary line.
 *
 * Two states, mutually exclusive: the daily variant and the weekly new game.
 * This is one of the four things the accent is reserved for.
 */
import { Text, View } from 'react-native';

import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';
import { Button } from './primitives';

export interface PosterData {
  kicker: string;
  name: string;
  rule: string;
  countdown: string;
  friendsPlayed: number;
  topLine: string;
}

export function PosterBand({
  data,
  onPlay,
  onSecondary,
}: {
  data: PosterData;
  onPlay?: () => void;
  onSecondary?: () => void;
}) {
  return (
    <View style={{ backgroundColor: C.accent, paddingHorizontal: S.inset, paddingVertical: 18 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={text('kicker', { color: C.bg })}>{data.kicker}</Text>
        <Text style={text('kicker', { color: C.bg, numeric: true })}>{data.countdown}</Text>
      </View>

      <Text
        style={[
          { fontFamily: T.display.fontFamily, fontSize: 44, letterSpacing: -1.6, color: C.bg, lineHeight: 46 },
        ]}
      >
        {data.name}
      </Text>

      {/* rule line — inverse ground colour on the accent field */}
      <View style={{ height: S.hairline, backgroundColor: C.bg, opacity: 0.5, marginVertical: 12 }} />

      <Text style={[text('body', { color: C.bg }), { marginBottom: 14 }]}>{data.rule}</Text>

      <Button label="Play now" variant="inverse" onPress={onPlay} />

      <Text
        onPress={onSecondary}
        style={[text('meta', { color: C.bg }), { marginTop: 12, opacity: 0.9 }]}
      >
        {data.friendsPlayed > 0 ? `${data.friendsPlayed} friends played` : data.topLine}
        {data.friendsPlayed > 0 ? `  ·  ${data.topLine}` : ''}
      </Text>
    </View>
  );
}
