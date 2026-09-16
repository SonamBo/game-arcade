/**
 * Game tile (§5.5) — art first, name beneath, one meta line. Replaces
 * ShelfTile/ShelfGrid/ShelfRow. 116px plate; the meta line is n700, or
 * urgentDeep when a rival has passed you (one figure per item, §2 rule 05).
 * Selected state (onboarding) is a 2px cyan ring, never a colour change.
 */
import { Pressable, Text, View } from 'react-native';

import { Plate } from './Plate';
import { C, R } from '@/theme/tokens';
import { text } from '@/theme/type';
import type { Family } from '@/types/models';

export const TILE = 116;

export function GameTile({
  family,
  name,
  meta,
  metaUrgent,
  selected,
  onPress,
  onLongPress,
}: {
  family: Family;
  name: string;
  meta?: string;
  metaUrgent?: boolean;
  selected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={420} style={{ width: TILE }}>
      <View
        style={{
          width: TILE,
          height: TILE,
          borderRadius: R.lg + 2,
          padding: selected ? 2 : 0,
          borderWidth: selected ? 2 : 0,
          borderColor: selected ? C.accent : 'transparent',
        }}
      >
        <Plate family={family} size={selected ? TILE - 4 : TILE} />
      </View>
      <Text style={[text('rowTitle'), { marginTop: 10 }]} numberOfLines={1}>{name}</Text>
      {meta ? (
        <Text style={[text('meta', { color: metaUrgent ? C.urgentDeep : C.n700 }), { marginTop: 2 }]} numberOfLines={1}>
          {meta}
        </Text>
      ) : null}
    </Pressable>
  );
}
