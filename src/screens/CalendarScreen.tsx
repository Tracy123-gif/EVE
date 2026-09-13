import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MemoryCanvasPreview } from '../components/canvas/MemoryCanvasPreview';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { formatMonthYear, getMonthGrid, WEEKDAY_LABELS } from '../lib/calendar';
import { useMemories } from '../hooks/useMemories';
import type { RootStackParamList } from '../navigation/types';

export function CalendarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const memories = useMemories();
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const memoryByDate = useMemo(() => {
    const map = new Map<string, (typeof memories)[number]>();
    memories.forEach((m) => map.set(m.date, m));
    return map;
  }, [memories]);

  const weeks = useMemo(() => getMonthGrid(cursor.year, cursor.month), [cursor]);

  const goPrev = () =>
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  const goNext = () =>
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goPrev} hitSlop={12}>
          <Text style={styles.arrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{formatMonthYear(cursor.year, cursor.month)}</Text>
        <TouchableOpacity onPress={goNext} hitSlop={12}>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, i) => (
          <Text key={i} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.week}>
          {week.map((day, di) => {
            if (!day) return <View key={di} style={styles.cell} />;
            const memory = memoryByDate.get(day.iso);
            return (
              <TouchableOpacity
                key={di}
                style={styles.cell}
                disabled={!memory}
                onPress={() => memory && navigation.navigate('FlipReveal', { memoryId: memory.id })}
              >
                {memory ? (
                  <View style={styles.cellFilled}>
                    <MemoryCanvasPreview
                      backgroundKey={memory.backgroundKey}
                      elements={memory.canvas}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{day.date.getDate()}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.dayNumber}>{day.date.getDate()}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </SafeAreaView>
  );
}

const CELL_SIZE = `${100 / 7}%`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  arrow: {
    fontSize: 24,
    color: colors.plum,
    fontFamily: fonts.important,
    paddingHorizontal: spacing.md,
  },
  monthLabel: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 17,
    color: colors.plum,
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontFamily: fonts.importantSemiBold,
    fontSize: 11,
    color: colors.plum,
    opacity: 0.5,
  },
  week: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    aspectRatio: 1,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFilled: {
    flex: 1,
    width: '100%',
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  dayNumber: {
    fontFamily: fonts.important,
    fontSize: 13,
    color: colors.plum,
    opacity: 0.6,
  },
  badge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 10,
    color: colors.plum,
  },
});
