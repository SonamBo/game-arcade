/**
 * Queue ring (§6, §06d). A 46px ring counting three seconds down with the digit
 * inside, "NEXT UP · AUTO-LOADING", the next game, its reason line, and "TAP TO
 * CANCEL". Tapping the row cancels and replaces it with an outlined play button
 * and the line "Queue stopped. <GAME> is still waiting on your shelf." — the
 * suggestion survives the cancel.
 *
 * The conic-gradient sweep and the live countdown animate in stage 03, driven by
 * the run loop; here the ring renders at `seconds` with a static accent arc so
 * the anatomy and both states are real. States: counting · cancelled.
 *
 * (The ring is a genuine circle — the product's zero-radius rule is about
 * rectangles, not a countdown dial.)
 */
import { Pressable, Text, View } from 'react-native';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import { Button } from './primitives';

export function QueueRing({
  seconds,
  nextName,
  reason,
  cancelled,
  onCancel,
  onPlay,
}: {
  seconds: number;
  nextName: string;
  reason: string;
  cancelled?: boolean;
  onCancel?: () => void;
  onPlay?: () => void;
}) {
  if (cancelled) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: MIN_TAP,
          paddingHorizontal: S.inset,
          paddingVertical: 12,
          gap: 12,
        }}
      >
        <Text style={[text('body', { color: C.n700 }), { flex: 1 }]}>
          Queue stopped. {nextName} is still waiting on your shelf.
        </Text>
        <Button label="Play" variant="outlined" onPress={onPlay} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onCancel}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: MIN_TAP + 12,
        paddingHorizontal: S.inset,
        paddingVertical: 12,
        gap: 14,
        backgroundColor: pressed ? C.surface : C.bg,
      })}
    >
      {/* 46px ring with the digit */}
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          borderWidth: 3,
          borderColor: C.n300,
          borderTopColor: C.accent,
          borderRightColor: C.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={text('rowTitle', { numeric: true })}>{seconds}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={text('kicker', { color: C.n600 })}>Next up · auto-loading</Text>
        <Text style={[text('rowTitle'), { marginTop: 2 }]}>{nextName}</Text>
        <Text style={[text('kicker', { color: C.accentDeep }), { marginTop: 2 }]}>{reason}</Text>
      </View>

      <Text style={text('kicker', { color: C.n600 })}>Tap to cancel</Text>
    </Pressable>
  );
}
