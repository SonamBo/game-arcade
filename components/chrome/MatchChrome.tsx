/**
 * Match HUD (§5.7). Your score is the biggest thing on screen (T.display); the
 * ghost sits beside it in magenta at T.figure — this is the rivalry number, the
 * one place magenta is correct during play. No split cells, no tint. Quit is a
 * 44px neutral circle, right-aligned. A thin cyan line shows progress toward the
 * ghost. Nothing else may be on screen during a run.
 *
 * Props unchanged from v1 (score, rivalHandle, ghost, progress, onQuit).
 */
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, R, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export function MatchChrome({
  score,
  rivalHandle,
  ghost,
  progress,
  onQuit,
}: {
  score: number;
  rivalHandle: string;
  ghost: number;
  progress: number;
  onQuit?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 20, paddingHorizontal: S.inset, paddingTop: 14, paddingBottom: 14 }}>
        <View>
          <Text style={text('micro', { color: C.n700, uppercase: true })}>You</Text>
          <Text style={[{ fontFamily: T.display.fontFamily, fontSize: T.display.fontSize, color: C.text, fontVariant: ['tabular-nums'] }, { marginTop: 2 }]}>
            {score.toLocaleString()}
          </Text>
        </View>
        <View style={{ paddingBottom: 5 }}>
          <Text style={text('micro', { color: C.urgentDeep, uppercase: true })}>{rivalHandle} · ghost</Text>
          <Text style={[{ fontFamily: T.figure.fontFamily, fontSize: T.figure.fontSize, color: C.urgentDeep, fontVariant: ['tabular-nums'] }, { marginTop: 2 }]}>
            {ghost.toLocaleString()}
          </Text>
        </View>
        <Pressable
          onPress={onQuit}
          hitSlop={8}
          style={{ marginLeft: 'auto', width: 44, height: 44, borderRadius: R.pill, backgroundColor: C.n200, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 20, color: C.n800 }}>×</Text>
        </Pressable>
      </View>

      {/* thin cyan progress toward the ghost */}
      <View style={{ height: 3, backgroundColor: C.n300 }}>
        <View style={{ height: 3, width: `${clamped * 100}%`, backgroundColor: C.accent }} />
      </View>
    </View>
  );
}
