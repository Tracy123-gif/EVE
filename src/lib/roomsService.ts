import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from './firebase';
import type { RoomInfo } from '../types/models';

const COLLECTION = 'rooms';
// Excludes visually ambiguous characters (0, O, 1, I).
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function requireDb() {
  if (!db) {
    throw new Error(
      'Firebase is not configured yet. Add your keys to .env (see .env.example).',
    );
  }
  return db;
}

export function generateJoinCode(length = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export async function createRoom(
  roomId: string,
  creatorId: string,
): Promise<RoomInfo> {
  const room: RoomInfo = {
    roomId,
    creatorId,
    joinCode: generateJoinCode(),
    joinedUserId: null,
    status: 'waiting',
    createdAt: Date.now(),
  };
  await setDoc(doc(requireDb(), COLLECTION, roomId), room);
  return room;
}

export function subscribeToRoom(
  roomId: string,
  callback: (room: RoomInfo | null) => void,
) {
  if (!db) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(db, COLLECTION, roomId), (snap) => {
    callback(snap.exists() ? (snap.data() as RoomInfo) : null);
  });
}

export async function findRoomByJoinCode(
  joinCode: string,
): Promise<RoomInfo | null> {
  const q = query(
    collection(requireDb(), COLLECTION),
    where('joinCode', '==', joinCode.toUpperCase()),
    where('joinedUserId', '==', null),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as RoomInfo;
}

export async function joinRoom(roomId: string, userId: string): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, roomId), {
    joinedUserId: userId,
    status: 'joined',
  });
}

export async function setReadyState(
  roomId: string,
  userId: string,
  ready: boolean,
): Promise<void> {
  await updateDoc(doc(requireDb(), COLLECTION, roomId), {
    [`readyState.${userId}`]: ready,
  });
}
