import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { colors } from '../theme/theme';

// Subtle grid-line pattern stand-in: a flat paper color with faint rows.
// Swapping in a textured background image is a Phase 6 polish task.
export function ScreenBackground({ style, children, ...props }: ViewProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
