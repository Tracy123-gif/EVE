import React, { useEffect, useState } from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Card } from '../components/Card';
import { colors, fonts, spacing } from '../theme/theme';
import { generateId } from '../lib/id';
import { createRoom, subscribeToRoom } from '../lib/roomsService';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../navigation/types';
import type { RoomInfo } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'RoomSetup'>;

export function RoomSetupScreen({ route, navigation }: Props) {
  const { mode } = route.params;
  const user = useAuthStore((s) => s.user);
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [roomId] = useState(() => generateId());
  const [copied, setCopied] = useState(false);

  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 800 }), withTiming(0.4, { duration: 800 })),
      -1,
      true,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  useEffect(() => {
    if (!user) return;
    createRoom(roomId, user.uid).catch(() => {});
    const unsubscribe = subscribeToRoom(roomId, setRoom);
    return unsubscribe;
  }, [roomId, user]);

  useEffect(() => {
    if (room?.joinedUserId) {
      navigation.replace('Create', { memoryId: generateId(), mode, roomId });
    }
  }, [room, navigation, mode, roomId]);

  const handleCopy = async () => {
    if (!room) return;
    await Clipboard.setStringAsync(room.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    if (!room) return;
    await Share.share({
      message: `Join me to plan something on EVE — code: ${room.joinCode}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headline}>invite your person</Text>
      <Card style={styles.codeCard}>
        <Text style={styles.codeLabel}>join code</Text>
        <Text style={styles.code}>{room?.joinCode ?? '------'}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Text style={styles.actionText}>{copied ? 'copied!' : 'copy code'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionText}>share</Text>
          </TouchableOpacity>
        </View>
      </Card>
      <View style={styles.waiting}>
        <Animated.View style={[styles.pulseDot, pulseStyle]} />
        <Text style={styles.waitingText}>waiting for them to join...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.lg,
  },
  headline: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 22,
    color: colors.plum,
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  codeCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  codeLabel: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.plum,
    opacity: 0.5,
  },
  code: {
    fontFamily: fonts.importantBold,
    fontSize: 40,
    letterSpacing: 6,
    color: colors.plum,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.plum,
  },
  actionText: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 12,
    color: colors.plum,
    textTransform: 'uppercase',
  },
  waiting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.rose,
  },
  waitingText: {
    fontFamily: fonts.important,
    fontSize: 14,
    color: colors.plum,
    opacity: 0.7,
  },
});
