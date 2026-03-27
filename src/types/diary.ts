export type MoodCode = "happy" | "sad" | "uncomfortable" | "calm" | "angry" | "anxious";

export type AttachmentType = "photo" | "audio";

export type StoredAttachment = {
  id: string;
  type: AttachmentType;
  blobId: string;
  name?: string;
  mimeType?: string;
  sizeBytes?: number;
  durationMs?: number;
  createdAt: number;
};

export type DiaryEntry = {
  id: string;
  entryDate: string;
  mood: MoodCode;
  intensity: 1 | 2 | 3 | 4 | 5;
  title?: string;
  content: string;
  attachments: StoredAttachment[];
  createdAt: number;
  updatedAt: number;
};

export type MoodDef = {
  code: MoodCode;
  label: string;
  emoji: string;
  color: {
    bg: string;
    text: string;
    ring: string;
  };
};

export const MOODS: MoodDef[] = [
  {
    code: "happy",
    label: "행복",
    emoji: "😊",
    color: { bg: "bg-amber-100", text: "text-amber-900", ring: "ring-amber-200" },
  },
  {
    code: "sad",
    label: "슬픔",
    emoji: "😢",
    color: { bg: "bg-sky-100", text: "text-sky-900", ring: "ring-sky-200" },
  },
  {
    code: "uncomfortable",
    label: "불편",
    emoji: "😣",
    color: { bg: "bg-rose-100", text: "text-rose-900", ring: "ring-rose-200" },
  },
  {
    code: "calm",
    label: "평온",
    emoji: "😌",
    color: { bg: "bg-emerald-100", text: "text-emerald-900", ring: "ring-emerald-200" },
  },
  {
    code: "angry",
    label: "화남",
    emoji: "😠",
    color: { bg: "bg-red-100", text: "text-red-900", ring: "ring-red-200" },
  },
  {
    code: "anxious",
    label: "불안",
    emoji: "😰",
    color: { bg: "bg-violet-100", text: "text-violet-900", ring: "ring-violet-200" },
  },
];

export function getMoodDef(code: MoodCode): MoodDef {
  const found = MOODS.find((m) => m.code === code);
  return found ?? MOODS[0];
}

