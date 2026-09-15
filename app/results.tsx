/**
 * 06 · Results — the retention screen. Reads the real Run just committed
 * (store.lastRun). Accent banner on a personal best, ink otherwise; the score at
 * 72px and one plain-language headline. A three-cell strip, a near-miss band
 * only when the run fell within 18% of the player's best, then the live
 * auto-queue.
 *
 * Stage 03 makes the loop real:
 *   - the next game is the first ranked game that is not the one just played,
 *     using the same rankScore() the shelf uses (build brief §5)
 *   - the three-second ring auto-loads it; the cancel always works and keeps the
 *     suggestion (§06d, §9)
 *   - the near-miss retry is free three times a day then 50 coins, and a short
 *     balance routes to Shop rather than failing silently; a retry resumes at
 *     the score reached (§6, §9)
 */
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QueueRing } from '@/components/ui/QueueRing';
import { Button, Rule } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { metaFor } from '@/data/catalogue';
import { globalRivalFor, nextQueued } from '@/data/seed';
import { reasonType, track } from '@/lib/analytics';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';
import { reasonLine } from '@/types/models';

export default function Results() {
  const insets = useSafeAreaInsets();
  const run = useStore((s) => s.lastRun);
  const progress = useStore((s) => s.progress);
  const getProgress = useStore((s) => s.getProgress);
  const freeRetriesLeft = useStore((s) => s.wallet.freeRetriesLeft);
  const takeRetry = useStore((s) => s.takeRetry);
  const shownAt = useRef(Date.now());

  // The queue's next game comes from the same ranking path the shelf uses.
  const pick = run ? nextQueued(progress, run.gameId) : undefined;
  const next = pick
    ? { id: pick.game.id, name: pick.game.name, reason: reasonLine(pick), reasonType: reasonType(pick.rivalAhead, pick.neverPlayed) }
    : null;

  useEffect(() => {
    if (next) track({ name: 'queue_shown', next_game: next.id, reason_type: next.reasonType, seconds_elapsed: 0 });
    // Success buzz on a personal best — the one that makes it feel expensive.
    if (run?.improved) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!run || !next) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={text('kicker', { color: C.n500 })}>No run to show</Text>
        <View style={{ height: 12 }} />
        <Button label="Shelf" variant="outlined" onPress={() => router.navigate('/')} />
      </View>
    );
  }

  const name = metaFor(run.gameId)?.name ?? run.gameId.toUpperCase();
  const rivalSeed = globalRivalFor(run.gameId);
  const rival = rivalSeed.handle;
  const ghost = rivalSeed.score;
  const best = getProgress(run.gameId).best;

  const headline = run.improved
    ? `Up ${run.score - run.prevBest} on your old best. Posted to the feed.`
    : run.beatGhost
      ? `You took ${rival}'s ghost.`
      : `${rival}'s ghost held. ${run.delta} short.`;

  const elapsedSince = () => Math.round((Date.now() - shownAt.current) / 1000);

  const goNext = (accepted: boolean) => {
    track({
      name: accepted ? 'queue_accepted' : 'queue_cancelled',
      next_game: next.id,
      reason_type: next.reasonType,
      seconds_elapsed: elapsedSince(),
    });
    if (accepted) router.replace(`/match/${next.id}?source=queue`);
  };

  const onRetry = () => {
    const res = takeRetry();
    if (res === 'insufficient') {
      // A short balance routes to Shop rather than failing silently (§9).
      router.navigate('/shop');
      return;
    }
    track({ name: 'retry_taken', free: res === 'free', delta_to_best: run.delta, coins_spent: res === 'paid' ? 50 : 0 });
    router.replace(`/match/${run.gameId}?carry=${run.score}&source=retry`);
  };

  const retryLabel = freeRetriesLeft > 0 ? 'Retry free' : 'Retry · 50 coins';
  const retryNote =
    freeRetriesLeft > 0
      ? `${freeRetriesLeft} free ${freeRetriesLeft === 1 ? 'retry' : 'retries'} left today. Retry restarts at the score reached.`
      : 'Out of free retries. 50 coins, restarts at the score reached.';

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* banner — accent on a personal best, ink otherwise */}
        <View style={{ backgroundColor: run.improved ? C.accent : C.text, paddingHorizontal: S.inset, paddingVertical: 18 }}>
          <Text style={text('kicker', { color: C.bg })}>
            {run.improved ? `New personal best · ${name}` : `Run over · ${name}`}
          </Text>
          <Text style={{ fontFamily: T.run.fontFamily, fontSize: 72, letterSpacing: -2.9, color: C.bg, fontVariant: ['tabular-nums'] }}>
            {run.score.toLocaleString()}
          </Text>
          <Text style={text('body', { color: C.bg })}>{headline}</Text>
        </View>

        <StatStrip
          cells={[
            { kicker: 'Your best', value: best },
            { kicker: `${rival} ghost`, value: ghost ?? '—', accent: run.beatGhost },
            { kicker: 'Coins', value: `+${run.coins}`, accent: true },
          ]}
        />

        {/* near-miss band — only inside 18% of the best, without beating it */}
        {run.nearMiss ? (
          <View style={{ backgroundColor: C.accentTint, paddingHorizontal: S.inset, paddingVertical: 14 }}>
            <Text style={text('kicker', { color: C.accentDeep })}>So close</Text>
            <Text style={[{ fontFamily: T.figure.fontFamily, fontSize: 22, color: C.text }, { marginTop: 4 }]}>
              YOU WERE {run.delta} OFF YOUR BEST
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, alignItems: 'center' }}>
              <Button label={retryLabel} variant="accent" onPress={onRetry} />
              <Text style={[text('meta', { color: C.n700 }), { flex: 1 }]}>{retryNote}</Text>
            </View>
          </View>
        ) : null}

        {/* live auto-queue */}
        <View style={{ height: S.rule }} />
        <QueueRing
          durationMs={3000}
          nextName={next.name}
          reason={next.reason}
          onComplete={() => goNext(true)}
          onCancel={() => goNext(false)}
          onPlay={() => router.replace(`/match/${next.id}?source=queue`)}
        />
        <Rule />

        <Text style={[text('meta', { color: C.n600 }), { paddingHorizontal: S.inset, paddingVertical: 12 }]}>
          {run.improved ? `Posted to your feed: ${name} · +${run.coins} coins.` : `+${run.coins} coins earned.`}
        </Text>

        <View style={{ flexDirection: 'row', gap: S.gap, backgroundColor: C.divider, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Button label="Run it again" variant="accent" full onPress={() => router.replace(`/match/${run.gameId}?source=retry`)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Shelf" variant="inverse" full onPress={() => router.navigate('/')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
