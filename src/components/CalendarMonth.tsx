import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { toISODate } from "@/utils/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

type Cell = { iso: string; day: number; inMonth: boolean };

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

export default function CalendarMonth({
  month,
  selected,
  onSelect,
  markedDates,
  onMonthChange,
}: {
  month: Date;
  selected: string | null;
  onSelect: (iso: string) => void;
  markedDates: Set<string>;
  onMonthChange: (next: Date) => void;
}) {
  const first = startOfMonth(month);
  const firstWeekday = first.getDay();

  const cells = useMemo(() => {
    const list: Cell[] = [];
    const start = new Date(first);
    start.setDate(start.getDate() - firstWeekday);
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      list.push({
        iso: toISODate(d),
        day: d.getDate(),
        inMonth: d.getMonth() === month.getMonth(),
      });
    }
    return list;
  }, [first, firstWeekday, month]);

  const header = useMemo(() => {
    return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long" }).format(month);
  }, [month]);

  const todayIso = toISODate(new Date());

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{header}</div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onMonthChange(addMonths(month, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onMonthChange(addMonths(month, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
        {[
          "일",
          "월",
          "화",
          "수",
          "목",
          "금",
          "토",
        ].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((c) => {
          const isSelected = selected === c.iso;
          const isToday = c.iso === todayIso;
          const hasEntry = markedDates.has(c.iso);
          return (
            <button
              key={c.iso}
              type="button"
              onClick={() => onSelect(c.iso)}
              className={cn(
                "relative h-10 rounded-xl text-sm transition",
                c.inMonth ? "text-zinc-900 hover:bg-white" : "text-zinc-400 hover:bg-white/60",
                isSelected ? "bg-zinc-900 text-white hover:bg-zinc-900" : "bg-white/60",
                isToday && !isSelected ? "ring-1 ring-zinc-900/20" : "ring-1 ring-zinc-200",
              )}
            >
              {c.day}
              {hasEntry && (
                <span
                  className={cn(
                    "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                    isSelected ? "bg-white" : "bg-zinc-900/60",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-zinc-500">표시된 점은 해당 날짜에 기록이 있다는 뜻이에요</div>
      <div className="mt-2 text-xs text-zinc-500">이 달의 기록: {Array.from(markedDates).filter((d) => d.slice(0, 7) === toISODate(first).slice(0, 7)).length}일</div>
    </div>
  );
}
