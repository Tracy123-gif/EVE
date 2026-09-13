import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { colors, fonts, spacing } from '../theme/theme';
import { logOut } from '../lib/authService';
import { useAuthStore } from '../store/authStore';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({
  label,
  onPress,
  right,
}: {
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      {right}
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const [countdownReminders, setCountdownReminders] = useState(true);
  const [resurfaceNudges, setResurfaceNudges] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.headline}>settings</Text>

        <Section title="account">
          <Row label={user?.email ?? 'edit profile'} />
          <Row label="log out" onPress={() => logOut()} />
        </Section>

        <Section title="notifications">
          <Row
            label="countdown reminders"
            right={
              <Switch value={countdownReminders} onValueChange={setCountdownReminders} />
            }
          />
          <Row
            label="resurfaced memory nudges"
            right={<Switch value={resurfaceNudges} onValueChange={setResurfaceNudges} />}
          />
        </Section>

        <Section title="privacy">
          <Row
            label="privacy policy"
            onPress={() => Linking.openURL('https://example.com/privacy')}
          />
        </Section>

        <Section title="about">
          <Row label={`app version ${Constants.expoConfig?.version ?? '1.0.0'}`} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  headline: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 20,
    color: colors.plum,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.plum,
    opacity: 0.5,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.paperDark,
  },
  rowLabel: {
    fontFamily: fonts.important,
    fontSize: 15,
    color: colors.plum,
  },
});
