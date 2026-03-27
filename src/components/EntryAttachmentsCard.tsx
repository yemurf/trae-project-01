import { useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import type { DraftAttachment } from "@/components/entryEditorTypes";
import { attachmentKey } from "@/components/entryEditorTypes";
import BlobMedia from "@/components/BlobMedia";
import { ImageIcon, Mic, Trash2 } from "lucide-react";

export default function EntryAttachmentsCard({
  attachments,
  setAttachments,
}: {
  attachments: DraftAttachment[];
  setAttachments: (updater: (prev: DraftAttachment[]) => DraftAttachment[]) => void;
}) {
  const audio = useAudioRecorder();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const audioPreviewUrlRef = useRef<string | null>(null);

  const newPhotoPreviews = useMemo(() => {
    const items = new Map<string, string>();
    for (const a of attachments) {
      if (a.kind !== "new") continue;
      if (a.type !== "photo") continue;
      items.set(a.id, URL.createObjectURL(a.blob));
    }
    return items;
  }, [attachments]);

  const newAudioPreviews = useMemo(() => {
    const items = new Map<string, string>();
    for (const a of attachments) {
      if (a.kind !== "new") continue;
      if (a.type !== "audio") continue;
      items.set(a.id, URL.createObjectURL(a.blob));
    }
    return items;
  }, [attachments]);

  useEffect(() => {
    return () => {
      for (const url of newPhotoPreviews.values()) URL.revokeObjectURL(url);
    };
  }, [newPhotoPreviews]);

  useEffect(() => {
    return () => {
      for (const url of newAudioPreviews.values()) URL.revokeObjectURL(url);
    };
  }, [newAudioPreviews]);

  useEffect(() => {
    if (audioPreviewUrlRef.current) {
      URL.revokeObjectURL(audioPreviewUrlRef.current);
      audioPreviewUrlRef.current = null;
    }

    if (!audio.lastBlob) {
      setAudioPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(audio.lastBlob);
    audioPreviewUrlRef.current = url;
    setAudioPreviewUrl(url);
    return () => {
      if (audioPreviewUrlRef.current) {
        URL.revokeObjectURL(audioPreviewUrlRef.current);
        audioPreviewUrlRef.current = null;
      }
    };
  }, [audio.lastBlob]);

  const onPickPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: DraftAttachment[] = [];
    for (const f of Array.from(files)) {
      next.push({
        kind: "new",
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        type: "photo",
        blob: f,
        name: f.name,
        mimeType: f.type,
        sizeBytes: f.size,
        createdAt: Date.now(),
      });
    }
    setAttachments((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addAudioAttachment = (blob: Blob, durationMs?: number) => {
    setAttachments((prev) => [
      ...prev,
      {
        kind: "new",
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        type: "audio",
        blob,
        name: "voice-memo.webm",
        mimeType: blob.type,
        sizeBytes: blob.size,
        durationMs,
        createdAt: Date.now(),
      },
    ]);
    audio.reset();
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => (a.kind === "existing" ? a.meta.id !== id : a.id !== id)));
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">첨부</div>
          <div className="text-xs text-zinc-500">사진 또는 음성 메모를 추가할 수 있어요</div>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onPickPhotos(e.target.files)}
          />
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="h-4 w-4" />
            사진
          </Button>
          {audio.supported ? (
            audio.isRecording ? (
              <Button variant="danger" size="sm" onClick={audio.stop}>
                <Mic className="h-4 w-4" />
                녹음 중
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => void audio.start()}>
                <Mic className="h-4 w-4" />
                음성
              </Button>
            )
          ) : (
            <div className="text-xs text-zinc-500">이 브라우저에서는 녹음을 지원하지 않아요</div>
          )}
        </div>
      </div>

      {audio.lastBlob && audioPreviewUrl && (
        <div className="mt-3 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
          <div className="mb-2 text-xs font-medium text-zinc-600">방금 녹음한 음성</div>
          <audio controls src={audioPreviewUrl} className="w-full" />
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={audio.reset}>
              취소
            </Button>
            <Button size="sm" onClick={() => addAudioAttachment(audio.lastBlob!, audio.durationMs)}>
              첨부하기
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-3">
        {attachments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500">
            아직 첨부가 없어요
          </div>
        ) : (
          <div className="grid gap-3">
            {attachments.map((a) => {
              const id = attachmentKey(a);
              const type = a.kind === "existing" ? a.meta.type : a.type;
              const title = type === "photo" ? "사진" : "음성";
              return (
                <div key={id} className="rounded-2xl bg-white/60 p-3 ring-1 ring-zinc-200">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-medium text-zinc-700">{title}</div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      삭제
                    </button>
                  </div>
                  <div className="mt-2">
                    {type === "photo" ? (
                      a.kind === "existing" ? (
                        <BlobMedia blobId={a.meta.blobId} kind="image" className="h-40 w-full rounded-xl object-cover" />
                      ) : (
                        <img
                          src={newPhotoPreviews.get(a.id)}
                          alt="새로 추가된 사진"
                          className="h-40 w-full rounded-xl object-cover"
                        />
                      )
                    ) : a.kind === "existing" ? (
                      <BlobMedia blobId={a.meta.blobId} kind="audio" className="w-full" />
                    ) : (
                      <audio className="w-full" controls src={newAudioPreviews.get(a.id)} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
