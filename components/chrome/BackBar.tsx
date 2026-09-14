/**
 * Back bar (§4) — detail, drop, bracket, friend, inbox. "← BACK" flush left,
 * screen label flush right in 13px/800 neutral. Back returns to the screen that
 * pushed it, not a fixed parent — so it uses router.back().
 */
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function BackBar({ label }: { label: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: C.bg, borderBottomWidth: S.rule, borderBottomColor: C.divider }}>
      <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
          hitSlop={8}
          style={{ paddingHorizontal: S.inset, height: '100%', justifyContent: 'center' }}
        >
          <Text style={text('kicker', { color: C.text })}>← Back</Text>
        </Pressable>
        <Text
          style={[{ fontFamily: 'Archivo_800ExtraBold', fontSize: 13, color: C.n600 }, { paddingHorizontal: S.inset }]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}
