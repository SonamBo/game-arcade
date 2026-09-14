/**
 * STACK — bespoke, the hero game (build brief §6, UI spec §7).
 *
 *   A 140px block slides across the field at 190px/s, +9px/s per placement to a
 *   430px/s cap. Tap drops it: the overlap with the block below is kept, the
 *   overhang is lost, and the next block inherits the new width. Alignment
 *   inside 6px is a perfect — width is preserved and the placement scores 2
 *   instead of 1. Run ends when overlap falls to 6px or less. Show the last
 *   eleven blocks, alternating ink and neutral-800; the active block is accent.
 *
 * The continuous slide is the only thing that needs 60fps, so it runs in a
 * worklet on the UI thread. Placements are discrete and infrequent, so the
 * overlap maths and the tower array live in JS. Haptics: light on a placement,
 * medium on a perfect, error on the miss that ends the run.
 */
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useRunLoop } from '@/games/useRunLoop';
import type { GameScreenProps } from '@/games/types';
import { C } from '@/theme/tokens';

const BLOCK_H = 26;
const VISIBLE = 11;
const START_W = 140;
const SPEED_START = 190;
const SPEED_STEP = 9;
const SPEED_CAP = 430;
const EPS = 6; // perfect window, and the overlap floor that ends the run

interface Block {
  x: number;
  w: number;
}

export function StackGame({ width, height, ghostTarget, variant, carriedScore = 0, onScore, onGhost, onEnd }: GameScreenProps) {
  const curX = useSharedValue(0);
  const curW = useSharedValue(START_W);
  const dir = useSharedValue(1);
  const speed = useSharedValue(SPEED_START);

  const [placed, setPlaced] = useState<Block[]>([]);
  const [ready, setReady] = useState(false);
  const overRef = useRef(false);

  const loop = useRunLoop({
    ghostTarget,
    onGhost,
    onFrame: (dt) => {
      'worklet';
      const maxX = Math.max(0, width - curW.value);
      curX.value += (dir.value * speed.value * dt) / 1000;
      if (curX.value <= 0) {
        curX.value = 0;
        dir.value = 1;
      } else if (curX.value >= maxX) {
        curX.value = maxX;
        dir.value = -1;
      }
    },
  });

  // Start once the field has been measured. A cold start to the first tap is
  // budgeted at eight seconds, so there is no countdown or splash here.
  useEffect(() => {
    if (width <= 0 || ready) return;
    const baseX = Math.max(0, (width - START_W) / 2);
    setPlaced([{ x: baseX, w: START_W }]);
    curW.value = START_W;
    curX.value = 0;
    dir.value = 1;
    speed.value = SPEED_START;
    overRef.current = false;
    setReady(true);
    loop.start();
    // A retry resumes at the score reached, not zero (build brief §6).
    loop.score.value = carriedScore;
    onScore?.(carriedScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, ready]);

  const endRun = useCallback(() => {
    if (overRef.current) return;
    overRef.current = true;
    loop.end();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onEnd(Math.round(loop.score.value));
  }, [loop, onEnd]);

  const drop = useCallback(() => {
    if (overRef.current || !ready) return;
    const top = placed[placed.length - 1];
    if (!top) return;

    const curL = curX.value;
    const w = curW.value;
    const overlapL = Math.max(top.x, curL);
    const overlapR = Math.min(top.x + top.w, curL + w);
    const overlap = overlapR - overlapL;

    // Missed: not enough tower left to stand on.
    if (overlap <= EPS) {
      endRun();
      return;
    }

    let next: Block;
    let gain: number;
    if (Math.abs(curL - top.x) < EPS) {
      // Perfect: width preserved, snap to the block below.
      next = { x: top.x, w };
      gain = 2;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      // Sliced: keep only the overlap.
      next = { x: overlapL, w: overlap };
      gain = 1;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setPlaced((p) => [...p, next]);
    loop.score.value += gain;
    const s = Math.round(loop.score.value);
    onScore?.(s);

    // Hand the new width to the next block and speed it up.
    curW.value = next.w;
    curX.value = 0;
    dir.value = 1;
    speed.value = Math.min(SPEED_CAP, speed.value + SPEED_STEP);
  }, [placed, ready, curX, curW, dir, speed, loop, onScore, endRun]);

  // Arrow keys and space work for desk testing (web only).
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp') {
        e.preventDefault();
        drop();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drop]);

  const movingRow = Math.min(placed.length, VISIBLE);
  const visible = placed.slice(-VISIBLE);
  const offset = placed.length - visible.length; // for stable alternating colour

  const movingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: curX.value }],
    width: curW.value,
  }));

  // Blackout variant: the ground flips to neutral-900 every third block. The
  // falling piece stays the only accent element in the field.
  const containerBg = variant && placed.length % 3 === 0 ? C.n900 : C.bg;

  return (
    <Pressable onPress={drop} style={{ flex: 1, backgroundColor: containerBg }}>
      <View style={{ flex: 1, width, height }}>
        {visible.map((b, i) => {
          const realIndex = offset + i;
          return (
            <View
              key={realIndex}
              style={{
                position: 'absolute',
                left: b.x,
                bottom: i * BLOCK_H,
                width: b.w,
                height: BLOCK_H - 2,
                backgroundColor: realIndex % 2 === 0 ? C.text : C.n800,
              }}
            />
          );
        })}

        {ready && !overRef.current ? (
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                bottom: movingRow * BLOCK_H,
                height: BLOCK_H - 2,
                backgroundColor: C.accent,
              },
              movingStyle,
            ]}
          />
        ) : null}
      </View>
    </Pressable>
  );
}
