import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function EntryContentCard({
  title,
  setTitle,
  content,
  setContent,
  error,
  saving,
  onCancel,
  onSave,
}: {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  error: string | null;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <Card>
      <div className="text-sm font-semibold">내용</div>
      <div className="mt-3 grid gap-3">
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600">제목(선택)</div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="짧은 제목을 적어도 좋아요" />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600">본문</div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 있었던 일이나 기분을 몇 줄 적어보세요"
            rows={12}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
            <span>{content.trim().length ? `${content.trim().length}자` : ""}</span>
            <span
              className={cn(
                "rounded-full px-2 py-1",
                content.trim().length ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100",
              )}
            >
              {content.trim().length ? "저장 준비" : "내용 필요"}
            </span>
          </div>
        </div>

        {error && <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button disabled={saving} onClick={onSave}>
            {saving ? "저장 중…" : "저장"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

