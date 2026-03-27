import type { AttachmentType, StoredAttachment } from "@/types/diary";

export type DraftAttachment =
  | { kind: "existing"; meta: StoredAttachment }
  | {
      kind: "new";
      id: string;
      type: AttachmentType;
      blob: Blob;
      name?: string;
      mimeType?: string;
      sizeBytes?: number;
      durationMs?: number;
      createdAt: number;
    };

export function attachmentKey(a: DraftAttachment): string {
  return a.kind === "existing" ? a.meta.id : a.id;
}

