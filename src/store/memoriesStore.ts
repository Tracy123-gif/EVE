import { create } from 'zustand';

import type { Memory } from '../types/models';

type MemoriesState = {
  memories: Memory[];
  setMemories: (memories: Memory[]) => void;
};

export const useMemoriesStore = create<MemoriesState>((set) => ({
  memories: [],
  setMemories: (memories) => set({ memories }),
}));
