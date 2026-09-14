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
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { MatchChrome } from '@/components/chrome/MatchChrome';
import { getGameComponent } from '@/games/registry';
import { SAMPLE_GAMES } from '@/data/samples';
import { useStore } from '@/store';
import { C, T } from '@/theme/tokens';
import { text } from '@/theme/type';
import { coinsFor, isNearMiss } from '@/types/models';
import type { Run } from '@/types/models';

// Higher-is-better for every stage-02 game. The catalogue carries the real flag
// per game from stage 05; STACK is higher-is-better.
const LOWER_IS_BETTER: Record<string, boolean> = {};

export default function Match() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = String(id ?? 'stack');
  const Game = getGameComponent(gameId);

  const sample = SAMPLE_GAMES.find((g) => g.id === gameId);
  const rivalHandle = sample?.rival?.handle ?? 'KOJI';
  const ghostTarget = sample?.rival ? (sample.best ?? 0) + sample.rival.by : undefined;
  const unit = sample?.unit ?? 'blocks';
  const lowerIsBetter = LOWER_IS_BETTER[gameId] ?? false;

  const getProgress = useStore((s) => s.getProgress);
  const commitRun = useStore((s) => s.commitRun);

  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [score, setScore] = useState(0);
  const [ghost, setGhost] = useState(0);
  const startedAt = useRef(Date.now());

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

      const run: Run = {
        gameId,
        score: finalScore,
        prevBest,
        improved,
        beatGhost,
        delta,
        nearMiss: isNearMiss(prevBest, improved, delta),
        coins: coinsFor(finalScore, unit, false),
        variant: false,
        startedAt: startedAt.current,
        endedAt: Date.now(),
        source: 'shelf',
      };

      commitRun(run);
      router.replace('/results');
    },
    [commitRun, gameId, getProgress, ghostTarget, lowerIsBetter, unit]
  );

  const progress = useMemo(
    () => (ghostTarget && ghostTarget > 0 ? Math.min(1, score / ghostTarget) : 0),
    [score, ghostTarget]
  );

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
