/**
 * Notification row (§6, §14). A 6px vertical mark (accent when actionable,
 * neutral otherwise), a kicker naming the type, the message at 13px/600, a
 * timestamp, and a single-verb button. Actionable rows sit on accent tint.
 * Every game-related action launches the run directly — none open another
 * screen first.
 *
 * States: actionable (tinted) · informational.
 */
import { Text, View } from 'react-native';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import { Button } from './primitives';

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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: MIN_TAP,
        paddingRight: S.inset,
        gap: 12,
        backgroundColor: actionable ? C.accentTint : C.bg,
      }}
    >
      {/* 6px vertical mark */}
      <View style={{ width: 6, alignSelf: 'stretch', backgroundColor: actionable ? C.accent : C.n400 }} />

      <View style={{ flex: 1, paddingVertical: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={text('kicker', { color: actionable ? C.accentDeep : C.n600 })}>{kind}</Text>
          <Text style={text('meta', { color: C.n500, numeric: true })}>{time}</Text>
        </View>
        <Text style={[{ fontFamily: 'Archivo_600SemiBold', fontSize: 13, color: C.text, lineHeight: 18 }, { marginTop: 2 }]}>
          {message}
        </Text>
      </View>

      <Button label={verb} variant={actionable ? 'accent' : 'outlined'} onPress={onVerb} />
    </View>
  );
}
