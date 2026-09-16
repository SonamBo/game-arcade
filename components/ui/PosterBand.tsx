/**
 * Hero card (§5.4). The former full-bleed poster is now a contained card: a
 * 16:10 art plate over a surface body, radius R.lg, E.md, inset from both edges.
 * The countdown lives in the live tag, not the corner. Nothing here is red and
 * no text sits on the art. Props unchanged except the additive `family`.
 */
import { View, Text } from 'react-native';

import { DotScreen } from './Plate';
import { Button, Tag } from './primitives';
import { FamilyMark } from './icons';
import { markFor, plateFor } from '@/theme/plates';
import { C, E, R, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import type { Family } from '@/types/models';

export interface PosterData {
  kicker: string;
  name: string;
  rule: string;
  countdown: string;
  friendsPlayed: number;
  topLine: string;
  family?: Family;
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
  const family = data.family ?? 'TAP';
  return (
    <View style={[{ marginHorizontal: S.inset, backgroundColor: C.surface, borderRadius: R.lg, overflow: 'hidden' }, E.md]}>
      {/* 16:10 art plate — dot-screened, family mark, no text on it */}
      <View style={{ width: '100%', aspectRatio: 16 / 10, backgroundColor: plateFor(family), alignItems: 'center', justifyContent: 'center' }}>
        <DotScreen />
        <FamilyMark name={markFor(family)} size={72} color={C.text} />
      </View>

      <View style={{ padding: S.card }}>
        <Tag kind="live" label={`Live · ${data.countdown}`} />
        <Text style={[text('title'), { marginTop: 12 }]}>{data.name}</Text>
        <Text style={[text('body', { color: C.n800 }), { marginTop: 8 }]}>{data.rule}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20 }}>
          <Button label="Play" variant="primary" onPress={onPlay} />
          <Text style={text('meta', { color: C.n700 })} onPress={onSecondary}>
            {data.friendsPlayed > 0 ? `${data.friendsPlayed} friends played` : data.topLine}
          </Text>
        </View>
      </View>
    </View>
  );
}
