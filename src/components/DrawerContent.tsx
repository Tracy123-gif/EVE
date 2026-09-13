import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from './Icon';
import { colors, fonts, spacing } from '../theme/theme';
import type { MainDrawerParamList } from '../navigation/types';

const ITEMS: { route: keyof MainDrawerParamList; label: string; icon: IconName }[] = [
  { route: 'Calendar', label: 'Calendar', icon: 'calendar' },
  { route: 'Scrapbook', label: 'Scrapbook', icon: 'scrapbook' },
  { route: 'Gallery', label: 'Gallery', icon: 'gallery' },
  { route: 'Settings', label: 'Settings', icon: 'settings' },
  { route: 'Profile', label: 'Profile', icon: 'profile' },
];

export function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>menu</Text>
        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.row}
            onPress={() => props.navigation.navigate(item.route)}
          >
            <Icon name={item.icon} size={22} color={colors.plum} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontFamily: fonts.important,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.plum,
    opacity: 0.5,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.paperDark,
  },
  label: {
    fontFamily: fonts.importantMedium,
    fontSize: 16,
    color: colors.plum,
  },
});
