/**
 * Notification row (§11) — no rules. A sentence in T.body with a timestamp in
 * T.meta beneath, and a single-verb cyan link. The unread dot is magenta when it
 * needs an answer, cyan otherwise. The whole row is tappable at 48px minimum.
 * Props unchanged.
 */
import { Pressable, Text, View } from 'react-native';

import { Button, Dot } from './primitives';
import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function NotificationRow({
  kind,
  message,
  time,
  verb,
  actionable,
  onVerb,
}: {
  kind: string;
  message: string;
  time: string;
  verb: string;
  actionable?: boolean;
  onVerb?: () => void;
}) {
  return (
    <Pressable
      onPress={onVerb}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: S.rail,
        minHeight: MIN_TAP,
        paddingHorizontal: S.inset,
        paddingVertical: S.row,
        backgroundColor: pressed ? C.n100 : C.bg,
      })}
    >
      <View style={{ width: 8, alignItems: 'center' }}>
        <Dot color={actionable ? C.urgent : C.accent} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={text('body')}>{message}</Text>
        <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{kind.toLowerCase()} · {time}</Text>
      </View>
      <Button label={verb} variant="ghost" onPress={onVerb} />
    </Pressable>
  );
}
