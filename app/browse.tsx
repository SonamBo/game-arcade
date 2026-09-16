/**
 * 03 · Browse (§6.03). The §5.6 list row: 56px family plate, name, one meta line
 * (family · runs), one figure. Pin state is a bookmark mark, not a text label.
 * Friend counts move to the detail screen. The family filter keeps its behaviour,
 * restyled with cyan selection. Search is name + family + mechanic keywords.
 */
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { IndexRow } from '@/components/ui/IndexRow';
import { Segmented } from '@/components/ui/Segmented';
import { ToastStripStatic } from '@/components/ui/ToastStrip';
import { FAMILIES, GAMES } from '@/data/catalogue';
import { rankInputFor } from '@/data/seed';
import { track } from '@/lib/analytics';
import { useStore } from '@/store';
import { C, R, S } from '@/theme/tokens';
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

  let rivalTagsLeft = 3; // at most three rival tags per screen (§5.6)

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label={`Browse · ${GAMES.length}`} />

      <View style={{ paddingHorizontal: S.inset, paddingVertical: 10 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search name, family or mechanic"
          placeholderTextColor={C.n500}
          style={[text('body', { color: C.text }), { borderWidth: 1, borderColor: C.divider, borderRadius: R.md, paddingHorizontal: 12, paddingVertical: 11 }]}
        />
      </View>

      <Segmented options={[...FAMILIES]} value={family} onChange={setFamily} note={`${rows.length}`} />
      {toast ? <View style={{ paddingTop: 10 }}><ToastStripStatic label={toast.label} refusal={toast.refusal} /></View> : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24, paddingTop: 6 }}>
        {rows.map((g) => {
          const p = progress[g.id];
          const played = (p?.runs ?? 0) > 0;
          const ri = rankInputFor(g.id, progress);
          let rivalTag: string | undefined;
          if (ri.rivalAhead && rivalTagsLeft > 0) {
            rivalTag = `${ri.rivalHandle} passed you`;
            rivalTagsLeft -= 1;
          }
          return (
            <IndexRow
              key={g.id}
              name={g.name}
              family={g.family}
              subline={played ? `${g.family} · ${p!.runs} runs` : `${g.family} · never played`}
              best={played ? (p!.best || null) : null}
              pinned={pinnedOrder.includes(g.id)}
              rivalTag={rivalTag}
              onPress={() => router.navigate(`/game/${g.id}`)}
              onLongPress={() => onPin(g.id, g.name)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
