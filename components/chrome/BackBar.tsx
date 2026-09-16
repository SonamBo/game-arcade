/**
 * Back bar — sentence case, no rule. "← Back" is a cyan link flush left; the
 * screen label sits right in T.meta at the n700 floor. Back returns to whatever
 * pushed it.
 */
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function BackBar({ label }: { label: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: C.bg }}>
      <View style={{ minHeight: MIN_TAP, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.inset }}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
          hitSlop={8}
        >
          <Text style={text('rowTitle', { color: C.accent })}>← Back</Text>
        </Pressable>
        <Text style={text('meta', { color: C.n700 })}>{label}</Text>
      </View>
    </View>
  );
}
