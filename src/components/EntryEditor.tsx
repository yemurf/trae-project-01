import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toISODate } from "@/utils/date";
import type { DiaryEntry, MoodCode, StoredAttachment } from "@/types/diary";
import { putBlob, deleteBlob } from "@/utils/diaryDb";
import EntryBasicInfoCard from "@/components/EntryBasicInfoCard";
import EntryAttachmentsCard from "@/components/EntryAttachmentsCard";
import EntryContentCard from "@/components/EntryContentCard";
import type { DraftAttachment } from "@/components/entryEditorTypes";
import { useDiaryStore } from "@/stores/useDiaryStore";

export default function EntryEditor({ mode, initial }: { mode: "create" | "edit"; initial?: DiaryEntry }) {
  const navigate = useNavigate();
  const [entryDate, setEntryDate] = useState<string>(initial?.entryDate ?? toISODate(new Date()));
  const [mood, setMood] = useState<MoodCode>(initial?.mood ?? "calm");
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(initial?.intensity ?? 3);
  const [title, setTitle] = useState<string>(initial?.title ?? "");
  const [content, setContent] = useState<string>(initial?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [attachments, setAttachments] = useState<DraftAttachment[]>(() =>
    (initial?.attachments ?? []).map((a) => ({ kind: "existing", meta: a })),
  );

  useEffect(() => {
    setError(null);
  }, [entryDate, mood, intensity, title, content, attachments.length]);

  const validate = () => {
    if (!mood) return "기분을 선택해 주세요.";
    if (!content.trim()) return "몇 줄이라도 내용을 적어 주세요.";
    return null;
  };

  const persistNewAttachments = async (): Promise<StoredAttachment[]> => {
    const existing = attachments
      .filter((a): a is { kind: "existing"; meta: StoredAttachment } => a.kind === "existing")
      .map((a) => a.meta);

    const toCreate = attachments.filter((a): a is Extract<DraftAttachment, { kind: "new" }> => a.kind === "new");
    const created: StoredAttachment[] = [];

    for (const a of toCreate) {
      const record = await putBlob({ blob: a.blob, mimeType: a.mimeType, durationMs: a.durationMs, name: a.name });
      created.push({
        id: a.id,
        type: a.type,
        blobId: record.id,
        name: a.name,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes,
        durationMs: a.durationMs,
        createdAt: a.createdAt,
      });
    }

    return [...existing, ...created];
  };

  const cleanupRemovedExistingBlobs = async (saved: StoredAttachment[]) => {
    if (!initial) return;
    const keep = new Set(saved.map((a) => a.blobId));
    const removed = initial.attachments.filter((a) => !keep.has(a.blobId));
    await Promise.all(removed.map((a) => deleteBlob(a.blobId)));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <EntryBasicInfoCard
          entryDate={entryDate}
          setEntryDate={setEntryDate}
          mood={mood}
          setMood={setMood}
          intensity={intensity}
          setIntensity={setIntensity}
        />

        <div className="mt-4">
          <EntryAttachmentsCard attachments={attachments} setAttachments={setAttachments} />
        </div>
      </div>

      <div className="lg:col-span-7">
        <EntryContentCard
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          error={error}
          saving={saving}
          onCancel={() => {
            if (mode === "edit" && initial) navigate(`/entries/${initial.id}`);
            else navigate("/");
          }}
          onSave={() => {
            const message = validate();
            if (message) {
              setError(message);
              return;
            }

            void (async () => {
              setSaving(true);
              try {
                const savedAttachments = await persistNewAttachments();

                if (mode === "create") {
                  const created = await useDiaryStore.getState().create({
                    entryDate,
                    mood,
                    intensity,
                    title,
                    content: content.trim(),
                    attachments: savedAttachments,
                  });
                  navigate(`/entries/${created.id}`);
                  return;
                }

                if (!initial) {
                  setError("수정할 항목을 불러오지 못했어요.");
                  return;
                }

                const updated = await useDiaryStore.getState().update(initial.id, {
                  entryDate,
                  mood,
                  intensity,
                  title,
                  content: content.trim(),
                  attachments: savedAttachments,
                });

                if (updated) {
                  await cleanupRemovedExistingBlobs(savedAttachments);
                  navigate(`/entries/${updated.id}`);
                }
              } catch {
                setError("저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
              } finally {
                setSaving(false);
              }
            })();
          }}
        />
      </div>
    </div>
  );
}
