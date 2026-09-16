/**
 * List row (§5.6) — for Browse and any long list where 116px tiles would waste
 * the screen. A 56px family plate, the name, one meta line, one figure with no
 * unit, and a bookmark mark for pin state. No rules; 76px min height and the
 * plate's edge give the rhythm.
 *
 * Props are unchanged except for the additive `family` (needed for the plate)
 * and optional `rival` tag — both structural changes §6.03 names.
 */
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Plate } from './Plate';
import { Tag } from './primitives';
import { C, MIN_TAP, R, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import type { Family } from '@/types/models';

function Bookmark({ filled }: { filled: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Path
        d="M4 2 h10 v14 l-5 -4 -5 4 Z"
        fill={filled ? C.accent : 'none'}
        stroke={filled ? C.accent : C.n500}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IndexRow({
  index,
  name,
  subline,
  friendsOn,
  best,
  pinned,
  family = 'TAP',
  rivalTag,
  onPress,
  onLongPress,
}: {
  index?: number;
  name: string;
  subline: string;
  friendsOn?: number;
  best: number | null;
  pinned?: boolean;
  family?: Family;
  rivalTag?: string;
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
        minHeight: 76,
        paddingHorizontal: S.inset,
        paddingVertical: S.row,
        gap: S.rail,
        backgroundColor: pressed ? C.n100 : C.bg,
      })}
    >
      <Plate family={family} size={56} radius={R.md} markSize={28} />

      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <Text style={text('rowTitle')} numberOfLines={1}>{name}</Text>
        {rivalTag ? <Tag kind="rival" label={rivalTag} /> : <Text style={text('meta', { color: C.n700 })} numberOfLines={1}>{subline}</Text>}
      </View>

      <Text style={text('figure', { color: best == null ? C.n500 : C.text })}>
        {best == null ? '—' : best.toLocaleString()}
      </Text>

      <View style={{ width: 24, height: MIN_TAP, alignItems: 'center', justifyContent: 'center' }}>
        <Bookmark filled={!!pinned} />
      </View>
    </Pressable>
  );
}
