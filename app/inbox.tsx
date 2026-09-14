/**
 * 14 · Inbox. "INBOX" at 26px with a one-line summary. Rows carry a 6px vertical
 * mark (accent when actionable), a kicker naming the type, the message, a
 * timestamp, and a single-verb button. Actionable rows sit on accent tint. Every
 * game-related action launches the run directly — none open another screen first.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { NotificationRow } from '@/components/ui/NotificationRow';
import { Rule } from '@/components/ui/primitives';
import { SAMPLE_INBOX } from '@/data/samples';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Inbox() {
  const actionable = SAMPLE_INBOX.filter((n) => n.actionable).length;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Inbox" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: 18, paddingBottom: 10 }}>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 26, letterSpacing: -0.8, color: C.text }}>INBOX</Text>
          <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{actionable} things waiting on you.</Text>
        </View>
        <Rule weight="section" />

        {SAMPLE_INBOX.map((n, i) => (
          <View key={i}>
            <NotificationRow
              kind={n.kind}
              message={n.text}
              time={n.time}
              verb={n.verb}
              actionable={n.actionable}
              onVerb={() => (n.kind === 'CUP' ? router.navigate('/bracket') : n.kind === 'DROP' ? router.navigate('/drop') : router.navigate('/match/stack'))}
            />
            <Rule />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
