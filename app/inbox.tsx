/**
 * 14 · Inbox. "INBOX" with a one-line summary. Each row: a 6px vertical mark
 * (accent when actionable), a kicker naming the type, the message, a timestamp,
 * and a single-verb button. Every game-related action launches the run directly
 * — none open another screen first (UI spec §14). Fresh rival callouts surface
 * here as CHALLENGE rows.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { NotificationRow } from '@/components/ui/NotificationRow';
import { Rule } from '@/components/ui/primitives';
import { buildInbox } from '@/data/social';
import { track } from '@/lib/analytics';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Inbox() {
  const replies = useStore((s) => s.replies);
  const items = buildInbox(replies);
  const actionable = items.filter((n) => n.actionable).length;

  const act = (target: string, kind: string) => {
    // A game-related action launches the run; a screen target opens the screen.
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: 18, paddingBottom: 10 }}>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 26, letterSpacing: -0.8, color: C.text }}>INBOX</Text>
          <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{actionable} things waiting on you.</Text>
        </View>
        <Rule weight="section" />

        {items.map((n, i) => (
          <View key={i}>
            <NotificationRow
              kind={n.kind}
              message={n.message}
              time={n.time}
              verb={n.verb}
              actionable={n.actionable}
              onVerb={() => act(n.target, n.kind)}
            />
            <Rule />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
