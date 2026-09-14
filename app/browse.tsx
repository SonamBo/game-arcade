/**
 * 03 · Browse — all forty. A search field, a horizontally scrolling family
 * filter (ALL · TAP · SWIPE · TIMING · NUMBERS · MEMORY), a numbered index, and
 * one row per game. Pinned rows sit on accent tint; long-press toggles the pin
 * and shows the ink toast.
 *
 * Search is name + family + mechanic keywords (spec §11 recommendation) — wired
 * to the real catalogue at stage 05. Here it filters the sample rows.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { IndexRow } from '@/components/ui/IndexRow';
import { Rule } from '@/components/ui/primitives';
import { Segmented } from '@/components/ui/Segmented';
import { ToastStripStatic } from '@/components/ui/ToastStrip';
import { useStore } from '@/store';
import { SAMPLE_GAMES } from '@/data/samples';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

const FAMILIES = ['ALL', 'TAP', 'SWIPE', 'TIMING', 'NUMBERS', 'MEMORY'];

export default function Browse() {
  const togglePin = useStore((s) => s.togglePin);
  const [family, setFamily] = useState('ALL');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<{ label: string; refusal?: boolean } | null>(null);

  const rows = SAMPLE_GAMES.filter((g) => {
    const fam = family === 'ALL' || g.family === family;
    const q = query.trim().toLowerCase();
    const match = !q || g.name.toLowerCase().includes(q) || g.family.toLowerCase().includes(q) || g.unit.toLowerCase().includes(q);
    return fam && match;
  });

  const onPin = (id: string, name: string, pinned?: boolean) => {
    const res = togglePin(id);
    if (res === 'refused') setToast({ label: 'Shelf full — unpin one first', refusal: true });
    else setToast({ label: res === 'pinned' ? `${name} pinned to your shelf` : `${name} unpinned` });
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Browse" />

      <View style={{ paddingHorizontal: S.inset, paddingVertical: 10, borderBottomWidth: S.hairline, borderBottomColor: C.divider }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search name, family or mechanic"
          placeholderTextColor={C.n500}
          style={[text('body', { color: C.text }), { borderWidth: S.rule, borderColor: C.text, paddingHorizontal: 12, paddingVertical: 10 }]}
        />
      </View>

      <Segmented options={FAMILIES} value={family} onChange={setFamily} />
      {toast ? <ToastStripStatic label={toast.label} refusal={toast.refusal} /> : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        {rows.map((g, i) => (
          <View key={g.id}>
            <IndexRow
              index={i + 1}
              name={g.name}
              subline={g.rival ? `${g.family} · ${g.rival.handle} ahead` : g.neverPlayed ? `${g.family} · never played` : `${g.family} · ${g.runs} runs`}
              friendsOn={g.friendsOn}
              best={g.best}
              pinned={g.pinned}
              onPress={() => router.navigate(`/game/${g.id}`)}
              onLongPress={() => onPin(g.id, g.name, g.pinned)}
            />
            <Rule />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
