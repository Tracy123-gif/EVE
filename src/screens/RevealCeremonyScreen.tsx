import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '../components/Button';
import { colors, fonts, spacing } from '../theme/theme';
import { setReadyState, subscribeToRoom } from '../lib/roomsService';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../navigation/types';
import type { RoomInfo } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'RevealCeremony'>;

const SOLO_REVEAL_WINDOW_MS = 24 * 60 * 60 * 1000;

export function RevealCeremonyScreen({ route, navigation }: Props) {
  const { memoryId, roomId } = route.params;
  const user = useAuthStore((s) => s.user);
  const [room, setRoom] = useState<(RoomInfo & { readyState?: Record<string, boolean> }) | null>(
    null,
  );
  const [imReady, setImReady] = useState(false);
  const [merging, setMerging] = useState(false);

  const merge = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId, (r) => setRoom(r as any));
    return unsubscribe;
  }, [roomId]);

  const readyState = room?.readyState ?? {};
  const ids = [room?.creatorId, room?.joinedUserId].filter(Boolean) as string[];
  const bothReady = ids.length === 2 && ids.every((id) => readyState[id]);
  const partnerReady = ids.some((id) => id !== user?.uid && readyState[id]);
  const canProceedAlone =
    !!room && Date.now() - room.createdAt > SOLO_REVEAL_WINDOW_MS && imReady && !partnerReady;

  useEffect(() => {
    if (bothReady || canProceedAlone) {
      setMerging(true);
      merge.value = withTiming(1, { duration: 900 }, (finished) => {
        if (finished) {
          navigation.replace('FlipReveal', { memoryId });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bothReady, canProceedAlone]);

  const leftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -merge.value * 60 }],
    opacity: 1 - merge.value * 0.3,
  }));
  const rightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: merge.value * 60 }],
    opacity: 1 - merge.value * 0.3,
  }));

  const handleReady = async () => {
    if (!user) return;
    setImReady(true);
    await setReadyState(roomId, user.uid, true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headline}>ready to reveal?</Text>

      {merging ? (
        <View style={styles.mergeRow}>
          <Animated.View style={[styles.card, leftStyle]} />
          <Animated.View style={[styles.card, rightStyle]} />
        </View>
      ) : (
        <>
          <Button label="I'm ready" onPress={handleReady} disabled={imReady} />
          {imReady && !partnerReady && (
            <Text style={styles.waiting}>waiting for your partner...</Text>
          )}
          {canProceedAlone && (
            <Text style={styles.gentle}>
              you're seeing this before they are, that's okay
            </Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  headline: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 24,
    color: colors.plum,
  },
  waiting: {
    fontFamily: fonts.important,
    fontSize: 13,
    color: colors.plum,
    opacity: 0.6,
  },
  gentle: {
    fontFamily: fonts.whimsical,
    fontSize: 18,
    color: colors.plum,
    textAlign: 'center',
  },
  mergeRow: {
    flexDirection: 'row',
    gap: 4,
  },
  card: {
    width: 90,
    height: 130,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: colors.plum,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
