import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '../../Icon';
import { colors, fonts, spacing } from '../../../theme/theme';

const TRACKS = [
  { id: 'soft-piano', name: 'Soft Piano' },
  { id: 'golden-hour', name: 'Golden Hour' },
  { id: 'first-snow', name: 'First Snow' },
  { id: 'city-lights', name: 'City Lights' },
  { id: 'quiet-morning', name: 'Quiet Morning' },
];

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function MusicSheet({ selectedId, onSelect }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.heading}>attach a track</Text>
      <FlatList
        data={TRACKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => onSelect(item.id)}>
            <Icon name="music" size={18} color={colors.plum} />
            <Text style={styles.rowLabel}>{item.name}</Text>
            {selectedId === item.id && <Text style={styles.selected}>selected</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.plum,
    opacity: 0.5,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.paperDark,
  },
  rowLabel: {
    fontFamily: fonts.important,
    fontSize: 15,
    color: colors.plum,
    flex: 1,
  },
  selected: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    color: colors.sage,
  },
});
