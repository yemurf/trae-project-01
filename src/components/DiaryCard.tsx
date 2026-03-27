import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { DiaryEntry } from "@/types/diary";
import { getMoodDef } from "@/types/diary";
import { formatKoreanDate } from "@/utils/date";
import { ImageIcon, Mic } from "lucide-react";

export default function DiaryCard({ entry, onClick }: { entry: DiaryEntry; onClick: () => void }) {
  const mood = getMoodDef(entry.mood);
  const hasPhoto = entry.attachments.some((a) => a.type === "photo");
  const hasAudio = entry.attachments.some((a) => a.type === "audio");
  const preview = entry.content.trim().slice(0, 96);

  return (
    <Card
      className={cn(
        "cursor-pointer p-4 transition hover:bg-white hover:shadow-md",
        "focus-within:ring-2 focus-within:ring-zinc-900/10",
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
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
          <div className="mt-2 text-sm font-semibold">{entry.title?.trim() ? entry.title : formatKoreanDate(entry.entryDate)}</div>
          <div className="mt-1 overflow-hidden text-sm text-zinc-600 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
            {preview || "(내용 없음)"}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-zinc-400">
          {hasPhoto && <ImageIcon className="h-4 w-4" />}
          {hasAudio && <Mic className="h-4 w-4" />}
        </div>
      </div>
    </Card>
  );
}
