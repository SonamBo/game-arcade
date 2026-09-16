/**
 * Queue ring (§06). Keeps its three-second timing and its escape behaviour: the
 * ring stroke is cyan on n300, and the next game shows as its 116px plate inside
 * the ring rather than a name. Tapping anywhere cancels and keeps the suggestion.
 * Cancel is ref-guarded so it always wins over the sweep's completion.
 *
 * Props unchanged except the additive `nextFamily` (for the plate).
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

import { Plate } from './Plate';
import { Button } from './primitives';
import { C, R, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import type { Family } from '@/types/models';

const BOX = 140;
const RAD = 66;
const STROKE = 3;
const CIRC = 2 * Math.PI * RAD;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function QueueRing({
  durationMs = 3000,
  nextName,
  reason,
  nextFamily = 'TAP',
  onComplete,
  onCancel,
  onPlay,
  autoStart = true,
  startCancelled = false,
}: {
  durationMs?: number;
  nextName: string;
  reason: string;
  nextFamily?: Family;
  onComplete?: () => void;
  onCancel?: () => void;
  onPlay?: () => void;
  autoStart?: boolean;
  startCancelled?: boolean;
}) {
  const [cancelled, setCancelled] = useState(startCancelled);
  const [seconds, setSeconds] = useState(Math.ceil(durationMs / 1000));
  const progress = useSharedValue(0);
  const doneRef = useRef(startCancelled);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);
  const complete = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true; stop(); onComplete?.();
  }, [onComplete, stop]);
  const cancel = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true; cancelAnimation(progress); stop(); setCancelled(true); onCancel?.();
  }, [onCancel, progress, stop]);

  useEffect(() => {
    if (!autoStart || startCancelled) return;
    const startAt = Date.now();
    progress.value = withTiming(1, { duration: durationMs, easing: Easing.linear }, (finished) => {
      if (finished) runOnJS(complete)();
    });
    intervalRef.current = setInterval(() => {
      setSeconds(Math.max(0, Math.ceil((durationMs - (Date.now() - startAt)) / 1000)));
    }, 100);
    return () => { cancelAnimation(progress); stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arcProps = useAnimatedProps(() => ({ strokeDashoffset: CIRC * (1 - progress.value) }));

  if (cancelled) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.rail, paddingHorizontal: S.inset, paddingTop: S.band }}>
        <Plate family={nextFamily} size={72} />
        <Text style={[text('body', { color: C.n700 }), { flex: 1 }]}>Queue stopped. {nextName} is still waiting on your shelf.</Text>
        <Button label="Play" variant="secondary" onPress={onPlay} />
      </View>
    );
  }

  return (
    <Pressable onPress={cancel} style={{ flexDirection: 'row', alignItems: 'center', gap: S.rail, paddingHorizontal: S.inset, paddingTop: S.band }}>
      <View style={{ width: BOX, height: BOX, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={BOX} height={BOX} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={BOX / 2} cy={BOX / 2} r={RAD} stroke={C.n300} strokeWidth={STROKE} fill="none" />
          <AnimatedCircle cx={BOX / 2} cy={BOX / 2} r={RAD} stroke={C.accent} strokeWidth={STROKE} fill="none" strokeDasharray={CIRC} animatedProps={arcProps} strokeLinecap="round" />
        </Svg>
        <Plate family={nextFamily} size={116} radius={R.lg} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={text('micro', { color: C.accentDeep, uppercase: true })}>Next up · {seconds}s</Text>
        <Text style={[text('rowTitle'), { marginTop: 4 }]}>{nextName}</Text>
        {reason ? <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{reason}</Text> : null}
        <Text style={[text('meta', { color: C.accent }), { marginTop: 8 }]}>Tap to cancel</Text>
      </View>
    </Pressable>
  );
}
