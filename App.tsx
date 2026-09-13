import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { RootNavigator } from './src/navigation/RootNavigator';
import { useAppFonts } from './src/theme/useFonts';
import { useAuthStore } from './src/store/authStore';
import { subscribeToAuth } from './src/lib/authService';
import { colors } from './src/theme/theme';

export default function App() {
  const [fontsLoaded] = useAppFonts();
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setUser(user);
      setInitializing(false);
    });
    return unsubscribe;
  }, [setUser, setInitializing]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.paper }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
