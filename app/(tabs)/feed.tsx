/**
 * 07 · Feed. FRIENDS / GLOBAL switch with a population note. Posts are full-width
 * rows, derived from real activity — the player's own runs, rival callout
 * replies, and seeded friend activity, interleaved by timestamp. Every post's
 * verb launches a run.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { FeedPost } from '@/components/ui/FeedPost';
import { Rule } from '@/components/ui/primitives';
import { Segmented } from '@/components/ui/Segmented';
import { buildFeed, feedPopulation } from '@/data/social';
import { track } from '@/lib/analytics';
import { useStore } from '@/store';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Feed() {
  const [tab, setTab] = useState<'FRIENDS' | 'GLOBAL'>('FRIENDS');
  const runPosts = useStore((s) => s.runPosts);
  const replies = useStore((s) => s.replies);

  const posts = buildFeed(tab, runPosts, replies);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <Segmented
        options={['FRIENDS', 'GLOBAL']}
        value={tab}
        onChange={(v) => setTab(v as 'FRIENDS' | 'GLOBAL')}
        note={tab === 'FRIENDS' ? feedPopulation.friends : feedPopulation.global}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.length === 0 ? (
          <Text style={[text('body', { color: C.n600 }), { padding: S.inset }]}>
            Play a game — your first run posts here.
          </Text>
        ) : (
          posts.map((p, i) => (
            <View key={`${p.who}-${p.targetGame}-${i}`}>
              <FeedPost
                {...p}
                onVerb={() => {
                  track({ name: 'social_action', type: 'race_from_feed', target_game: p.targetGame });
                  router.navigate(`/match/${p.targetGame}?source=feed`);
                }}
                onProfile={() => (p.who === 'YOU' ? router.navigate('/me') : router.navigate(`/friend/${p.who.toLowerCase()}`))}
              />
              <Rule />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
