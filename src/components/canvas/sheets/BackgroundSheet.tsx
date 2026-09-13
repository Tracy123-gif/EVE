import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, fonts, radii, spacing } from '../../../theme/theme';
import { ANIMATED_BACKGROUNDS, STATIC_BACKGROUNDS } from '../../../lib/backgrounds';

type Props = {
  selectedKey: string | null;
  onSelect: (key: string) => void;
};

export function BackgroundSheet({ selectedKey, onSelect }: Props) {
  const [tab, setTab] = useState<'static' | 'animated'>('static');
  const list = tab === 'static' ? STATIC_BACKGROUNDS : ANIMATED_BACKGROUNDS;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('static')}>
          <Text style={[styles.tabLabel, tab === 'static' && styles.tabLabelActive]}>
            Static
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('animated')}>
          <Text style={[styles.tabLabel, tab === 'animated' && styles.tabLabelActive]}>
            Animated
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {list.map((bg) => (
          <TouchableOpacity key={bg.key} onPress={() => onSelect(bg.key)} style={styles.swatchWrap}>
            <LinearGradient
              colors={bg.colors}
              style={[
                styles.swatch,
                selectedKey === bg.key && styles.swatchSelected,
              ]}
            />
            <Text style={styles.swatchLabel}>{bg.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  tabLabel: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.plum,
    opacity: 0.4,
  },
  tabLabelActive: {
    opacity: 1,
    textDecorationLine: 'underline',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  swatchWrap: {
    alignItems: 'center',
    width: 80,
  },
  swatch: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: colors.plum,
  },
  swatchLabel: {
    fontFamily: fonts.important,
    fontSize: 11,
    color: colors.plum,
    marginTop: 4,
  },
});
