/**
 * ENGINE · lane-runner — fall-dodging across a few lanes.
 * Covers DODGE, LANES, TILT, DRIFT, GLIDE, ZIP, BLOCK (7 games).
 *
 * DODGE (build brief §6): distance accrues at 120 units/s with 5% compounding;
 * obstacles spawn every 0.72s tightening to 0.34s, falling at 250px/s +
 * distance/9; the player sits 56px from the bottom; a same-lane overlap ends the
 * run; score is floor(distance·10).
 *
 * Everything that moves lives in a fixed pool of shared values advanced in one
 * worklet on the UI thread — no per-frame bridge crossing, no array churn — so
 * a screen full of obstacles still holds 60fps. Input is button-first (D-007):
 * two lane buttons, with arrow keys for desk testing.
 */
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { useRunLoop } from '@/games/useRunLoop';
import type { Engine, GameScreenProps } from '@/games/types';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export interface LaneRunnerCfg {
  lanes: number;
  /** Distance units/s, and the compounding factor applied to distance. */
  speed0: number;
  accel: number;
  /** Seconds between spawns: eases from spawnMax down to spawnMin as distance grows. */
  spawnMax: number;
  spawnMin: number;
  spawnDistScale: number;
  /** Fall speed px/s: fallBase + distance / fallDistScale. */
  fallBase: number;
  fallDistScale: number;
  obstacleH: number;
  /** Player's gap above the bottom of the playfield, in px. */
  playerBottom: number;
  /** score = floor(distance · scoreScale). */
  scoreScale: number;
}

const POOL = 14;
const GAP = 6;
const PLAYER_H = 22;
const BUTTON_H = 56;

interface Slot {
  y: SharedValue<number>;
  lane: SharedValue<number>;
  active: SharedValue<number>;
}

function LaneRunner({ width, height, ghostTarget, carriedScore = 0, onScore, onGhost, onEnd, config }: GameScreenProps & { config: LaneRunnerCfg }) {
  const distance = useSharedValue(carriedScore > 0 ? carriedScore / config.scoreScale : 0);
  const spawnTimer = useSharedValue(config.spawnMax);
  const playerLane = useSharedValue(Math.floor(config.lanes / 2));
  // Read by the worklet to stop motion the instant a collision is reported,
  // without the worklet ever having to reference the run loop.
  const over = useSharedValue(0);

  // Fixed pool — the length is a module constant, so the hook order is stable.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pool: Slot[] = Array.from({ length: POOL }, () => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    y: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    lane: useSharedValue(0),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    active: useSharedValue(0),
  }));

  const [ready, setReady] = useState(false);
  const [, setScoreState] = useState(carriedScore);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playH = height - BUTTON_H;
  const laneW = width / config.lanes;
  const playerTop = playH - config.playerBottom - PLAYER_H;

  const scoreNow = useCallback(() => Math.floor(distance.value * config.scoreScale), [config.scoreScale, distance]);

  const endRun = useCallback(() => {
    if (over.value === 1) return;
    over.value = 1;
    if (intervalRef.current) clearInterval(intervalRef.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onEnd(scoreNow());
  }, [onEnd, over, scoreNow]);

  const loop = useRunLoop({
    ghostTarget,
    onGhost,
    onFrame: (dt) => {
      'worklet';
      if (over.value === 1) return;
      const dts = dt / 1000;
      distance.value += (config.speed0 + distance.value * config.accel) * dts;
      const fall = config.fallBase + distance.value / config.fallDistScale;

      spawnTimer.value -= dts;
      if (spawnTimer.value <= 0) {
        for (let i = 0; i < POOL; i++) {
          if (pool[i].active.value === 0) {
            pool[i].active.value = 1;
            pool[i].lane.value = Math.floor(Math.random() * config.lanes);
            pool[i].y.value = -config.obstacleH;
            break;
          }
        }
        spawnTimer.value = Math.max(config.spawnMin, config.spawnMax - distance.value / config.spawnDistScale);
      }

      for (let i = 0; i < POOL; i++) {
        if (pool[i].active.value === 1) {
          pool[i].y.value += fall * dts;
          const oy = pool[i].y.value;
          if (
            pool[i].lane.value === playerLane.value &&
            oy + config.obstacleH >= playerTop &&
            oy <= playerTop + PLAYER_H
          ) {
            runOnJS(endRun)();
          }
          if (oy > playH) pool[i].active.value = 0;
        }
      }
    },
  });

  useEffect(() => {
    if (width <= 0 || ready) return;
    setReady(true);
    loop.start();
    onScore?.(scoreNow());
    intervalRef.current = setInterval(() => {
      const s = scoreNow();
      setScoreState(s);
      onScore?.(s);
    }, 120);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, ready]);

  const move = useCallback(
    (delta: -1 | 1) => {
      if (over.value === 1) return;
      playerLane.value = Math.max(0, Math.min(config.lanes - 1, playerLane.value + delta));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [config.lanes, over, playerLane]
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') { e.preventDefault(); move(-1); }
      else if (e.code === 'ArrowRight') { e.preventDefault(); move(1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: playerLane.value * laneW + GAP / 2 }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ height: playH, overflow: 'hidden' }}>
        {/* lane seams */}
        {Array.from({ length: config.lanes - 1 }, (_, i) => (
          <View key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: (i + 1) * laneW, width: S.hairline, backgroundColor: C.divider }} />
        ))}

        {/* obstacles */}
        {pool.map((slot, i) => (
          <Obstacle key={i} slot={slot} laneW={laneW} obstacleH={config.obstacleH} />
        ))}

        {/* player */}
        {ready ? (
          <Animated.View
            style={[
              { position: 'absolute', top: playerTop, height: PLAYER_H, width: laneW - GAP, backgroundColor: C.accent },
              playerStyle,
            ]}
          />
        ) : null}
      </View>

      {/* lane control — button-first (D-007) */}
      <View style={{ flexDirection: 'row', gap: S.gap, backgroundColor: C.divider, height: BUTTON_H }}>
        <LaneButton label="← Left" onPress={() => move(-1)} />
        <LaneButton label="Right →" onPress={() => move(1)} />
      </View>
    </View>
  );
}

function Obstacle({ slot, laneW, obstacleH }: { slot: Slot; laneW: number; obstacleH: number }) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: slot.lane.value * laneW + GAP / 2 }, { translateY: slot.y.value }],
    opacity: slot.active.value,
    width: laneW - GAP,
  }));
  return <Animated.View style={[{ position: 'absolute', top: 0, left: 0, height: obstacleH, backgroundColor: C.text }, style]} />;
}

function LaneButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? C.surface : C.bg })}
    >
      <Text style={text('kicker', { color: C.text })}>{label}</Text>
    </Pressable>
  );
}

export const laneRunnerEngine: Engine<LaneRunnerCfg> = {
  id: 'lane-runner',
  Component: LaneRunner,
  defaults: {
    lanes: 3,
    speed0: 120,
    accel: 0.05,
    spawnMax: 0.72,
    spawnMin: 0.34,
    spawnDistScale: 4000,
    fallBase: 250,
    fallDistScale: 9,
    obstacleH: 30,
    playerBottom: 56,
    scoreScale: 10,
  },
};
