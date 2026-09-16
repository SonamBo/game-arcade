/**
 * 11 · Inbox (§6.11). "Inbox" in T.title. Rows lose their rules; each is a
 * sentence with a timestamp beneath. Every game-related action launches the run
 * directly. Unread dot is magenta when it needs an answer, cyan otherwise.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { NotificationRow } from '@/components/ui/NotificationRow';
import { buildInbox } from '@/data/social';
import { track } from '@/lib/analytics';
import { useStore } from '@/store';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Inbox() {
  const replies = useStore((s) => s.replies);
  const items = buildInbox(replies);
  const actionable = items.filter((n) => n.actionable).length;

  const act = (target: string, kind: string) => {
    if (target.includes('/') || ['bracket', 'drop'].includes(target)) {
      router.navigate(`/${target}`);
    } else {
      if (kind === 'CHALLENGE') track({ name: 'social_action', type: 'challenge', target_game: target });
      router.navigate(`/match/${target}?source=inbox`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Inbox" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: S.rail }}>
          <Text style={text('title')}>Inbox</Text>
          <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{actionable} things waiting on you</Text>
        </View>
        <View style={{ paddingTop: S.rail }}>
          {items.map((n, i) => (
            <NotificationRow key={i} kind={n.kind} message={n.message} time={n.time} verb={n.verb} actionable={n.actionable} onVerb={() => act(n.target, n.kind)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
