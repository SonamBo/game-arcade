// Must be the first import in the app. Do not move it.
import 'react-native-gesture-handler';

import {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/archivo';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useHydrated, useStore } from '@/store';
import { C } from '@/theme/tokens';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_800ExtraBold,
  });

  const hydrated = useHydrated();
  const dailyReset = useStore((s) => s.dailyReset);
  const beginSession = useStore((s) => s.beginSession);

  useEffect(() => {
    if (!hydrated) return;
    const now = Date.now();
    dailyReset(now);
    beginSession(now);
  }, [hydrated, dailyReset, beginSession]);

  const ready = fontsLoaded && hydrated;

  // Hold on the ground colour rather than a spinner. Cold start to first tap
  // is budgeted at eight seconds including onboarding, so this window is
  // measured in frames and a spinner would only flash.
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.bg }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={C.bg} />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none',
            contentStyle: { backgroundColor: C.bg },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
