/**
 * Toast strip (§6, §03). A full-width ink bar with an 11px tracked label. Used
 * for the pin/unpin confirmations and the "SHELF FULL — UNPIN ONE FIRST"
 * refusal. No dialog, ever — the shelf-full case is a toast, not a modal.
 *
 * States: pin · unpin · refusal.
 */
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export type ToastKind = 'pin' | 'unpin' | 'refusal';

export function ToastStrip({ kind, label }: { kind: ToastKind; label: string }) {
  // A refusal gets a brief accent flash on the tracked label; pin/unpin stay ink.
  const flash = useSharedValue(kind === 'refusal' ? 1 : 0);
  useEffect(() => {
    if (kind === 'refusal') {
      flash.value = 1;
      flash.value = withTiming(0, { duration: 900 });
    }
  }, [kind, label, flash]);

  const labelStyle = useAnimatedStyle(() => ({
    color: flash.value > 0.5 ? C.accent : C.bg,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(120)}
      exiting={FadeOut.duration(160)}
      style={{ backgroundColor: C.text, paddingHorizontal: S.inset, paddingVertical: 12 }}
    >
      <Animated.Text style={[text('kicker', { color: C.bg }), labelStyle]}>{label}</Animated.Text>
    </Animated.View>
  );
}

/** Non-animated variant for the gallery, so all three states render at rest. */
export function ToastStripStatic({ label, refusal }: { label: string; refusal?: boolean }) {
  return (
    <View style={{ backgroundColor: C.text, paddingHorizontal: S.inset, paddingVertical: 12 }}>
      <Text style={text('kicker', { color: refusal ? C.accent : C.bg })}>{label}</Text>
    </View>
  );
}
