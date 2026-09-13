import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../components/Button';
import { PagerDots } from '../components/PagerDots';
import { colors, fonts, spacing } from '../theme/theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'> & {
  onDone: () => void;
};

const PAGES = [
  {
    headline: "it's your life, plan it lovingly",
    stickers: ['🍬', '🎬', '👞'],
  },
  {
    headline: 'make memories before they happen',
    stickers: ['📷', '🌻', '🎟️'],
  },
];

export function OnboardingScreen({ navigation, onDone }: Props) {
  const pagerRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);

  const handleCta = () => {
    if (page === 0) {
      pagerRef.current?.setPage(1);
    } else {
      onDone();
      navigation.replace('Auth');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PagerDots count={PAGES.length} activeIndex={page} />
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {PAGES.map((p, i) => (
          <View key={i} style={styles.page}>
            <View style={styles.clothesline}>
              <View style={styles.line} />
              <View style={styles.polaroidRow}>
                {[0, 1, 2].map((j) => (
                  <View key={j} style={styles.polaroid} />
                ))}
              </View>
            </View>
            <Text style={styles.headline}>{p.headline}</Text>
            <View style={styles.stickerRow}>
              {p.stickers.map((s, j) => (
                <Text key={j} style={styles.sticker}>
                  {s}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </PagerView>
      <View style={styles.ctaWrap}>
        <Button label="LET'S GET STARTED" onPress={handleCta} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingTop: spacing.md,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  clothesline: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  line: {
    width: 220,
    height: 2,
    backgroundColor: colors.plum,
    opacity: 0.3,
  },
  polaroidRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: -6,
  },
  polaroid: {
    width: 50,
    height: 60,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.paperDark,
  },
  headline: {
    fontFamily: fonts.whimsicalBold,
    fontSize: 30,
    color: colors.plum,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  stickerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  sticker: {
    fontSize: 28,
  },
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
