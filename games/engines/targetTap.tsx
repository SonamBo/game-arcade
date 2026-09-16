/**
 * ENGINE · target-tap — hit targets before they vanish.
 * Covers AIM, CATCH, RUSH, TAPS, JUMP, CLIMB, DASH (7 games).
 *
 * A target appears at a random spot and lives for a short, shrinking window.
 * Tap it in time to score; let it expire and it is a miss. A set number of
 * misses ends the run. Nothing moves continuously, so this engine is plain JS —
 * it uses the run loop only for the shared ghost ticker in the header.
 */
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useRunLoop } from '@/games/useRunLoop';
import type { Engine, GameScreenProps } from '@/games/types';
import { C } from '@/theme/tokens';
import { text } from '@/theme/type';

export interface TargetTapCfg {
  /** Seconds between spawns: eases from spawnEvery0 to spawnEveryMin. */
  spawnEvery0: number;
  spawnEveryMin: number;
  spawnAccelPerHit: number;
  /** How long a target survives, shrinking as the run goes on. */
  lifetime0: number;
  lifetimeFloor: number;
  lifetimeStep: number;
  /** Target square side, in px. */
  targetSize: number;
  maxMisses: number;
}

interface Target {
  id: number;
  x: number;
  y: number;
  bornAt: number;
  lifetime: number;
}

const EDGE = 16;

function TargetTap({ width, height, ghostTarget, carriedScore = 0, onScore, onGhost, onEnd, config }: GameScreenProps & { config: TargetTapCfg }) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [misses, setMisses] = useState(0);
  const [ready, setReady] = useState(false);

  const hits = useRef(carriedScore);
  const missRef = useRef(0);
  const spawnCount = useRef(0);
  const nextId = useRef(1);
  const overRef = useRef(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnAtRef = useRef(0);

  const loop = useRunLoop({ ghostTarget, onGhost });

  const endRun = useCallback(() => {
    if (overRef.current) return;
    overRef.current = true;
    if (tickRef.current) clearInterval(tickRef.current);
    loop.end();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    onEnd(hits.current);
  }, [loop, onEnd]);

  const spawn = useCallback(() => {
    const size = config.targetSize;
    const t: Target = {
      id: nextId.current++,
      x: EDGE + Math.random() * Math.max(1, width - size - EDGE * 2),
      y: EDGE + Math.random() * Math.max(1, height - size - EDGE * 2),
      bornAt: Date.now(),
      lifetime: Math.max(config.lifetimeFloor, config.lifetime0 - spawnCount.current * config.lifetimeStep) * 1000,
    };
    spawnCount.current += 1;
    setTargets((cur) => [...cur, t]);
  }, [config.lifetime0, config.lifetimeFloor, config.lifetimeStep, config.targetSize, height, width]);

  const hit = useCallback(
    (id: number) => {
      if (overRef.current) return;
      setTargets((cur) => cur.filter((t) => t.id !== id));
      hits.current += 1;
      onScore?.(hits.current);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [onScore]
  );

  useEffect(() => {
    if (width <= 0 || ready) return;
    setReady(true);
    loop.start();
    onScore?.(hits.current);
    spawnAtRef.current = Date.now();

    tickRef.current = setInterval(() => {
      const now = Date.now();
      // expire overdue targets → misses
      setTargets((cur) => {
        const live: Target[] = [];
        let expired = 0;
        for (const t of cur) {
          if (now - t.bornAt >= t.lifetime) expired += 1;
          else live.push(t);
        }
        if (expired > 0) {
          missRef.current += expired;
          setMisses(missRef.current);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          if (missRef.current >= config.maxMisses) {
            // Defer to end after state settles.
            setTimeout(endRun, 0);
          }
        }
        return live;
      });

      // spawn on schedule
      if (now >= spawnAtRef.current && !overRef.current) {
        spawn();
        const every = Math.max(config.spawnEveryMin, config.spawnEvery0 - hits.current * config.spawnAccelPerHit);
        spawnAtRef.current = now + every * 1000;
      }
    }, 60);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, ready]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {targets.map((t) => (
        <Pressable
          key={t.id}
          onPress={() => hit(t.id)}
          style={{ position: 'absolute', left: t.x, top: t.y, width: config.targetSize, height: config.targetSize, backgroundColor: C.accent }}
        />
      ))}

      <View style={{ position: 'absolute', top: EDGE, right: EDGE }}>
        <Text style={text('micro', { color: missRef.current > 0 ? C.accentDeep : C.n600, numeric: true })}>
          Misses {misses}/{config.maxMisses}
        </Text>
      </View>

      <Text style={[text('micro', { color: C.n500 }), { position: 'absolute', bottom: 20, alignSelf: 'center' }]}>
        Tap the squares before they vanish
      </Text>
    </View>
  );
}

export const targetTapEngine: Engine<TargetTapCfg> = {
  id: 'target-tap',
  Component: TargetTap,
  defaults: {
    spawnEvery0: 1.1,
    spawnEveryMin: 0.45,
    spawnAccelPerHit: 0.03,
    lifetime0: 1.8,
    lifetimeFloor: 0.7,
    lifetimeStep: 0.03,
    targetSize: 64,
    maxMisses: 5,
  },
};
