import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { colors, radii, shadow, spacing } from '../theme/theme';

export function Card({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    ...shadow.soft,
  },
});
