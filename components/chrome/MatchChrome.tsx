/**
 * Match chrome (§4) — replaces all other chrome during a run. Score pane left,
 * rival ghost pane right on accent tint (its number ticking up in accent as the
 * recorded run replays), a 44px × to quit, and a 4px ghost-progress bar
 * beneath. Nothing else — no tabs, no coin balance.
 *
 * The live tick is driven by the run loop in stage 02/03; here it takes static
 * values so the frame is real. `progress` is 0..1 for the ghost bar.
 */
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, S, T } from '@/theme/tokens';
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
      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        {/* your score */}
        <View style={{ flex: 1, paddingHorizontal: S.inset, paddingVertical: 10, justifyContent: 'center' }}>
          <Text style={text('kicker', { color: C.n600 })}>You</Text>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 26, color: C.text, fontVariant: ['tabular-nums'] }}>
            {score.toLocaleString()}
          </Text>
        </View>

        {/* quit */}
        <Pressable onPress={onQuit} style={{ width: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 22, color: C.n700 }}>×</Text>
        </Pressable>

        {/* rival ghost */}
        <View style={{ flex: 1, paddingHorizontal: S.inset, paddingVertical: 10, backgroundColor: C.accentTint, justifyContent: 'center', alignItems: 'flex-end' }}>
          <Text style={text('kicker', { color: C.accentDeep })}>{rivalHandle}</Text>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 26, color: C.accent, fontVariant: ['tabular-nums'] }}>
            {ghost.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* 4px ghost-progress bar */}
      <View style={{ height: 4, backgroundColor: C.n300 }}>
        <View style={{ height: 4, width: `${clamped * 100}%`, backgroundColor: C.accent }} />
      </View>
    </View>
  );
}
