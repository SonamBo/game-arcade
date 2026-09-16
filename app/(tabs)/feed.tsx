/**
 * 08 · Feed (§6.08). Friends / Global switch, then posts separated by space, no
 * rules. Each post is an avatar, one sentence, the game's plate at the right and
 * a cyan "Beat it" link. Derived from real activity; every verb launches a run.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { FeedPost } from '@/components/ui/FeedPost';
import { Segmented } from '@/components/ui/Segmented';
import { buildFeed, feedPopulation } from '@/data/social';
import { track } from '@/lib/analytics';
import { useStore } from '@/store';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Feed() {
  const [tab, setTab] = useState<'Friends' | 'Global'>('Friends');
  const runPosts = useStore((s) => s.runPosts);
  const replies = useStore((s) => s.replies);

  const posts = buildFeed(tab === 'Friends' ? 'FRIENDS' : 'GLOBAL', runPosts, replies);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <Segmented
        options={['Friends', 'Global']}
        value={tab}
        onChange={(v) => setTab(v as 'Friends' | 'Global')}
        note={tab === 'Friends' ? feedPopulation.friends : feedPopulation.global}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: S.rail, paddingBottom: 24, gap: S.band - S.rail * 2 }}>
        {posts.length === 0 ? (
          <Text style={[text('body', { color: C.n700 }), { padding: S.inset }]}>Play a game — your first run posts here.</Text>
        ) : (
          posts.map((p, i) => (
            <FeedPost
              key={`${p.who}-${p.targetGame}-${i}`}
              {...p}
              onVerb={() => {
                track({ name: 'social_action', type: 'race_from_feed', target_game: p.targetGame });
                router.navigate(`/match/${p.targetGame}?source=feed`);
              }}
              onProfile={() => (p.who === 'YOU' ? router.navigate('/me') : router.navigate(`/friend/${p.who.toLowerCase()}`))}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
