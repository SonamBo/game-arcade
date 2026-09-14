/**
 * 07 · Feed. A FRIENDS / GLOBAL switch with a right-aligned population note,
 * then full-width feed posts. The feed is derived, not authored — every post is
 * a real run; here they are samples until stage 06 wires the run generator.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { FeedPost } from '@/components/ui/FeedPost';
import { Rule } from '@/components/ui/primitives';
import { Segmented } from '@/components/ui/Segmented';
import { SAMPLE_FEED } from '@/data/samples';
import { C } from '@/theme/tokens';

export default function Feed() {
  const [tab, setTab] = useState<'FRIENDS' | 'GLOBAL'>('FRIENDS');
  const posts = tab === 'FRIENDS' ? SAMPLE_FEED : SAMPLE_FEED.filter((p) => p.global || p.who === 'WORLD RECORD');

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <Segmented
        options={['FRIENDS', 'GLOBAL']}
        value={tab}
        onChange={(v) => setTab(v as 'FRIENDS' | 'GLOBAL')}
        note={tab === 'FRIENDS' ? '23 friends' : '2.1M playing'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map((p, i) => (
          <View key={i}>
            <FeedPost
              {...p}
              onVerb={() => router.navigate('/game/stack')}
              onProfile={() => router.navigate(`/friend/${p.who.toLowerCase()}`)}
            />
            <Rule />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
