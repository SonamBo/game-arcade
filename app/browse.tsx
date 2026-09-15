/**
 * 03 · Browse — all forty. A search field, a family filter, a numbered index,
 * and one row per game. Pinned rows sit on accent tint; long-press (420ms)
 * toggles the pin and shows the ink toast — including "SHELF FULL — UNPIN ONE
 * FIRST" at twelve. Search is name + family + mechanic keywords (spec §11).
 */
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { IndexRow } from '@/components/ui/IndexRow';
import { Rule } from '@/components/ui/primitives';
import { Segmented } from '@/components/ui/Segmented';
import { ToastStripStatic } from '@/components/ui/ToastStrip';
import { FAMILIES, GAMES } from '@/data/catalogue';
import { friendsOn, globalRivalFor } from '@/data/seed';
import { track } from '@/lib/analytics';
import { useStore } from '@/store';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Browse() {
  const togglePin = useStore((s) => s.togglePin);
  const pinnedOrder = useStore((s) => s.pinnedOrder);
  const progress = useStore((s) => s.progress);
  const [family, setFamily] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<{ label: string; refusal?: boolean } | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAMES.filter((g) => {
      const fam = family === 'ALL' || g.family === family;
      const match = !q || g.name.toLowerCase().includes(q) || g.family.toLowerCase().includes(q) || g.unit.toLowerCase().includes(q);
      return fam && match;
    });
  }, [family, query]);

  const onPin = (id: string, name: string) => {
    const res = togglePin(id);
    track({ name: 'pin_changed', game: id, pinned: res === 'pinned', refused: res === 'refused' });
    if (res === 'refused') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setToast({ label: 'Shelf full — unpin one first', refusal: true });
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setToast({ label: res === 'pinned' ? `${name} pinned to your shelf` : `${name} unpinned` });
    }
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label={`Browse · ${GAMES.length}`} />

      <View style={{ paddingHorizontal: S.inset, paddingVertical: 10, borderBottomWidth: S.hairline, borderBottomColor: C.divider }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search name, family or mechanic"
          placeholderTextColor={C.n500}
          autoCapitalize="characters"
          style={[text('body', { color: C.text }), { borderWidth: S.rule, borderColor: C.text, paddingHorizontal: 12, paddingVertical: 10 }]}
        />
      </View>

      <Segmented options={[...FAMILIES]} value={family} onChange={setFamily} note={`${rows.length} shown`} />
      {toast ? <ToastStripStatic label={toast.label} refusal={toast.refusal} /> : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        {rows.map((g) => {
          const p = progress[g.id];
          const played = (p?.runs ?? 0) > 0;
          const pinned = pinnedOrder.includes(g.id);
          const rival = globalRivalFor(g.id);
          const subline = played
            ? `${g.family} · ${p!.runs} runs`
            : `${g.family} · ${rival.handle} holds ${rival.score.toLocaleString()}`;
          return (
            <View key={g.id}>
              <IndexRow
                index={GAMES.indexOf(g) + 1}
                name={g.name}
                subline={subline}
                friendsOn={friendsOn(g.id)}
                best={played ? (p!.best || null) : null}
                pinned={pinned}
                onPress={() => router.navigate(`/game/${g.id}`)}
                onLongPress={() => onPin(g.id, g.name)}
              />
              <Rule />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
