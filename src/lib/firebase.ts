import AsyncStorage from '@react-native-async-storage/async-storage';
import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
  type Auth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { type FirebaseStorage, getStorage } from 'firebase/storage';

// Firebase's client-side web config (apiKey, projectId, etc.) is not a
// secret: it's baked into every client build by design, and access control
// is enforced by Firestore/Storage security rules instead. It's checked in
// directly here so the app works out of the box; an EXPO_PUBLIC_ env var,
// if set, still overrides it for pointing at a different Firebase project.
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyA1qUXEPSY_rVf-rzkOpts641RMjd5TxHc',
  authDomain: 'evee-a0d8f.firebaseapp.com',
  projectId: 'evee-a0d8f',
  storageBucket: 'evee-a0d8f.firebasestorage.app',
  messagingSenderId: '558378251622',
  appId: '1:558378251622:web:f8d61cfe8ea92fbf2fc4a7',
};

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? DEFAULT_FIREBASE_CONFIG.appId,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  db = getFirestore(app);
  storage = getStorage(app);
} else if (__DEV__) {
  // eslint-disable-next-line no-console
  console.warn(
    'Firebase is not configured. Copy .env.example to .env and fill in ' +
      'your Firebase project keys to enable auth, Firestore, and storage.',
  );
}

export { app, auth, db, storage };
