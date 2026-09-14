/**
 * Editorial game row (§6, §02b). The ranked-shelf row: a 54px ink code block
 * that taps straight into a run, the name, a neutral meta line, and — on the
 * top three only — a reason line in accent. Right column carries the player's
 * best with its unit beneath.
 *
 * States: rival ahead (reason present) · never played · neutral.
 */
import { Pressable, Text, View } from 'react-native';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function EditorialRow({
  code,
  name,
  meta,
  reason,
  best,
  unit,
  neverPlayed,
  onPress,
}: {
  code: string;
  name: string;
  meta: string;
  /** Accent reason line — pass only for the top three ranked rows. */
  reason?: string;
  best: number | null;
  unit: string;
  neverPlayed?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'stretch',
        minHeight: MIN_TAP + 20,
        paddingHorizontal: S.inset,
        paddingVertical: S.row,
        gap: 12,
        backgroundColor: pressed ? C.surface : C.bg,
      })}
    >
      {/* 54px ink code block */}
      <View
        style={{
          width: 54,
          height: 54,
          backgroundColor: C.text,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={text('kicker', { color: C.bg })}>{code}</Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={text('rowTitle')}>{name}</Text>
        <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{meta}</Text>
        {reason ? (
          <Text style={[text('kicker', { color: C.accentDeep }), { marginTop: 4 }]}>{reason}</Text>
        ) : null}
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'flex-end', minWidth: 54 }}>
        {neverPlayed || best == null ? (
          <Text style={text('figure', { color: C.n400 })}>—</Text>
        ) : (
          <>
            <Text style={text('figure')}>{best.toLocaleString()}</Text>
            <Text style={text('meta', { color: C.n600 })}>{unit}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}
