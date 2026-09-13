import React, { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { CanvasBackground } from './CanvasBackground';
import { stickers } from '../../lib/stickers';
import { colors } from '../../theme/theme';
import type { CanvasElement } from '../../types/models';

// Editor canvases aren't stored in normalized coordinates, so previews
// approximate the original layout by scaling against this reference size.
export const REFERENCE_WIDTH = 360;
export const REFERENCE_HEIGHT = 560;

type Props = {
  backgroundKey?: string | null;
  elements: CanvasElement[];
  style?: any;
};

export function MemoryCanvasPreview({ backgroundKey, elements, style }: Props) {
  const [width, setWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const scale = width ? width / REFERENCE_WIDTH : 0;

  return (
    <View
      style={[styles.outer, { aspectRatio: REFERENCE_WIDTH / REFERENCE_HEIGHT }, style]}
      onLayout={handleLayout}
    >
      {width > 0 && (
        <View
          style={{
            width: REFERENCE_WIDTH,
            height: REFERENCE_HEIGHT,
            transform: [{ scale }],
            transformOrigin: 'top left',
          }}
        >
          <CanvasBackground
            backgroundKey={backgroundKey ?? null}
            width={REFERENCE_WIDTH}
            height={REFERENCE_HEIGHT}
          />
          {elements
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((el) => (
              <PreviewElement key={el.id} element={el} />
            ))}
        </View>
      )}
    </View>
  );
}

function PreviewElement({ element }: { element: CanvasElement }) {
  const base = {
    position: 'absolute' as const,
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: [{ rotate: `${element.rotation}deg` }],
  };

  if (element.type === 'sticker') {
    const sticker = stickers.find((s) => s.id === element.value);
    if (!sticker) return null;
    return <Image source={sticker.source} style={base} resizeMode="contain" />;
  }
  if (element.type === 'photo') {
    return <Image source={{ uri: element.value }} style={base} resizeMode="cover" />;
  }
  return (
    <View style={base}>
      <Text
        style={{
          fontFamily: 'Caveat_700Bold',
          fontSize: element.fontSize ?? 28,
          color: element.color ?? colors.plum,
        }}
      >
        {element.value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.paperDark,
  },
});
