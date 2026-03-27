import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonth from "@/components/CalendarMonth";
import DiaryCard from "@/components/DiaryCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useDiaryStore } from "@/stores/useDiaryStore";
import { toISODate } from "@/utils/date";

export default function History() {
  const navigate = useNavigate();
  const entries = useDiaryStore((s) => s.entries);
  const [selected, setSelected] = useState<string | null>(toISODate(new Date()));
  const [month, setMonth] = useState<Date>(() => new Date());

  const markedDates = useMemo(() => new Set(entries.map((e) => e.entryDate)), [entries]);

  const filtered = useMemo(() => {
    if (!selected) return entries;
    return entries.filter((e) => e.entryDate === selected);
  }, [entries, selected]);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Card>
          <CalendarMonth
            month={month}
            selected={selected}
            onSelect={(iso) => setSelected((prev) => (prev === iso ? null : iso))}
            markedDates={markedDates}
            onMonthChange={setMonth}
          />
          <div className="mt-4 flex items-center justify-between gap-2">
            <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>
              전체 보기
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(toISODate(new Date()))}>
              오늘
            </Button>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">히스토리</div>
            <div className="text-sm text-zinc-600">스크롤하거나 달력에서 날짜를 눌러 확인해요</div>
          </div>
          <div className="text-xs text-zinc-500">{selected ? `${selected} 선택됨` : "전체"}</div>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="text-lg font-semibold">선택한 날짜에 기록이 없어요</div>
            <div className="mt-2 text-sm text-zinc-600">다른 날짜를 선택하거나 새 일기를 작성해보세요.</div>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => navigate("/entries/new")}>새 일기 작성</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((e) => (
              <DiaryCard key={e.id} entry={e} onClick={() => navigate(`/entries/${e.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

