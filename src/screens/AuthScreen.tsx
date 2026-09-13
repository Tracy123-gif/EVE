import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';

import { Button } from '../components/Button';
import { colors, fonts, radii, spacing } from '../theme/theme';
import {
  friendlyAuthError,
  logInWithEmail,
  logInWithGoogleIdToken,
  signUpWithEmail,
} from '../lib/authService';
import { isFirebaseConfigured } from '../lib/firebase';

const GOOGLE_CLIENT_ID_IOS = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_CLIENT_ID_ANDROID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const GOOGLE_CLIENT_ID_WEB = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleConfigured = Boolean(
  GOOGLE_CLIENT_ID_IOS || GOOGLE_CLIENT_ID_ANDROID || GOOGLE_CLIENT_ID_WEB,
);

export function AuthScreen() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [, googleResponse, promptGoogle] = googleConfigured
    ? Google.useIdTokenAuthRequest({
        iosClientId: GOOGLE_CLIENT_ID_IOS,
        androidClientId: GOOGLE_CLIENT_ID_ANDROID,
        clientId: GOOGLE_CLIENT_ID_WEB,
      })
    : [null, null, async () => {}];

  React.useEffect(() => {
    if (googleResponse?.type === 'success' && googleResponse.params.id_token) {
      logInWithGoogleIdToken(googleResponse.params.id_token).catch((e) =>
        setError(friendlyAuthError(e.code ?? '')),
      );
    }
  }, [googleResponse]);

  const isSignUp = mode === 'signup';

  const handleSubmit = async () => {
    setError('');
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in every field.');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(name, email, password);
      } else {
        await logInWithEmail(email, password);
      }
    } catch (e: any) {
      setError(friendlyAuthError(e.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headline}>
            {isSignUp ? "let's get started" : 'welcome back'}
          </Text>

          {!isFirebaseConfigured && (
            <Text style={styles.warning}>
              Firebase isn't configured yet. Add your project keys to .env to enable
              sign up and log in.
            </Text>
          )}

          {isSignUp && (
            <View style={styles.field}>
              <Text style={styles.label}>name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="your name"
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Button
            label={isSignUp ? 'sign up' : 'log in'}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: spacing.md }}
          />

          {googleConfigured && (
            <Button
              label="continue with google"
              variant="secondary"
              onPress={() => promptGoogle()}
              style={{ marginTop: spacing.sm }}
            />
          )}

          <TouchableOpacity
            style={styles.toggle}
            onPress={() => {
              setError('');
              setMode(isSignUp ? 'login' : 'signup');
            }}
          >
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'already have an account? log in'
                : "don't have an account? sign up"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  headline: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 24,
    color: colors.plum,
    marginBottom: spacing.xl,
  },
  warning: {
    fontFamily: fonts.important,
    fontSize: 12,
    color: colors.rose,
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.importantSemiBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.plum,
    opacity: 0.6,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.important,
    fontSize: 15,
    color: colors.plum,
    shadowColor: colors.plum,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  error: {
    fontFamily: fonts.important,
    fontSize: 13,
    color: colors.rose,
    marginTop: spacing.xs,
  },
  toggle: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  toggleText: {
    fontFamily: fonts.important,
    fontSize: 13,
    color: colors.plum,
    textDecorationLine: 'underline',
  },
});
