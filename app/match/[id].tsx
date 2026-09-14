/**
 * 05 · In-match. Match chrome only — no tabs, no coin balance. The host measures
 * the playfield, renders the game into it, mirrors the live score and ghost into
 * the header, and — when the game reports the run is over — builds the Run
 * record, commits it, and moves to results. The game itself never navigates and
 * never touches the store (the contract, games/types.ts).
 *
 * Stage 02 ships STACK. Games without a real engine yet fall through to a
 * placeholder until stages 04+.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { MatchChrome } from '@/components/chrome/MatchChrome';
import { getGameComponent, getGameMeta } from '@/games/registry';
import { SAMPLE_GAMES } from '@/data/samples';
import { track } from '@/lib/analytics';
import { useStore } from '@/store';
import { C, T } from '@/theme/tokens';
import { text } from '@/theme/type';
import { coinsFor, isNearMiss } from '@/types/models';
import type { Run, RunSource } from '@/types/models';

export default function Match() {
  const { id, carry, source } = useLocalSearchParams<{ id: string; carry?: string; source?: string }>();
  const gameId = String(id ?? 'stack');
  const Game = getGameComponent(gameId);

  const carriedScore = carry ? Math.max(0, parseInt(carry, 10) || 0) : 0;
  const runSource = (source as RunSource) ?? 'shelf';

  // Unit and score direction come from the game's own metadata (registry);
  // the rival/ghost is still sample-derived until the social layer (stage 06).
  const meta = getGameMeta(gameId);
  const sample = SAMPLE_GAMES.find((g) => g.id === gameId);
  const rivalHandle = sample?.rival?.handle ?? 'KOJI';
  const ghostTarget = sample?.rival ? (sample.best ?? 0) + sample.rival.by : undefined;
  const unit = meta?.unit ?? sample?.unit ?? 'blocks';
  const lowerIsBetter = meta?.lowerIsBetter ?? false;

  const getProgress = useStore((s) => s.getProgress);
  const commitRun = useStore((s) => s.commitRun);

  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [score, setScore] = useState(carriedScore);
  const [ghost, setGhost] = useState(0);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!Game) return;
    track({ name: 'run_started', game: gameId, source: runSource, carried_score: carriedScore, variant: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => prev ?? { w: width, h: height });
  }, []);

  const onEnd = useCallback(
    (finalScore: number) => {
      const prevBest = getProgress(gameId).best;
      const improved = lowerIsBetter
        ? prevBest === 0 || finalScore < prevBest
        : finalScore > prevBest;
      const delta = Math.abs(prevBest - finalScore);
      const beatGhost =
        ghostTarget != null && (lowerIsBetter ? finalScore <= ghostTarget : finalScore >= ghostTarget);

      const endedAt = Date.now();
      const run: Run = {
        gameId,
        score: finalScore,
        prevBest,
        improved,
        beatGhost,
        delta,
        nearMiss: isNearMiss(prevBest, improved, delta),
        coins: coinsFor(finalScore, unit, false),
        carriedFrom: carriedScore > 0 ? carriedScore : undefined,
        variant: false,
        startedAt: startedAt.current,
        endedAt,
        source: runSource,
      };

      commitRun(run);
      track({
        name: 'run_ended',
        game: gameId,
        score: finalScore,
        improved,
        beat_ghost: beatGhost,
        coins: run.coins,
        duration: endedAt - startedAt.current,
      });
      router.replace('/results');
    },
    [carriedScore, commitRun, gameId, getProgress, ghostTarget, lowerIsBetter, runSource, unit]
  );

  const progress = useMemo(() => {
    if (!ghostTarget || ghostTarget <= 0) return 0;
    // Lower-is-better games approach the ghost from above, so the bar fills as
    // the score drops toward it.
    if (lowerIsBetter) return score > 0 ? Math.min(1, ghostTarget / score) : 0;
    return Math.min(1, score / ghostTarget);
  }, [score, ghostTarget, lowerIsBetter]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <MatchChrome
        score={score}
        rivalHandle={rivalHandle}
        ghost={ghost}
        progress={progress}
        onQuit={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
      />

      <View style={{ flex: 1 }} onLayout={onLayout}>
        {Game && size ? (
          <Game
            width={size.w}
            height={size.h}
            ghostTarget={ghostTarget}
            carriedScore={carriedScore}
            onScore={setScore}
            onGhost={setGhost}
            onEnd={onEnd}
          />
        ) : !Game ? (
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <Text style={{ fontFamily: T.display.fontFamily, fontSize: 42, color: C.n400 }}>
              {gameId.toUpperCase()}
            </Text>
            <Text style={[text('kicker', { color: C.n500 }), { marginTop: 8, textAlign: 'center' }]}>
              This one arrives with the engines · stage 04
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
