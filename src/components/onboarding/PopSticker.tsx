import React, { useEffect } from 'react';
import { Image, StyleSheet, type ImageStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  source: ReturnType<typeof require>;
  active: boolean;
  delayMs: number;
  style: ImageStyle;
};

// A single decorative asset that pops into place with a bouncy spring once
// its page becomes active, staggered by `delayMs` so a whole scene cascades
// in piece by piece rather than appearing all at once.
export function PopSticker({ source, active, delayMs, style }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (active) {
      progress.value = withDelay(delayMs, withSpring(1, { damping: 8, stiffness: 110 }));
    } else {
      progress.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, style, animatedStyle]}>
      <Image source={source} style={styles.image} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
