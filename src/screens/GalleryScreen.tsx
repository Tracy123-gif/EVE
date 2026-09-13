import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { MemoryCanvasPreview } from '../components/canvas/MemoryCanvasPreview';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { useMemories } from '../hooks/useMemories';
import type { RootStackParamList } from '../navigation/types';

function seededRotation(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  return (hash / 1000) * 24 - 12;
}

function seededOffset(seed: string): { x: number; y: number } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 17 + seed.charCodeAt(i)) % 1000;
  return { x: ((hash % 40) - 20), y: (((hash * 7) % 30) - 15) };
}

export function GalleryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const memories = useMemories();
  const [order, setOrder] = useState<string[]>([]);
  const flip = useSharedValue(1);

  const ids = useMemo(() => memories.map((m) => m.id), [memories]);
  const displayOrder = order.length === ids.length ? order : ids;

  const flipStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flip.value }],
  }));

  const shuffle = () => {
    if (!ids.length) return;
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    const rest = displayOrder.filter((id) => id !== randomId);
    setOrder([...rest, randomId]);
    flip.value = withSequence(withTiming(0.85, { duration: 120 }), withTiming(1, { duration: 180 }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headline}>gallery</Text>
        <TouchableOpacity onPress={shuffle} style={styles.shuffleButton}>
          <Text style={styles.shuffleLabel}>shuffle</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.stack}>
        {displayOrder.map((id, index) => {
          const memory = memories.find((m) => m.id === id);
          if (!memory) return null;
          const rotation = seededRotation(id);
          const offset = seededOffset(id);
          const isFront = index === displayOrder.length - 1;
          const isUnlocked = new Date(memory.date) <= new Date();

          const cardContent = (
            <View
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: offset.x },
                    { translateY: offset.y - index * 2 },
                    { rotate: `${rotation}deg` },
                  ],
                  zIndex: index,
                },
              ]}
            >
              {isUnlocked ? (
                <MemoryCanvasPreview
                  backgroundKey={memory.backgroundKey}
                  elements={memory.canvas}
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <View style={styles.sealed}>
                  <Text style={styles.sealedLabel}>sealed</Text>
                  <Text style={styles.sealedDate}>{new Date(memory.date).toDateString()}</Text>
                </View>
              )}
            </View>
          );

          return (
            <TouchableOpacity
              key={id}
              activeOpacity={0.85}
              style={StyleSheet.absoluteFill}
              onPress={() => navigation.navigate('FlipReveal', { memoryId: id })}
            >
              {isFront ? (
                <Animated.View style={[StyleSheet.absoluteFill, flipStyle]}>
                  {cardContent}
                </Animated.View>
              ) : (
                cardContent
              )}
            </TouchableOpacity>
          );
        })}
        {displayOrder.length === 0 && (
          <Text style={styles.empty}>no memories yet, go make one.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headline: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 20,
    color: colors.plum,
  },
  shuffleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.plum,
  },
  shuffleLabel: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.plum,
  },
  stack: {
    flex: 1,
    margin: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '80%',
    aspectRatio: 0.7,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: colors.plum,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sealed: {
    flex: 1,
    backgroundColor: colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  sealedLabel: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.paper,
  },
  sealedDate: {
    fontFamily: fonts.important,
    fontSize: 12,
    color: colors.paper,
    opacity: 0.7,
  },
  empty: {
    fontFamily: fonts.important,
    color: colors.plum,
    opacity: 0.5,
  },
});
