import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../components/Button';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { findRoomByJoinCode, joinRoom } from '../lib/roomsService';
import { generateId } from '../lib/id';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinRoom'>;

const CODE_LENGTH = 6;

export function JoinRoomScreen({ route, navigation }: Props) {
  const { mode } = route.params;
  const user = useAuthStore((s) => s.user);
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const char = text.slice(-1).toUpperCase();
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = digits.join('');
    if (code.length !== CODE_LENGTH || !user) return;
    setError('');
    setLoading(true);
    try {
      const room = await findRoomByJoinCode(code);
      if (!room) {
        setError("that code doesn't look right, double check with them.");
        return;
      }
      await joinRoom(room.roomId, user.uid);
      navigation.replace('Create', {
        memoryId: generateId(),
        mode,
        roomId: room.roomId,
      });
    } catch {
      setError('something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headline}>enter the join code</Text>
      <View style={styles.boxes}>
        {digits.map((digit, i) => (
          <TouchableWithoutFeedback key={i} onPress={() => inputs.current[i]?.focus()}>
            <View style={styles.box}>
              <TextInput
                ref={(r) => {
                  inputs.current[i] = r;
                }}
                style={styles.boxInput}
                value={digit}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                maxLength={1}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button
        label="join"
        onPress={handleSubmit}
        loading={loading}
        disabled={digits.join('').length !== CODE_LENGTH}
        style={{ marginTop: spacing.xl }}
      />
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
    textAlign: 'center',
  },
  boxes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  box: {
    width: 44,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.plum,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  boxInput: {
    fontFamily: fonts.importantBold,
    fontSize: 22,
    color: colors.plum,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  error: {
    fontFamily: fonts.important,
    fontSize: 13,
    color: colors.rose,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
