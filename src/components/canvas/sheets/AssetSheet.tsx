import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, fonts, radii, spacing } from '../../../theme/theme';
import { stickers } from '../../../lib/stickers';

type Props = {
  onSelect: (stickerId: string) => void;
};

export function AssetSheet({ onSelect }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.heading}>stickers</Text>
      <FlatList
        data={stickers}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cell} onPress={() => onSelect(item.id)}>
            <Image source={item.source} style={styles.thumb} resizeMode="contain" />
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
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    backgroundColor: colors.white,
    borderRadius: radii.sm,
  },
  thumb: {
    width: '70%',
    height: '70%',
  },
});
