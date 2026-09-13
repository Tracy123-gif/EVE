import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../components/Button';
import { PagerDots } from '../components/PagerDots';
import { PopSticker } from '../components/onboarding/PopSticker';
import { colors, fonts, spacing } from '../theme/theme';
import { getSticker } from '../lib/stickers';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'> & {
  onDone: () => void;
};

const GRID_PAPER = getSticker('18');
const SMUDGE = getSticker('15');
const STAGGER_MS = 1000;

function PageOne({ active }: { active: boolean }) {
  return (
    <View style={styles.page}>
      <Image source={SMUDGE} style={styles.smudgeOne} resizeMode="contain" />
      <Text style={styles.headlineOne}>IT'S YOUR LIFE</Text>

      <PopSticker
        source={getSticker('1')}
        active={active}
        delayMs={0}
        style={{ left: '2%', top: '4%', width: '30%', height: '18%', transform: [{ rotate: '-6deg' }] }}
      />
      <PopSticker
        source={getSticker('8')}
        active={active}
        delayMs={STAGGER_MS}
        style={{ left: '30%', top: '10%', width: '18%', height: '14%' }}
      />
      <PopSticker
        source={getSticker('7')}
        active={active}
        delayMs={STAGGER_MS * 2}
        style={{ left: '62%', top: '2%', width: '38%', height: '22%', transform: [{ rotate: '8deg' }] }}
      />
      <PopSticker
        source={getSticker('4')}
        active={active}
        delayMs={STAGGER_MS * 3}
        style={{ left: '0%', top: '62%', width: '32%', height: '16%', transform: [{ rotate: '-8deg' }] }}
      />
      <PopSticker
        source={getSticker('5')}
        active={active}
        delayMs={STAGGER_MS * 4}
        style={{ left: '66%', top: '54%', width: '32%', height: '14%', transform: [{ rotate: '10deg' }] }}
      />
      <PopSticker
        source={getSticker('6')}
        active={active}
        delayMs={STAGGER_MS * 5}
        style={{ left: '0%', top: '78%', width: '24%', height: '13%', transform: [{ rotate: '-4deg' }] }}
      />
      <PopSticker
        source={getSticker('2')}
        active={active}
        delayMs={STAGGER_MS * 6}
        style={{ left: '38%', top: '76%', width: '22%', height: '16%' }}
      />
      <PopSticker
        source={getSticker('3')}
        active={active}
        delayMs={STAGGER_MS * 7}
        style={{ left: '74%', top: '72%', width: '22%', height: '18%', transform: [{ rotate: '6deg' }] }}
      />
    </View>
  );
}

function PageTwo({ active }: { active: boolean }) {
  return (
    <View style={styles.page}>
      <Image source={SMUDGE} style={styles.smudgeTwo} resizeMode="contain" />
      <Text style={styles.headlineTwo}>Make memories</Text>

      <PopSticker
        source={getSticker('9')}
        active={active}
        delayMs={0}
        style={{ left: '0%', top: '0%', width: '100%', height: '20%' }}
      />
      <PopSticker
        source={getSticker('14')}
        active={active}
        delayMs={STAGGER_MS}
        style={{ left: '0%', top: '25%', width: '26%', height: '15%' }}
      />
      <PopSticker
        source={getSticker('12')}
        active={active}
        delayMs={STAGGER_MS * 2}
        style={{ left: '64%', top: '24%', width: '36%', height: '24%', transform: [{ rotate: '-8deg' }] }}
      />
      <PopSticker
        source={getSticker('10')}
        active={active}
        delayMs={STAGGER_MS * 3}
        style={{ left: '2%', top: '58%', width: '30%', height: '18%' }}
      />
      <PopSticker
        source={getSticker('11')}
        active={active}
        delayMs={STAGGER_MS * 4}
        style={{ left: '58%', top: '54%', width: '34%', height: '24%', transform: [{ rotate: '4deg' }] }}
      />
      <PopSticker
        source={getSticker('13')}
        active={active}
        delayMs={STAGGER_MS * 5}
        style={{ left: '0%', top: '76%', width: '48%', height: '24%' }}
      />
    </View>
  );
}

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
      <Image source={GRID_PAPER} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <PagerDots count={2} activeIndex={page} />
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        <PageOne key="page-1" active={page === 0} />
        <PageTwo key="page-2" active={page === 1} />
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
  },
  smudgeOne: {
    position: 'absolute',
    left: '15%',
    top: '32%',
    width: '70%',
    height: '22%',
  },
  smudgeTwo: {
    position: 'absolute',
    left: '18%',
    top: '42%',
    width: '64%',
    height: '18%',
  },
  headlineOne: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: '38%',
    fontFamily: fonts.whimsicalBold,
    fontSize: 34,
    color: colors.plum,
    textAlign: 'center',
  },
  headlineTwo: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: '46%',
    fontFamily: fonts.whimsicalBold,
    fontSize: 34,
    color: colors.plum,
    textAlign: 'center',
  },
  ctaWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
