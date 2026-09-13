import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { colors } from '../theme/theme';

const PARTICLE_COLORS = [colors.rose, colors.sage, colors.mustard, colors.denim];
const PARTICLE_COUNT = 16;

function Particle({ index, onDone }: { index: number; onDone?: () => void }) {
  const progress = useSharedValue(0);
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
  const distance = 90 + (index % 3) * 20;

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: 700, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished && index === 0 && onDone) {
          onDone();
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: Math.cos(angle) * distance * progress.value },
      { translateY: Math.sin(angle) * distance * progress.value },
      { scale: 1 - progress.value * 0.5 },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: PARTICLE_COLORS[index % PARTICLE_COLORS.length] },
        style,
      ]}
    />
  );
}

export function CelebrationBurst({ onDone }: { onDone?: () => void }) {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} index={i} onDone={i === 0 ? onDone : undefined} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
