import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import type { MainDrawerParamList } from './types';
import { ChoiceScreen } from '../screens/ChoiceScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ScrapbookScreen } from '../screens/ScrapbookScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DrawerContent } from '../components/DrawerContent';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: '75%' },
        overlayColor: 'rgba(74,49,64,0.4)',
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Choice" component={ChoiceScreen} />
      <Drawer.Screen name="Calendar" component={CalendarScreen} />
      <Drawer.Screen name="Scrapbook" component={ScrapbookScreen} />
      <Drawer.Screen name="Gallery" component={GalleryScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
