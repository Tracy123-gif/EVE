import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  GoogleAuthProvider,
} from 'firebase/auth';

import { auth } from './firebase';

function requireAuth() {
  if (!auth) {
    throw new Error(
      'Firebase is not configured yet. Add your keys to .env (see .env.example).',
    );
  }
  return auth;
}

export function friendlyAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return "That email doesn't look right.";
    case 'auth/email-already-in-use':
      return 'An account already exists with that email.';
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return "That email and password don't match.";
    case 'auth/too-many-requests':
      return 'Too many attempts, please wait a moment and try again.';
    default:
      return 'Something went wrong, please try again.';
  }
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  return cred.user;
}

export async function logInWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(requireAuth(), email, password);
  return cred.user;
}

export async function logInWithGoogleIdToken(idToken: string): Promise<User> {
  const credential = GoogleAuthProvider.credential(idToken);
  const cred = await signInWithCredential(requireAuth(), credential);
  return cred.user;
}

export async function logOut(): Promise<void> {
  await signOut(requireAuth());
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
