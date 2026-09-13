import { create } from 'zustand';

import type { CanvasElement, ChecklistItem, PlanMode, RoomInfo } from '../types/models';

type EditorState = {
  memoryId: string;
  mode: PlanMode;
  isShared: boolean;
  room: RoomInfo | null;
  backgroundKey: string | null;
  musicId: string | null;
  elements: CanvasElement[];
  selectedElementId: string | null;
  date: string | null;
  note: string;
  checklist: ChecklistItem[];

  reset: (memoryId: string, mode: PlanMode) => void;
  setShared: (room: RoomInfo | null) => void;
  setBackground: (key: string) => void;
  setMusic: (id: string | null) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, patch: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  bringToFront: (id: string) => void;
  selectElement: (id: string | null) => void;
  setDate: (date: string) => void;
  setNote: (note: string) => void;
  addChecklistItem: (label: string) => void;
  toggleChecklistItem: (id: string) => void;
  removeChecklistItem: (id: string) => void;
  loadFromMemory: (data: {
    elements: CanvasElement[];
    backgroundKey?: string;
    musicId?: string;
    date?: string;
    note?: string;
    checklist?: ChecklistItem[];
    room?: RoomInfo;
  }) => void;
};

let nextZIndex = 1;

export const useEditorStore = create<EditorState>((set, get) => ({
  memoryId: '',
  mode: 'date',
  isShared: false,
  room: null,
  backgroundKey: null,
  musicId: null,
  elements: [],
  selectedElementId: null,
  date: null,
  note: '',
  checklist: [],

  reset: (memoryId, mode) =>
    set({
      memoryId,
      mode,
      isShared: false,
      room: null,
      backgroundKey: null,
      musicId: null,
      elements: [],
      selectedElementId: null,
      date: null,
      note: '',
      checklist: [],
    }),

  setShared: (room) => set({ isShared: !!room, room }),
  setBackground: (key) => set({ backgroundKey: key }),
  setMusic: (id) => set({ musicId: id }),

  addElement: (element) => {
    nextZIndex += 1;
    set((s) => ({
      elements: [...s.elements, { ...element, zIndex: nextZIndex }],
      selectedElementId: element.id,
    }));
  },

  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
    })),

  removeElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((el) => el.id !== id),
      selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
    })),

  bringToFront: (id) => {
    nextZIndex += 1;
    const z = nextZIndex;
    set((s) => ({
      elements: s.elements.map((el) => (el.id === id ? { ...el, zIndex: z } : el)),
    }));
  },

  selectElement: (id) => set({ selectedElementId: id }),
  setDate: (date) => set({ date }),
  setNote: (note) => set({ note }),

  addChecklistItem: (label) =>
    set((s) => ({
      checklist: [
        ...s.checklist,
        { id: `${Date.now()}-${s.checklist.length}`, label, done: false },
      ],
    })),

  toggleChecklistItem: (id) =>
    set((s) => ({
      checklist: s.checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    })),

  removeChecklistItem: (id) =>
    set((s) => ({ checklist: s.checklist.filter((item) => item.id !== id) })),

  loadFromMemory: (data) => {
    const maxZ = data.elements.reduce((m, el) => Math.max(m, el.zIndex), 0);
    nextZIndex = maxZ + 1;
    set({
      elements: data.elements,
      backgroundKey: data.backgroundKey ?? null,
      musicId: data.musicId ?? null,
      date: data.date ?? get().date,
      note: data.note ?? '',
      checklist: data.checklist ?? [],
      room: data.room ?? null,
      isShared: !!data.room,
    });
  },
}));
