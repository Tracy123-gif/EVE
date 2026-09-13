import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { generateId } from '../lib/id';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateChoice'>;

export function CreateChoiceScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headline}>how do you want to plan this?</Text>
      <View style={styles.cards}>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('Create', { memoryId: generateId(), mode: 'date' })
          }
        >
          <Text style={styles.title}>Create</Text>
          <Text style={styles.subtitle}>
            plan it solo, you can still invite someone to view later
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('RoomSetup', { mode: 'date' })}
        >
          <Text style={styles.title}>Create with someone</Text>
          <Text style={styles.subtitle}>co-design it together in real time</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.lg,
  },
  headline: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 22,
    color: colors.plum,
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  cards: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.lg,
    ...shadow.soft,
  },
  title: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 18,
    color: colors.plum,
  },
  subtitle: {
    fontFamily: fonts.important,
    fontSize: 13,
    color: colors.plum,
    opacity: 0.6,
    marginTop: spacing.xs,
  },
});
