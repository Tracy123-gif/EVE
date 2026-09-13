import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Icon } from '../components/Icon';
import { PagerDots } from '../components/PagerDots';
import { EditorScreen } from './EditorScreen';
import { DetailsScreen } from './DetailsScreen';
import { colors, spacing } from '../theme/theme';
import { useEditorStore } from '../store/editorStore';
import { useAuthStore } from '../store/authStore';
import { saveMemory, subscribeToMemory } from '../lib/memoriesService';
import type { RootStackParamList } from '../navigation/types';
import type { Memory, RoomInfo } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'Create'>;

const AUTOSAVE_INTERVAL = 8000;

export function CreateScreen({ route, navigation }: Props) {
  const { memoryId, mode, roomId } = route.params;
  const user = useAuthStore((s) => s.user);
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = React.useState(0);

  const reset = useEditorStore((s) => s.reset);
  const loadFromMemory = useEditorStore((s) => s.loadFromMemory);
  const setShared = useEditorStore((s) => s.setShared);

  useEffect(() => {
    reset(memoryId, mode);
    if (roomId) {
      setShared({
        roomId,
        creatorId: user?.uid ?? '',
        joinCode: '',
        joinedUserId: null,
        status: 'joined',
        createdAt: Date.now(),
      } as RoomInfo);
    }
    const unsubscribe = subscribeToMemory(memoryId, (memory) => {
      if (memory) {
        loadFromMemory({
          elements: memory.canvas,
          backgroundKey: memory.backgroundKey,
          musicId: memory.musicId,
          date: memory.date,
          note: memory.note,
          checklist: memory.checklist,
          room: memory.room,
        });
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoryId]);

  const buildMemory = (): Memory => {
    const s = useEditorStore.getState();
    return {
      id: memoryId,
      ownerId: user?.uid ?? 'anonymous',
      mode,
      date: s.date ?? new Date().toISOString().slice(0, 10),
      note: s.note,
      checklist: s.checklist,
      canvas: s.elements,
      backgroundKey: s.backgroundKey ?? undefined,
      musicId: s.musicId ?? undefined,
      room: s.room ?? undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  };

  const persist = () => {
    if (!user) return;
    saveMemory(buildMemory()).catch(() => {});
  };

  useEffect(() => {
    const interval = setInterval(persist, AUTOSAVE_INTERVAL);
    return () => {
      clearInterval(interval);
      persist();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, memoryId]);

  const handleDone = () => {
    persist();
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Icon name="back" size={22} color={colors.plum} />
        </TouchableOpacity>
        <PagerDots count={2} activeIndex={page} />
        <TouchableOpacity onPress={handleDone} hitSlop={12}>
          <Icon name="checkbox-checked" size={22} color={colors.plum} />
        </TouchableOpacity>
      </View>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        <View key="editor" style={{ flex: 1 }}>
          <EditorScreen />
        </View>
        <View key="details" style={{ flex: 1 }}>
          <DetailsScreen />
        </View>
      </PagerView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pager: {
    flex: 1,
  },
});
