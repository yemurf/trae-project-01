import { openDB, type DBSchema } from "idb";
import type { DiaryEntry } from "@/types/diary";

type BlobRecord = {
  id: string;
  blob: Blob;
  mimeType?: string;
  createdAt: number;
  durationMs?: number;
  sizeBytes?: number;
  name?: string;
};

interface DiaryDbSchema extends DBSchema {
  entries: {
    key: string;
    value: DiaryEntry;
    indexes: { "by-entryDate": string; "by-updatedAt": number };
  };
  blobs: {
    key: string;
    value: BlobRecord;
  };
}

const DB_NAME = "calm-diary";
const DB_VERSION = 1;

async function getDb() {
  return openDB<DiaryDbSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("entries")) {
        const store = db.createObjectStore("entries", { keyPath: "id" });
        store.createIndex("by-entryDate", "entryDate");
        store.createIndex("by-updatedAt", "updatedAt");
      }

      if (!db.objectStoreNames.contains("blobs")) {
        db.createObjectStore("blobs", { keyPath: "id" });
      }
    },
  });
}

export async function listEntries(): Promise<DiaryEntry[]> {
  const db = await getDb();
  const all = await db.getAll("entries");
  return all.sort((a, b) => (b.entryDate !== a.entryDate ? (b.entryDate > a.entryDate ? 1 : -1) : b.updatedAt - a.updatedAt));
}

export async function getEntry(id: string): Promise<DiaryEntry | undefined> {
  const db = await getDb();
  return db.get("entries", id);
}

export async function putEntry(entry: DiaryEntry): Promise<void> {
  const db = await getDb();
  await db.put("entries", entry);
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDb();
  const existing = await db.get("entries", id);
  if (existing) {
    await Promise.all(existing.attachments.map((a) => db.delete("blobs", a.blobId)));
  }
  await db.delete("entries", id);
}

export async function putBlob(input: {
  blob: Blob;
  mimeType?: string;
  durationMs?: number;
  name?: string;
}): Promise<BlobRecord> {
  const db = await getDb();
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  const record: BlobRecord = {
    id,
    blob: input.blob,
    mimeType: input.mimeType,
    durationMs: input.durationMs,
    createdAt: Date.now(),
    sizeBytes: input.blob.size,
    name: input.name,
  };
  await db.put("blobs", record);
  return record;
}

export async function getBlob(blobId: string): Promise<BlobRecord | undefined> {
  const db = await getDb();
  return db.get("blobs", blobId);
}

export async function deleteBlob(blobId: string): Promise<void> {
  const db = await getDb();
  await db.delete("blobs", blobId);
}

