/**
 * 10 · Shop (§6.10). Balance at T.display with "coins" as a meta line. Power-ups
 * spend real coins. Packs become cards, two up, at E.sm/R.lg; the best-value pack
 * is marked by a cyan "Best value" tag, not by reversing it out. This is the one
 * screen where a card grid is allowed, because packs are discrete items.
 */
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { BandHeader, Button, Tag } from '@/components/ui/primitives';
import { ToastStripStatic } from '@/components/ui/ToastStrip';
import { POWERUP_COST } from '@/store/slices/economy';
import type { PowerUp } from '@/store/slices/economy';
import { useStore } from '@/store';
import { C, E, R, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

const POWERUPS: { kind: PowerUp; name: string; desc: string }[] = [
  { kind: 'retry', name: 'Extra retry', desc: 'Bank one more retry on top of the free three.' },
  { kind: 'ghostScout', name: 'Ghost scout', desc: "See a rival's run before you play it." },
  { kind: 'streakFreeze', name: 'Streak freeze', desc: 'Miss a day without losing your streak.' },
];

const PACKS = [
  { coins: 1000, price: '₹79' },
  { coins: 3000, price: '₹199', best: true },
  { coins: 8000, price: '₹449' },
  { coins: 20000, price: '₹999' },
];

export default function Shop() {
  const coins = useStore((s) => s.wallet.coins);
  const freeRetriesLeft = useStore((s) => s.wallet.freeRetriesLeft);
  const powerups = useStore((s) => s.powerups);
  const buyPowerUp = useStore((s) => s.buyPowerUp);
  const [toast, setToast] = useState<{ label: string; refusal?: boolean } | null>(null);

  const owned = (kind: PowerUp) => kind !== 'retry' && powerups[kind];

  const buy = (name: string, kind: PowerUp) => {
    const res = buyPowerUp(kind);
    if (res === 'insufficient') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setToast({ label: 'Not enough coins', refusal: true });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setToast({ label: `${name} bought` });
    }
    setTimeout(() => setToast(null), 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: S.rail }}>
          <Text style={text('display')}>{coins.toLocaleString()}</Text>
          <Text style={text('meta', { color: C.n700, numeric: true })}>coins · {freeRetriesLeft} free retries left today</Text>
        </View>

        {toast ? <View style={{ paddingTop: 12 }}><ToastStripStatic label={toast.label} refusal={toast.refusal} /></View> : null}

        <BandHeader kicker="Spend it" />
        {POWERUPS.map((p) => (
          <View key={p.kind} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.inset, paddingVertical: 12, gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={text('rowTitle')}>{p.name}</Text>
              <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{p.desc}</Text>
            </View>
            {owned(p.kind) ? (
              <Text style={text('meta', { color: C.n700 })}>Owned</Text>
            ) : (
              <Button label={`${POWERUP_COST[p.kind]}`} variant={p.kind === 'retry' ? 'primary' : 'secondary'} onPress={() => buy(p.name, p.kind)} />
            )}
          </View>
        ))}

        <BandHeader kicker="Top up" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: S.inset, gap: S.rail }}>
          {PACKS.map((pk) => (
            <View key={pk.coins} style={[{ width: (412 - S.inset * 2 - S.rail) / 2, backgroundColor: C.surface, borderRadius: R.lg, padding: S.card, opacity: 0.6 }, E.sm]}>
              {pk.best ? <Tag kind="live" label="Best value" /> : null}
              <Text style={[{ fontFamily: T.figure.fontFamily, fontSize: T.figure.fontSize, color: C.text, fontVariant: ['tabular-nums'] }, { marginTop: pk.best ? 10 : 0 }]}>
                {pk.coins.toLocaleString()}
              </Text>
              <Text style={[text('rowTitle', { color: C.n700 }), { marginTop: 4 }]}>{pk.price}</Text>
            </View>
          ))}
        </View>
        <Text style={[text('meta', { color: C.n700 }), { paddingHorizontal: S.inset, paddingTop: 10 }]}>Top-up packs arrive with payments — not in this build.</Text>

        <Text style={[text('body', { color: C.n800 }), { paddingHorizontal: S.inset, paddingTop: S.band }]}>
          Coins buy continues and retries. They never buy access to a game — all 40 are free.
        </Text>
      </ScrollView>
    </View>
  );
}
