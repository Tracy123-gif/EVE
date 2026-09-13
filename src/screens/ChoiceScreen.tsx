import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icon } from '../components/Icon';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { generateId } from '../lib/id';
import type { MainDrawerParamList } from '../navigation/types';
import type { RootStackParamList } from '../navigation/types';

type Props = DrawerScreenProps<MainDrawerParamList, 'Choice'>;

const CARDS = [
  {
    key: 'date' as const,
    title: 'A Date',
    subtitle: 'plan something with someone',
    color: colors.rose,
    emoji: '📅',
  },
  {
    key: 'solo' as const,
    title: 'Just Me',
    subtitle: 'plan something solo',
    color: colors.sage,
    emoji: '🌿',
  },
  {
    key: 'bucketlist' as const,
    title: 'Bucket List',
    subtitle: 'plan something for someday',
    color: colors.mustard,
    emoji: '✨',
  },
];

export function ChoiceScreen({ navigation }: Props) {
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = (key: (typeof CARDS)[number]['key']) => {
    if (key === 'date') {
      rootNavigation.navigate('CreateChoice');
      return;
    }
    rootNavigation.navigate('Create', {
      memoryId: generateId(),
      mode: key,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} hitSlop={12}>
          <Icon name="menu" size={24} color={colors.plum} />
        </TouchableOpacity>
      </View>
      <Text style={styles.headline}>what are we planning?</Text>
      <View style={styles.cards}>
        {CARDS.map((card) => (
          <TouchableOpacity
            key={card.key}
            style={[styles.card, { borderLeftColor: card.color }]}
            onPress={() => handlePress(card.key)}
          >
            <Text style={styles.emoji}>{card.emoji}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
  },
  headline: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 22,
    color: colors.plum,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  cards: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderLeftWidth: 5,
    padding: spacing.md,
    gap: spacing.md,
    ...shadow.soft,
  },
  emoji: {
    fontSize: 28,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 17,
    color: colors.plum,
  },
  cardSubtitle: {
    fontFamily: fonts.important,
    fontSize: 13,
    color: colors.plum,
    opacity: 0.6,
    marginTop: 2,
  },
});
