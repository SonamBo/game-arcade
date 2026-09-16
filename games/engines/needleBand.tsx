/**
 * ENGINE · needle-band — a sweeping needle and a shrinking accent band.
 * Covers REFLEX, SNAP, HOLD, PULSE, BOUNCE (7 games' worth of timing).
 *
 * REFLEX (UI spec §7): a needle sweeps a 100-unit track at 52 units/s, +3.4 a
 * round, bouncing. An accent band sits at a random centre (18–82) and shrinks
 * from 22 units by 0.8 a round, floor 7. A tap inside scores and reports a
 * millisecond figure; outside is a miss. Twenty rounds or three misses end it.
 *
 * The sweep is the only continuous motion, so it runs in a worklet; the tap
 * evaluation is discrete and lives in JS — the same split as STACK.
 */
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useRunLoop } from '@/games/useRunLoop';
import type { Engine, GameScreenProps } from '@/games/types';
import { C } from '@/theme/tokens';
import { text } from '@/theme/type';

export interface NeedleBandCfg {
  /** Track sweep speed in units/s, and its per-round increase. */
  speed0: number;
  speedStep: number;
  /** Random band-centre range, in track units (0–100). */
  centerMin: number;
  centerMax: number;
  /** Band width in units: starts at width0, shrinks by widthStep, floors at widthFloor. */
  width0: number;
  widthStep: number;
  widthFloor: number;
  maxRounds: number;
  maxMisses: number;
  /** Reported reaction: msBase + offset·msPerOff. */
  msBase: number;
  msPerOff: number;
  /**
   * 'best-ms' — final score is the best (lowest) reaction; lower is better.
   * 'count'   — final score is the number of hits; higher is better.
   */
  scoreMode: 'best-ms' | 'count';
}

const TRACK = 100;
const PAD = 24;
const NO_HIT_MS = 999;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function NeedleBand({ width, height, ghostTarget, carriedScore = 0, onScore, onGhost, onEnd, config }: GameScreenProps & { config: NeedleBandCfg }) {
  const pos = useSharedValue(0);
  const dir = useSharedValue(1);
  const speed = useSharedValue(config.speed0);

  const [band, setBand] = useState<{ center: number; width: number }>({ center: 50, width: config.width0 });
  const [round, setRound] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const hits = useRef(carriedScore > 0 && config.scoreMode === 'count' ? carriedScore : 0);
  const bestMs = useRef<number | null>(carriedScore > 0 && config.scoreMode === 'best-ms' ? carriedScore : null);
  const roundRef = useRef(0);
  const missRef = useRef(0);
  const overRef = useRef(false);

  const loop = useRunLoop({
    ghostTarget,
    onGhost,
    onFrame: (dt) => {
      'worklet';
      pos.value += (dir.value * speed.value * dt) / 1000;
      if (pos.value <= 0) {
        pos.value = 0;
        dir.value = 1;
      } else if (pos.value >= TRACK) {
        pos.value = TRACK;
        dir.value = -1;
      }
    },
  });

  useEffect(() => {
    if (width <= 0 || ready) return;
    setBand({ center: rand(config.centerMin, config.centerMax), width: config.width0 });
    speed.value = config.speed0;
    setReady(true);
    loop.start();
    if (config.scoreMode === 'count') onScore?.(hits.current);
    else if (bestMs.current != null) onScore?.(bestMs.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, ready]);

  const endRun = useCallback(() => {
    if (overRef.current) return;
    overRef.current = true;
    loop.end();
    const final = config.scoreMode === 'best-ms' ? (bestMs.current ?? NO_HIT_MS) : hits.current;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onEnd(final);
  }, [config.scoreMode, loop, onEnd]);

  const tap = useCallback(() => {
    if (overRef.current || !ready) return;
    const off = Math.abs(pos.value - band.center);
    const hit = off <= band.width / 2;

    if (hit) {
      const ms = Math.round(config.msBase + off * config.msPerOff);
      setLastMs(ms);
      if (config.scoreMode === 'best-ms') {
        bestMs.current = bestMs.current == null ? ms : Math.min(bestMs.current, ms);
        onScore?.(bestMs.current);
      } else {
        hits.current += 1;
        onScore?.(hits.current);
      }
      // A near-centre hit is a "perfect".
      Haptics.impactAsync(off <= band.width / 6 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
    } else {
      missRef.current += 1;
      setMisses(missRef.current);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    roundRef.current += 1;
    setRound(roundRef.current);
    if (roundRef.current >= config.maxRounds || missRef.current >= config.maxMisses) {
      endRun();
      return;
    }

    setBand({
      center: rand(config.centerMin, config.centerMax),
      width: Math.max(config.widthFloor, config.width0 - roundRef.current * config.widthStep),
    });
    speed.value += config.speedStep;
  }, [band, config, endRun, onScore, pos, ready]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tap]);

  const usable = width - PAD * 2;
  const unitToX = (u: number) => PAD + (u / TRACK) * usable;
  const trackY = height * 0.42;
  const trackH = 96;

  const bandLeft = unitToX(band.center - band.width / 2);
  const bandW = (band.width / TRACK) * usable;

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: PAD + (pos.value / TRACK) * usable }],
  }));

  return (
    <Pressable onPress={tap} style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1 }}>
        {/* band */}
        <View style={{ position: 'absolute', left: bandLeft, top: trackY, width: bandW, height: trackH, backgroundColor: C.accentTint, borderLeftWidth: 2, borderRightWidth: 2, borderColor: C.accent }} />
        {/* baseline */}
        <View style={{ position: 'absolute', left: PAD, right: PAD, top: trackY + trackH, height: 1, backgroundColor: C.divider }} />
        {/* needle */}
        {ready && !overRef.current ? (
          <Animated.View style={[{ position: 'absolute', top: trackY - 12, width: 3, height: trackH + 24, backgroundColor: C.text, left: 0 }, needleStyle]} />
        ) : null}

        {/* readout */}
        <View style={{ position: 'absolute', left: PAD, right: PAD, top: trackY + trackH + 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={text('micro', { color: C.n600, numeric: true })}>Round {round + 1}/{config.maxRounds}</Text>
          <Text style={text('micro', { color: misses > 0 ? C.accentDeep : C.n600, numeric: true })}>Misses {misses}/{config.maxMisses}</Text>
          <Text style={text('micro', { color: C.n600, numeric: true })}>{lastMs == null ? '—' : `${lastMs} ms`}</Text>
        </View>

        <Text style={[text('micro', { color: C.n500 }), { position: 'absolute', bottom: 20, alignSelf: 'center' }]}>
          Tap when the needle crosses the band
        </Text>
      </View>
    </Pressable>
  );
}

export const needleBandEngine: Engine<NeedleBandCfg> = {
  id: 'needle-band',
  Component: NeedleBand,
  defaults: {
    speed0: 52,
    speedStep: 3.4,
    centerMin: 18,
    centerMax: 82,
    width0: 22,
    widthStep: 0.8,
    widthFloor: 7,
    maxRounds: 20,
    maxMisses: 3,
    msBase: 78,
    msPerOff: 16,
    scoreMode: 'best-ms',
  },
};
