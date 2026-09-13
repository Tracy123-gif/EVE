import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import { useAuthStore } from '../store/authStore';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { MainDrawer } from './MainDrawer';
import { CreateChoiceScreen } from '../screens/CreateChoiceScreen';
import { RoomSetupScreen } from '../screens/RoomSetupScreen';
import { JoinRoomScreen } from '../screens/JoinRoomScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { FlipRevealScreen } from '../screens/FlipRevealScreen';
import { RevealCeremonyScreen } from '../screens/RevealCeremonyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);
  const [showSplash, setShowSplash] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const initialRoute: keyof RootStackParamList =
    showSplash || initializing ? 'Splash' : user ? 'Main' : onboarded ? 'Auth' : 'Onboarding';

  return (
    <Stack.Navigator
      key={initialRoute}
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding">
        {(props) => (
          <OnboardingScreen {...props} onDone={() => setOnboarded(true)} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Main" component={MainDrawer} />
      <Stack.Screen name="CreateChoice" component={CreateChoiceScreen} />
      <Stack.Screen name="RoomSetup" component={RoomSetupScreen} />
      <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="FlipReveal" component={FlipRevealScreen} />
      <Stack.Screen name="RevealCeremony" component={RevealCeremonyScreen} />
    </Stack.Navigator>
  );
}
