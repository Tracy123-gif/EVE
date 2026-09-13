import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { getBackground } from '../../lib/backgrounds';

type Props = {
  backgroundKey: string | null;
  width: number;
  height: number;
};

export function CanvasBackground({ backgroundKey, width, height }: Props) {
  const bg = getBackground(backgroundKey);
  const angle = useSharedValue(0);

  useEffect(() => {
    if (bg.animated) {
      angle.value = 0;
      angle.value = withRepeat(
        withTiming(Math.PI * 2, { duration: 6000, easing: Easing.linear }),
        -1,
        false,
      );
    }
  }, [bg.animated, bg.key, angle]);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.max(width, height) / 2;

  const start = useDerivedValue(() => {
    if (!bg.animated) return vec(0, 0);
    return vec(cx + radius * Math.cos(angle.value), cy + radius * Math.sin(angle.value));
  }, [bg.animated, cx, cy, radius]);

  const end = useDerivedValue(() => {
    if (!bg.animated) return vec(width, height);
    return vec(
      cx + radius * Math.cos(angle.value + Math.PI),
      cy + radius * Math.sin(angle.value + Math.PI),
    );
  }, [bg.animated, cx, cy, radius, width, height]);

  if (width <= 0 || height <= 0) return null;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient start={start} end={end} colors={bg.colors} />
      </Rect>
    </Canvas>
  );
}
