import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

import { db } from './firebase';
import type { Memory } from '../types/models';

const COLLECTION = 'memories';

function requireDb() {
  if (!db) {
    throw new Error(
      'Firebase is not configured yet. Add your keys to .env (see .env.example).',
    );
  }
  return db;
}

export async function saveMemory(memory: Memory): Promise<void> {
  await setDoc(doc(requireDb(), COLLECTION, memory.id), memory, { merge: true });
}

export function subscribeToMemories(
  userId: string,
  callback: (memories: Memory[]) => void,
) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, COLLECTION),
    where('ownerId', '==', userId),
    orderBy('date', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as Memory));
  });
}

export function subscribeToMemory(
  memoryId: string,
  callback: (memory: Memory | null) => void,
) {
  if (!db) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(db, COLLECTION, memoryId), (snap) => {
    callback(snap.exists() ? (snap.data() as Memory) : null);
  });
}
