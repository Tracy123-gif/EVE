import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

import { MemoryCanvasPreview } from '../components/canvas/MemoryCanvasPreview';
import { Icon } from '../components/Icon';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { useMemories } from '../hooks/useMemories';

export function ScrapbookScreen() {
  const memories = useMemories();
  const sorted = useMemo(
    () => [...memories].sort((a, b) => a.date.localeCompare(b.date)),
    [memories],
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (openIndex === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headline}>table of contents</Text>
        <ScrollView>
          {sorted.length === 0 && (
            <Text style={styles.empty}>nothing in the scrapbook yet.</Text>
          )}
          {sorted.map((m, i) => (
            <TouchableOpacity key={m.id} style={styles.tocRow} onPress={() => setOpenIndex(i)}>
              <Text style={styles.tocDate}>{new Date(m.date).toDateString()}</Text>
              <Text style={styles.tocTitle}>{m.note || m.mode}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spreadHeader}>
        <TouchableOpacity onPress={() => setOpenIndex(null)} hitSlop={12}>
          <Icon name="back" size={20} color={colors.plum} />
        </TouchableOpacity>
      </View>
      <PagerView style={{ flex: 1 }} initialPage={openIndex} onPageSelected={(e) => setOpenIndex(e.nativeEvent.position)}>
        {sorted.map((m) => {
          const isUnlocked = new Date(m.date) <= new Date();
          return (
            <View key={m.id} style={styles.spread}>
              <View style={styles.page}>
                <MemoryCanvasPreview
                  backgroundKey={m.backgroundKey}
                  elements={m.canvas}
                  style={StyleSheet.absoluteFill}
                />
              </View>
              <View style={styles.spine} />
              <View style={[styles.page, styles.backPage]}>
                {isUnlocked && m.back ? (
                  <ScrollView contentContainerStyle={styles.backContent}>
                    <View style={styles.photoRow}>
                      {(m.back.photos ?? []).map((uri, i) => (
                        <Image key={i} source={{ uri }} style={styles.photo} />
                      ))}
                    </View>
                    <Text style={styles.reflection}>{m.back.reflectionText}</Text>
                  </ScrollView>
                ) : (
                  <Text style={styles.comingSoon}>still to come</Text>
                )}
              </View>
            </View>
          );
        })}
      </PagerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paperDark,
  },
  headline: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 20,
    color: colors.plum,
    padding: spacing.lg,
  },
  empty: {
    fontFamily: fonts.important,
    color: colors.plum,
    opacity: 0.5,
    paddingHorizontal: spacing.lg,
  },
  tocRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.plum,
  },
  tocDate: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 12,
    color: colors.plum,
    opacity: 0.6,
  },
  tocTitle: {
    fontFamily: fonts.whimsical,
    fontSize: 18,
    color: colors.plum,
  },
  spreadHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  spread: {
    flex: 1,
    flexDirection: 'row',
    margin: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.paper,
  },
  page: {
    flex: 1,
  },
  backPage: {
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  spine: {
    width: 4,
    backgroundColor: colors.plum,
    opacity: 0.15,
  },
  backContent: {
    gap: spacing.sm,
  },
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: radii.sm,
  },
  reflection: {
    fontFamily: fonts.whimsical,
    fontSize: 16,
    color: colors.plum,
  },
  comingSoon: {
    flex: 1,
    fontFamily: fonts.whimsical,
    fontSize: 18,
    color: colors.plum,
    opacity: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
