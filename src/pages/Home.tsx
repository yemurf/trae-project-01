import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DiaryCard from "@/components/DiaryCard";
import Card from "@/components/ui/Card";
import { useDiaryStore } from "@/stores/useDiaryStore";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const status = useDiaryStore((s) => s.status);
  const entries = useDiaryStore((s) => s.entries);

  const content = useMemo(() => {
    if (status === "loading" || status === "idle") {
      return (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-24 animate-pulse rounded-2xl bg-white/60 ring-1 ring-zinc-200" />
          ))}
        </div>
      );
    }

    if (entries.length === 0) {
      return (
        <Card className="p-10 text-center">
          <div className="text-lg font-semibold">첫 기록을 시작해볼까요?</div>
          <div className="mt-2 text-sm text-zinc-600">오늘의 기분을 선택하고 몇 줄만 적어도 충분해요.</div>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate("/entries/new")}>새 일기 작성</Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="grid gap-3">
        {entries.map((e) => (
          <DiaryCard key={e.id} entry={e} onClick={() => navigate(`/entries/${e.id}`)} />
        ))}
      </div>
    );
  }, [entries, navigate, status]);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Card>
          <div className="text-sm font-semibold">빠른 추가</div>
          <div className="mt-2 text-sm text-zinc-600">홈에서 바로 새 일기를 시작할 수 있어요.</div>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate("/entries/new")}> 
              <Plus className="h-4 w-4" />
              새 일기 작성
            </Button>
          </div>
          <div className="mt-3 text-xs text-zinc-500">첨부는 사진/음성 모두 지원해요.</div>
        </Card>

        <Card className="mt-4">
          <div className="text-sm font-semibold">요약</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <SummaryItem label="총 기록" value={`${entries.length}개`} />
            <SummaryItem
              label="최근 기록"
              value={entries[0]?.entryDate ? `${entries[0].entryDate}` : "-"}
            />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">최근 일기</div>
            <div className="text-sm text-zinc-600">스크롤하며 지난 기록을 빠르게 확인해요</div>
          </div>
          <Button variant="secondary" onClick={() => navigate("/history")}>히스토리 보기</Button>
        </div>
        {content}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-zinc-200">
      <div className="text-xs font-medium text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}
