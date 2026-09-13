import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, spacing } from '../theme/theme';

function Decoration({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withSequence(
        withSpring(1.15, { damping: 6, stiffness: 180 }),
        withSpring(1, { damping: 8, stiffness: 180 }),
      ),
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value === 0 ? 0 : 1,
    transform: [{ scale: progress.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

export function SplashScreen() {
  const wordmarkOpacity = useSharedValue(0);

  useEffect(() => {
    wordmarkOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));
  }, [wordmarkOpacity]);

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.decorRow}>
          <Decoration delay={0}>
            <View style={styles.tornCorner} />
          </Decoration>
          <Decoration delay={250}>
            <View style={styles.washiTape} />
          </Decoration>
          <Decoration delay={500}>
            <View style={styles.ribbon} />
          </Decoration>
        </View>
        <Animated.Text style={[styles.wordmark, wordmarkStyle]}>eve</Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paperDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    width: 180,
    height: 240,
    backgroundColor: colors.paper,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.plum,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  decorRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  tornCorner: {
    width: 28,
    height: 28,
    backgroundColor: colors.rose,
    borderTopLeftRadius: 2,
    transform: [{ rotate: '-8deg' }],
  },
  washiTape: {
    width: 40,
    height: 16,
    backgroundColor: colors.mustard,
    transform: [{ rotate: '4deg' }],
  },
  ribbon: {
    width: 20,
    height: 32,
    backgroundColor: colors.sage,
    transform: [{ rotate: '-2deg' }],
  },
  wordmark: {
    fontFamily: fonts.whimsicalBold,
    fontSize: 32,
    color: colors.plum,
  },
});
