export type PlanMode = 'date' | 'solo' | 'bucketlist';

export type CanvasElementType = 'background' | 'sticker' | 'photo' | 'text';

export type CanvasElement = {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  // sticker id, photo uri, background source key, or text content
  value: string;
  // text-only styling
  color?: string;
  fontSize?: number;
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type RoomInfo = {
  roomId: string;
  creatorId: string;
  joinCode: string;
  joinedUserId: string | null;
  status: 'waiting' | 'joined';
  createdAt: number;
};

export type MemoryBack = {
  photos: string[];
  reflectionText?: string;
  voiceNoteUri?: string;
  filledAt?: number;
};

export type Memory = {
  id: string;
  ownerId: string;
  partnerId?: string;
  mode: PlanMode;
  title?: string;
  date: string; // ISO date, yyyy-mm-dd
  note: string;
  checklist: ChecklistItem[];
  canvas: CanvasElement[];
  backgroundKey?: string;
  musicId?: string;
  room?: RoomInfo;
  back?: MemoryBack;
  createdAt: number;
  updatedAt: number;
};
