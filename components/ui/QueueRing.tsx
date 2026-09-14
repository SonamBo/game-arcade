/**
 * Queue ring (§6, §06d). A 46px ring counting three seconds down with the digit
 * inside, "NEXT UP · AUTO-LOADING", the next game, its accent reason line, and
 * "TAP TO CANCEL". Tapping anywhere on the row cancels and replaces it with
 * "Queue stopped. <GAME> is still waiting on your shelf." plus an outlined play
 * button — the suggestion survives the cancel.
 *
 * The ring owns its own countdown: a Reanimated sweep for the arc and a JS
 * interval for the integer digit. Cancel is ref-guarded so it always wins, even
 * against the sweep's completion callback — the one behaviour the acceptance
 * test names ("a cancel that always works").
 *
 * The ring is a genuine countdown dial; the product's zero-radius rule is about
 * rectangles.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import { Button } from './primitives';

const SIZE = 46;
const STROKE = 3;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function QueueRing({
  durationMs = 3000,
  nextName,
  reason,
  onComplete,
  onCancel,
  onPlay,
  autoStart = true,
  startCancelled = false,
}: {
  durationMs?: number;
  nextName: string;
  reason: string;
  onComplete?: () => void;
  onCancel?: () => void;
  onPlay?: () => void;
  /** Gallery passes false to show a static counting frame. */
  autoStart?: boolean;
  /** Gallery passes true to show the cancelled state at rest. */
  startCancelled?: boolean;
}) {
  const [cancelled, setCancelled] = useState(startCancelled);
  const [seconds, setSeconds] = useState(Math.ceil(durationMs / 1000));
  const progress = useSharedValue(0);
  const doneRef = useRef(startCancelled); // true once cancelled or completed
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const complete = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    stop();
    onComplete?.();
  }, [onComplete, stop]);

  const cancel = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    cancelAnimation(progress);
    stop();
    setCancelled(true);
    onCancel?.();
  }, [onCancel, progress, stop]);

  useEffect(() => {
    if (!autoStart || startCancelled) return;
    const startAt = Date.now();
    progress.value = withTiming(1, { duration: durationMs, easing: Easing.linear }, (finished) => {
      if (finished) runOnJS(complete)();
    });
    intervalRef.current = setInterval(() => {
      const remaining = durationMs - (Date.now() - startAt);
      setSeconds(Math.max(0, Math.ceil(remaining / 1000)));
    }, 100);
    return () => {
      cancelAnimation(progress);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRC * (1 - progress.value),
  }));

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
      onPress={cancel}
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
      <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={SIZE} height={SIZE} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={C.n300} strokeWidth={STROKE} fill="none" />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={C.accent}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={CIRC}
            animatedProps={arcProps}
            strokeLinecap="butt"
          />
        </Svg>
        <Text style={text('rowTitle', { numeric: true })}>{seconds}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={text('kicker', { color: C.n600 })}>Next up · auto-loading</Text>
        <Text style={[text('rowTitle'), { marginTop: 2 }]}>{nextName}</Text>
        {reason ? <Text style={[text('kicker', { color: C.accentDeep }), { marginTop: 2 }]}>{reason}</Text> : null}
      </View>

      <Text style={text('kicker', { color: C.n600 })}>Tap to cancel</Text>
    </Pressable>
  );
}
