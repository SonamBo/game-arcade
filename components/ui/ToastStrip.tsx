/**
 * Toast strip — pin / unpin / refusal confirmations. Sentence case on a surface
 * pill, no ink bar, no uppercase. A refusal reads in magenta. Props unchanged.
 */
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { C, R, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export type ToastKind = 'pin' | 'unpin' | 'refusal';

export function ToastStrip({ kind, label }: { kind: ToastKind; label: string }) {
  const refusal = kind === 'refusal';
  return (
    <Animated.View
      entering={FadeIn.duration(120)}
      exiting={FadeOut.duration(160)}
      style={{ marginHorizontal: S.inset, backgroundColor: refusal ? C.urgentTint : C.surface, paddingHorizontal: 14, paddingVertical: 10, borderRadius: R.md }}
    >
      <Text style={text('meta', { color: refusal ? C.urgentDeep : C.n800 })}>{label}</Text>
    </Animated.View>
  );
}

/** Non-animated variant for the gallery and inline use. */
export function ToastStripStatic({ label, refusal }: { label: string; refusal?: boolean }) {
  return (
    <View style={{ marginHorizontal: S.inset, backgroundColor: refusal ? C.urgentTint : C.surface, paddingHorizontal: 14, paddingVertical: 10, borderRadius: R.md }}>
      <Text style={text('meta', { color: refusal ? C.urgentDeep : C.n800 })}>{label}</Text>
    </View>
  );
}
