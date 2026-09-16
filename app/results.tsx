/**
 * 06 · Results (§6.06). The red field is gone. The score prints at T.run in ink
 * on paper with a one-line verdict beneath — "Personal best" in cyan, or "Meha
 * still leads by 5" in magenta. The queue keeps its three-second timing and
 * escape behaviour; the ring is cyan and shows the next game's plate inside.
 *
 * Logic unchanged: same lastRun, same nextQueued ranking, same retry economy.
 */
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QueueRing } from '@/components/ui/QueueRing';
import { Button } from '@/components/ui/primitives';
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

  const pick = run ? nextQueued(progress, run.gameId) : undefined;
  const next = pick
    ? { id: pick.game.id, name: pick.game.name, family: pick.game.family, reason: reasonLine(pick), reasonType: reasonType(pick.rivalAhead, pick.neverPlayed) }
    : null;

  useEffect(() => {
    if (next) track({ name: 'queue_shown', next_game: next.id, reason_type: next.reasonType, seconds_elapsed: 0 });
    if (run?.improved) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!run || !next) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={text('body', { color: C.n700 })}>No run to show</Text>
        <View style={{ height: 12 }} />
        <Button label="Shelf" variant="secondary" onPress={() => router.navigate('/')} />
      </View>
    );
  }

  const name = metaFor(run.gameId)?.name ?? run.gameId.toUpperCase();
  const rivalSeed = globalRivalFor(run.gameId);
  const ghost = rivalSeed.score;
  const best = getProgress(run.gameId).best;

  // Verdict: cyan on a personal best, magenta when the rival still leads.
  const verdict = run.improved
    ? { label: `Personal best · up ${run.score - run.prevBest}`, color: C.accentDeep }
    : run.beatGhost
      ? { label: `You took ${rivalSeed.handle}'s ghost`, color: C.accentDeep }
      : { label: `${rivalSeed.handle} still leads by ${run.delta}`, color: C.urgentDeep };

  const elapsedSince = () => Math.round((Date.now() - shownAt.current) / 1000);
  const goNext = (accepted: boolean) => {
    track({ name: accepted ? 'queue_accepted' : 'queue_cancelled', next_game: next.id, reason_type: next.reasonType, seconds_elapsed: elapsedSince() });
    if (accepted) router.replace(`/match/${next.id}?source=queue`);
  };

  const onRetry = () => {
    const res = takeRetry();
    if (res === 'insufficient') { router.navigate('/shop'); return; }
    track({ name: 'retry_taken', free: res === 'free', delta_to_best: run.delta, coins_spent: res === 'paid' ? 50 : 0 });
    router.replace(`/match/${run.gameId}?carry=${run.score}&source=retry`);
  };

  const retryLabel = freeRetriesLeft > 0 ? 'Retry free' : 'Retry · 50 coins';

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* score on paper */}
        <View style={{ paddingHorizontal: S.inset, paddingTop: S.band }}>
          <Text style={text('micro', { color: C.n700, uppercase: true })}>{name}</Text>
          <Text style={{ fontFamily: T.run.fontFamily, fontSize: T.run.fontSize, color: C.text, fontVariant: ['tabular-nums'], marginTop: 4 }}>
            {run.score.toLocaleString()}
          </Text>
          <Text style={[text('body', { color: verdict.color }), { marginTop: 4 }]}>{verdict.label}</Text>
        </View>

        <View style={{ paddingTop: S.band }}>
          <StatStrip
            cells={[
              { kicker: 'Your best', value: best },
              { kicker: `${rivalSeed.handle} ghost`, value: ghost },
              { kicker: 'Coins', value: `+${run.coins}` },
            ]}
          />
        </View>

        {/* near-miss retry */}
        {run.nearMiss ? (
          <View style={{ paddingHorizontal: S.inset, paddingTop: S.band }}>
            <Text style={text('band')}>So close — {run.delta} off your best</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, alignItems: 'center' }}>
              <Button label={retryLabel} variant="primary" onPress={onRetry} />
              <Text style={[text('meta', { color: C.n700 }), { flex: 1 }]}>
                {freeRetriesLeft > 0 ? `${freeRetriesLeft} free left · restarts at the score reached` : 'restarts at the score reached'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* auto-queue */}
        <QueueRing
          durationMs={3000}
          nextName={next.name}
          nextFamily={next.family}
          reason={next.reason}
          onComplete={() => goNext(true)}
          onCancel={() => goNext(false)}
          onPlay={() => router.replace(`/match/${next.id}?source=queue`)}
        />

        <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: S.inset, paddingTop: S.band }}>
          <View style={{ flex: 1 }}>
            <Button label="Run it again" variant="primary" full onPress={() => router.replace(`/match/${run.gameId}?source=retry`)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Shelf" variant="secondary" full onPress={() => router.navigate('/')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
