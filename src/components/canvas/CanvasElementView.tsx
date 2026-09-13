import React from 'react';
import { Image, StyleSheet, Text as RNText, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Icon } from '../Icon';
import { colors, radii } from '../../theme/theme';
import { stickers } from '../../lib/stickers';
import type { CanvasElement } from '../../types/models';

type Props = {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onUpdate: (patch: Partial<CanvasElement>) => void;
};

const MIN_SIZE = 40;
const TOOLBAR_HEIGHT = 44;

export function CanvasElementView({
  element,
  isSelected,
  onSelect,
  onDelete,
  onBringToFront,
  onUpdate,
}: Props) {
  const x = useSharedValue(element.x);
  const y = useSharedValue(element.y);
  const width = useSharedValue(element.width);
  const height = useSharedValue(element.height);
  const rotation = useSharedValue(element.rotation);

  const start = useSharedValue({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });

  const commit = () => {
    onUpdate({
      x: x.value,
      y: y.value,
      width: width.value,
      height: height.value,
      rotation: rotation.value,
    });
  };

  const select = () => onSelect();

  const pan = Gesture.Pan()
    .minDistance(0)
    .onStart(() => {
      start.value = { ...start.value, x: x.value, y: y.value };
      runOnJS(select)();
    })
    .onUpdate((e) => {
      x.value = start.value.x + e.translationX;
      y.value = start.value.y + e.translationY;
    })
    .onEnd(() => {
      runOnJS(commit)();
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      start.value = {
        ...start.value,
        width: width.value,
        height: height.value,
        x: x.value,
        y: y.value,
      };
    })
    .onUpdate((e) => {
      const newWidth = Math.max(MIN_SIZE, start.value.width * e.scale);
      const newHeight = Math.max(MIN_SIZE, start.value.height * e.scale);
      x.value = start.value.x - (newWidth - start.value.width) / 2;
      y.value = start.value.y - (newHeight - start.value.height) / 2;
      width.value = newWidth;
      height.value = newHeight;
    })
    .onEnd(() => {
      runOnJS(commit)();
    });

  const rotate = Gesture.Rotation()
    .onStart(() => {
      start.value = { ...start.value, rotation: rotation.value };
    })
    .onUpdate((e) => {
      rotation.value = start.value.rotation + (e.rotation * 180) / Math.PI;
    })
    .onEnd(() => {
      runOnJS(commit)();
    });

  const composed = Gesture.Simultaneous(pan, pinch, rotate);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    width: width.value,
    height: height.value,
    transform: [{ rotate: `${rotation.value}deg` }],
    zIndex: element.zIndex,
  }));

  return (
    <>
      <GestureDetector gesture={composed}>
        <Animated.View style={[animatedStyle, isSelected && styles.selected]}>
          <ElementContent element={element} />
        </Animated.View>
      </GestureDetector>
      {isSelected && (
        <View
          style={[
            styles.toolbar,
            {
              left: Math.max(0, element.x),
              top: Math.max(0, element.y - TOOLBAR_HEIGHT - 8),
              zIndex: 9999,
            },
          ]}
        >
          <TouchableOpacity style={styles.toolbarButton} onPress={onBringToFront}>
            <RNText style={styles.toolbarLabel}>front</RNText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={onDelete}>
            <Icon name="delete" size={16} color={colors.plum} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

function ElementContent({ element }: { element: CanvasElement }) {
  if (element.type === 'sticker') {
    const sticker = stickers.find((s) => s.id === element.value);
    if (!sticker) return null;
    return (
      <Image source={sticker.source} style={styles.fill} resizeMode="contain" />
    );
  }
  if (element.type === 'photo') {
    return (
      <Image source={{ uri: element.value }} style={[styles.fill, styles.photo]} resizeMode="cover" />
    );
  }
  return (
    <View style={styles.textWrap} pointerEvents="none">
      <RNText
        style={{
          fontFamily: 'Caveat_700Bold',
          fontSize: element.fontSize ?? 28,
          color: element.color ?? colors.plum,
        }}
      >
        {element.value}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    width: '100%',
    height: '100%',
  },
  photo: {
    borderRadius: radii.sm,
  },
  textWrap: {
    padding: 4,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.denim,
    borderStyle: 'dashed',
    borderRadius: radii.sm,
  },
  toolbar: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 12,
    shadowColor: colors.plum,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  toolbarButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarLabel: {
    fontFamily: 'Jost_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    color: colors.plum,
  },
});
