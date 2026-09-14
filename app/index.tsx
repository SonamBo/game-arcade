/**
 * 00 · RAILS CHECK
 *
 * Not a product screen. It exists to prove the four things stage 00 is
 * responsible for, on a real phone:
 *   1. Archivo 400/600/800 render at every type role
 *   2. the token palette is wired and nothing uses a raw hex
 *   3. the persisted store survives a force-quit
 *   4. tap targets clear 48px
 *
 * Stage 01 deletes this file and replaces it with the tab layout.
 */
import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/store';
import { C, MIN_TAP, S, T } from '@/theme/tokens';
import { kicker, rowRule, screen, sectionRule, text } from '@/theme/type';
import { FREE_RETRIES_PER_DAY } from '@/types/models';

const TYPE_ROLES = Object.keys(T) as (keyof typeof T)[];

const SWATCHES: { name: string; value: string; onDark?: boolean }[] = [
  { name: 'bg', value: C.bg },
  { name: 'surface', value: C.surface },
  { name: 'accent-100', value: C.accentTint },
  { name: 'n400', value: C.n400 },
  { name: 'n700', value: C.n700, onDark: true },
  { name: 'accent', value: C.accent, onDark: true },
  { name: 'accent-700', value: C.accentDeep, onDark: true },
  { name: 'text', value: C.text, onDark: true },
];

export default function RailsCheck() {
  const insets = useSafeAreaInsets();
  const coins = useStore((s) => s.wallet.coins);
  const freeRetriesLeft = useStore((s) => s.wallet.freeRetriesLeft);
  const streak = useStore((s) => s.streak.days);
  const runs = useStore((s) => s.current?.runs.length ?? 0);
  const awardCoins = useStore((s) => s.awardCoins);
  const takeRetry = useStore((s) => s.takeRetry);

  return (
    <View style={[screen, { paddingTop: insets.top }]}>
      {/* Top bar — the real one arrives in stage 01. */}
      <View
        style={[
          sectionRule,
          {
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: S.inset,
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text style={text('kicker', { color: C.text })}>Game Arcade</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 9, height: 9, backgroundColor: C.accent }} />
          <Text style={text('meta', { numeric: true })}>{coins}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={[sectionRule, { padding: S.inset, paddingTop: 22 }]}>
          <Text style={kicker('accent')}>Stage 00 · rails</Text>
          <Text style={[text('display'), { marginTop: 8 }]}>
            THE RAILS{'\n'}ARE UP.
          </Text>
          <Text style={[text('body', { color: C.n700 }), { marginTop: 10 }]}>
            Fonts, tokens, navigation and a persisted store. No games, no
            screens, nothing to play yet — that is stage 01 onward.
          </Text>
        </View>

        {/* Persistence — the actual acceptance test */}
        <Section label="Persistence · force-quit this app and reopen it" />
        <View style={{ flexDirection: 'row', borderBottomWidth: S.rule, borderBottomColor: C.divider }}>
          <Cell label="Coins" value={coins} />
          <Cell label="Free retries" value={`${freeRetriesLeft}/${FREE_RETRIES_PER_DAY}`} />
          <Cell label="Day streak" value={streak} last />
        </View>

        <Action
          label="Award 25 coins"
          note="Writes to AsyncStorage. Should still be here after a cold start."
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            awardCoins(25);
          }}
        />
        <Action
          label="Take a retry"
          note="Free while any remain, then 50 coins, then it refuses."
          onPress={() => {
            const r = takeRetry();
            Haptics.notificationAsync(
              r === 'insufficient'
                ? Haptics.NotificationFeedbackType.Error
                : Haptics.NotificationFeedbackType.Success
            );
          }}
        />

        <View style={{ padding: S.inset }}>
          <Text style={text('meta', { color: C.n600, numeric: true })}>
            Runs this session: {runs} · session state is deliberately not persisted
          </Text>
        </View>

        {/* Type */}
        <Section label="Type · Archivo 400 / 600 / 800" />
        {TYPE_ROLES.map((role) => (
          <View
            key={role}
            style={[rowRule, { paddingHorizontal: S.inset, paddingVertical: S.row }]}
          >
            <Text style={kicker()}>
              {role} · {T[role].fontSize}px
            </Text>
            <Text style={[text(role), { marginTop: 4 }]} numberOfLines={1}>
              {role === 'run' || role === 'figure' || role === 'display'
                ? '1,329'
                : 'Ravi beat you by 3'}
            </Text>
          </View>
        ))}

        {/* Colour */}
        <Section label="Colour · no raw hex outside tokens.ts" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: C.divider, gap: S.gap }}>
          {SWATCHES.map((s) => (
            <View
              key={s.name}
              style={{
                backgroundColor: s.value,
                width: '32.5%',
                height: 74,
                padding: 8,
                justifyContent: 'flex-end',
              }}
            >
              <Text style={text('kicker', { color: s.onDark ? C.bg : C.text })}>
                {s.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ padding: S.inset, paddingTop: 20 }}>
          <Text style={text('meta', { color: C.n600 })}>
            Minimum tap target {MIN_TAP}px · minimum readable type{' '}
            {T.kicker.fontSize}px · radius 0 everywhere
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ label }: { label: string }) {
  return (
    <View
      style={[
        sectionRule,
        { paddingHorizontal: S.inset, paddingTop: 24, paddingBottom: 8 },
      ]}
    >
      <Text style={kicker()}>{label}</Text>
    </View>
  );
}

function Cell({
  label,
  value,
  last,
}: {
  label: string;
  value: string | number;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: S.inset,
        paddingVertical: 14,
        borderRightWidth: last ? 0 : S.hairline,
        borderRightColor: C.divider,
      }}
    >
      <Text style={kicker()}>{label}</Text>
      <Text style={[text('figure'), { marginTop: 4 }]}>{value}</Text>
    </View>
  );
}

function Action({
  label,
  note,
  onPress,
}: {
  label: string;
  note: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        rowRule,
        {
          minHeight: MIN_TAP,
          justifyContent: 'center',
          paddingHorizontal: S.inset,
          paddingVertical: S.row,
          backgroundColor: pressed ? C.accentTint : C.bg,
        },
      ]}
    >
      <Text style={text('rowTitle')}>{label}</Text>
      <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{note}</Text>
    </Pressable>
  );
}
