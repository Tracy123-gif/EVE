import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { Icon } from '../components/Icon';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { useAuthStore } from '../store/authStore';
import { useMemories } from '../hooks/useMemories';

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const memories = useMemories();
  const [photoUri, setPhotoUri] = React.useState<string | null>(user?.photoURL ?? null);

  const stats = useMemo(() => {
    const total = memories.length;
    const completed = memories.filter((m) => m.back?.reflectionText || m.back?.photos.length).length;
    return { total, completed };
  }, [memories]);

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.avatarWrap} onPress={handlePickPhoto}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Icon name="profile" size={32} color={colors.plum} />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.name}>{user?.displayName ?? 'your name'}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>memories</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>completed</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  avatarWrap: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    backgroundColor: colors.paperDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 20,
    color: colors.plum,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.importantBold,
    fontSize: 24,
    color: colors.plum,
  },
  statLabel: {
    fontFamily: fonts.important,
    fontSize: 11,
    textTransform: 'uppercase',
    color: colors.plum,
    opacity: 0.5,
    marginTop: 2,
  },
});
