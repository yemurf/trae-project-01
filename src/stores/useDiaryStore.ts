import { create } from "zustand";
import type { DiaryEntry, MoodCode, StoredAttachment } from "@/types/diary";
import { listEntries, putEntry, deleteEntry as dbDeleteEntry, getEntry as dbGetEntry } from "@/utils/diaryDb";
import { toISODate } from "@/utils/date";

type LoadStatus = "idle" | "loading" | "ready" | "error";

type DiaryState = {
  status: LoadStatus;
  entries: DiaryEntry[];
  load: () => Promise<void>;
  getById: (id: string) => Promise<DiaryEntry | undefined>;
  create: (input: {
    entryDate?: string;
    mood: MoodCode;
    intensity: 1 | 2 | 3 | 4 | 5;
    title?: string;
    content: string;
    attachments: StoredAttachment[];
  }) => Promise<DiaryEntry>;
  update: (id: string, patch: Partial<Omit<DiaryEntry, "id" | "createdAt">>) => Promise<DiaryEntry | undefined>;
  remove: (id: string) => Promise<void>;
};

export const useDiaryStore = create<DiaryState>((set, get) => ({
  status: "idle",
  entries: [],

  load: async () => {
    set({ status: "loading" });
    try {
      const items = await listEntries();
      set({ entries: items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },

  getById: async (id) => {
    const cached = get().entries.find((e) => e.id === id);
    if (cached) return cached;
    const fromDb = await dbGetEntry(id);
    if (!fromDb) return undefined;
    set({ entries: [fromDb, ...get().entries].sort((a, b) => (b.entryDate !== a.entryDate ? (b.entryDate > a.entryDate ? 1 : -1) : b.updatedAt - a.updatedAt)) });
    return fromDb;
  },

  create: async (input) => {
    const now = Date.now();
    const entry: DiaryEntry = {
      id: globalThis.crypto?.randomUUID?.() ?? `${now}-${Math.random()}`,
      entryDate: input.entryDate ?? toISODate(new Date()),
      mood: input.mood,
      intensity: input.intensity,
      title: input.title?.trim() ? input.title.trim() : undefined,
      content: input.content,
      attachments: input.attachments,
      createdAt: now,
      updatedAt: now,
    };
    await putEntry(entry);
    set({ entries: [entry, ...get().entries].sort((a, b) => (b.entryDate !== a.entryDate ? (b.entryDate > a.entryDate ? 1 : -1) : b.updatedAt - a.updatedAt)) });
    return entry;
  },

  update: async (id, patch) => {
    const existing = await get().getById(id);
    if (!existing) return undefined;
    const updated: DiaryEntry = {
      ...existing,
      ...patch,
      title: patch.title !== undefined ? (patch.title?.trim() ? patch.title.trim() : undefined) : existing.title,
      updatedAt: Date.now(),
    };
    await putEntry(updated);
    set({ entries: get().entries.map((e) => (e.id === id ? updated : e)).sort((a, b) => (b.entryDate !== a.entryDate ? (b.entryDate > a.entryDate ? 1 : -1) : b.updatedAt - a.updatedAt)) });
    return updated;
  },

  remove: async (id) => {
    await dbDeleteEntry(id);
    set({ entries: get().entries.filter((e) => e.id !== id) });
  },
}));

