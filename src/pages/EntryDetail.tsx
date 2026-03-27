import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useDiaryStore } from "@/stores/useDiaryStore";
import { formatKoreanDate } from "@/utils/date";
import { getMoodDef } from "@/types/diary";
import BlobMedia from "@/components/BlobMedia";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getById = useDiaryStore((s) => s.getById);
  const remove = useDiaryStore((s) => s.remove);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(id ?? null);

  const entry = useDiaryStore((s) => (entryId ? s.entries.find((e) => e.id === entryId) : undefined));

  useEffect(() => {
    if (!id) return;
    setEntryId(id);
    setLoading(true);
    setNotFound(false);
    void (async () => {
      const found = await getById(id);
      setLoading(false);
      setNotFound(!found);
    })();
  }, [getById, id]);

  const mood = useMemo(() => (entry ? getMoodDef(entry.mood) : null), [entry]);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/60 ring-1 ring-zinc-200" />;
  }

  if (notFound || !entry || !mood) {
    return (
      <Card className="p-10 text-center">
        <div className="text-lg font-semibold">일기를 찾지 못했어요</div>
        <div className="mt-2 text-sm text-zinc-600">삭제되었거나 아직 저장되지 않았을 수 있어요.</div>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate("/")}>홈으로</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1",
                mood.color.bg,
                mood.color.text,
                mood.color.ring,
              )}
            >
              <span className="text-sm leading-none">{mood.emoji}</span>
              {mood.label}
            </span>
            <span className="text-xs text-zinc-500">강도 {entry.intensity}/5</span>
          </div>
          <div className="mt-2 text-xl font-semibold">{entry.title?.trim() ? entry.title : formatKoreanDate(entry.entryDate)}</div>
          <div className="mt-1 text-sm text-zinc-600">{formatKoreanDate(entry.entryDate)}</div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate(`/entries/${entry.id}/edit`)}>
            <Pencil className="h-4 w-4" />
            수정
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              const ok = window.confirm("이 일기를 삭제할까요? (첨부도 함께 삭제돼요)");
              if (!ok) return;
              void (async () => {
                await remove(entry.id);
                navigate("/");
              })();
            }}
          >
            <Trash2 className="h-4 w-4" />
            삭제
          </Button>
        </div>
      </div>

      <Card>
        <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-800">{entry.content}</div>
      </Card>

      {entry.attachments.length > 0 && (
        <div className="mt-4 grid gap-3">
          {entry.attachments.map((a) => (
            <Card key={a.id}>
              <div className="text-xs font-medium text-zinc-600">{a.type === "photo" ? "사진" : "음성"}</div>
              <div className="mt-2">
                {a.type === "photo" ? (
                  <BlobMedia blobId={a.blobId} kind="image" className="max-h-[420px] w-full rounded-xl object-cover" />
                ) : (
                  <BlobMedia blobId={a.blobId} kind="audio" className="w-full" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

