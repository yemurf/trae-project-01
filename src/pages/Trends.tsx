import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { useDiaryStore } from "@/stores/useDiaryStore";
import { MOODS, getMoodDef, type MoodCode } from "@/types/diary";
import { extractTopKeywords } from "@/utils/text";
import { addDays, toISODate } from "@/utils/date";
import { cn } from "@/lib/utils";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

type RangeKey = "7" | "30" | "90";

type SeriesPoint = {
  date: string;
  intensity: number;
  moodLabel: string;
  moodEmoji: string;
  moodCode: MoodCode;
};

type PieDatum = { code: MoodCode; name: string; value: number };

function startIsoForRange(range: RangeKey): string {
  const days = Number(range);
  const today = toISODate(new Date());
  return addDays(today, -(days - 1));
}

function fmtAxis(iso: string): string {
  const [y, m, d] = iso.split("-").map((v) => Number(v));
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric" }).format(dt);
}

function moodHex(code: MoodCode): string {
  switch (code) {
    case "happy":
      return "#f59e0b";
    case "sad":
      return "#38bdf8";
    case "uncomfortable":
      return "#fb7185";
    case "calm":
      return "#34d399";
    case "angry":
      return "#f87171";
    case "anxious":
      return "#a78bfa";
  }
}

export default function Trends() {
  const entries = useDiaryStore((s) => s.entries);
  const [range, setRange] = useState<RangeKey>("30");
  const startIso = useMemo(() => startIsoForRange(range), [range]);

  const inRange = useMemo(() => {
    return entries
      .filter((e) => e.entryDate >= startIso)
      .slice()
      .sort((a, b) => (a.entryDate !== b.entryDate ? (a.entryDate > b.entryDate ? 1 : -1) : a.updatedAt - b.updatedAt));
  }, [entries, startIso]);

  const series = useMemo(() => {
    const byDate = new Map<
      string,
      {
        date: string;
        sum: number;
        count: number;
        lastMood: MoodCode;
      }
    >();
    for (const e of inRange) {
      const cur = byDate.get(e.entryDate);
      if (!cur) {
        byDate.set(e.entryDate, { date: e.entryDate, sum: e.intensity, count: 1, lastMood: e.mood });
        continue;
      }
      cur.sum += e.intensity;
      cur.count += 1;
      cur.lastMood = e.mood;
    }

    return [...byDate.values()]
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map((d) => {
        const mood = getMoodDef(d.lastMood);
        return {
          date: d.date,
          intensity: Number((d.sum / d.count).toFixed(2)),
          moodLabel: mood.label,
          moodEmoji: mood.emoji,
          moodCode: mood.code,
        } satisfies SeriesPoint;
      });
  }, [inRange]);

  const pieData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of inRange) counts.set(e.mood, (counts.get(e.mood) ?? 0) + 1);
    return MOODS.map((m) => ({ code: m.code, name: `${m.emoji} ${m.label}`, value: counts.get(m.code) ?? 0 } satisfies PieDatum));
  }, [inRange]);

  const totalPie = useMemo(() => pieData.reduce((acc, p) => acc + p.value, 0), [pieData]);

  const keywords = useMemo(() => {
    return extractTopKeywords(inRange.map((e) => e.content), 12);
  }, [inRange]);

  return (
    <div className="grid gap-6">
      <div>
        <div className="text-lg font-semibold">트렌드</div>
        <div className="mt-1 text-sm text-zinc-600">감정 변화와 자주 등장한 단어를 한눈에 확인해요</div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">기간</div>
            <div className="text-xs text-zinc-500">선택 기간의 기록만 집계돼요</div>
          </div>
          <div className="flex items-center rounded-2xl bg-white p-1 ring-1 ring-zinc-200">
            <RangeButton label="7일" active={range === "7"} onClick={() => setRange("7")} />
            <RangeButton label="30일" active={range === "30"} onClick={() => setRange("30")} />
            <RangeButton label="90일" active={range === "90"} onClick={() => setRange("90")} />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <div className="text-sm font-semibold">기분 변화</div>
          <div className="mt-1 text-xs text-zinc-500">하루에 여러 번 기록했다면 강도 평균으로 표시해요</div>

          {series.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 p-10 text-center text-sm text-zinc-500">
              선택 기간에 기록이 없어요
            </div>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="date" tickFormatter={fmtAxis} stroke="#71717a" fontSize={12} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#71717a" fontSize={12} />
                  <Tooltip
                    content={(props: TooltipProps<number, string>) => {
                      const { active, payload } = props;
                      const p = (payload?.[0]?.payload as SeriesPoint | undefined) ?? undefined;
                      if (!active || !p) return null;
                      return (
                        <div className="rounded-xl bg-white px-3 py-2 text-xs shadow-md ring-1 ring-zinc-200">
                          <div className="font-medium text-zinc-900">{p.date}</div>
                          <div className="mt-1 text-zinc-600">
                            {p.moodEmoji} {p.moodLabel} · 강도 {p.intensity}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="intensity"
                    stroke="#18181b"
                    strokeWidth={2}
                    dot={({ cx, cy, payload }) => {
                      if (cx == null || cy == null) return null;
                      const fill = moodHex((payload as SeriesPoint).moodCode);
                      return <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#18181b" strokeWidth={1} />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-5">
          <div className="text-sm font-semibold">감정 비율</div>
          <div className="mt-1 text-xs text-zinc-500">기간 내 기록 수 기준이에요</div>

          {totalPie === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 p-10 text-center text-sm text-zinc-500">
              표시할 데이터가 없어요
            </div>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={(props: TooltipProps<number, string>) => {
                      const { active, payload } = props;
                      const p = (payload?.[0]?.payload as PieDatum | undefined) ?? undefined;
                      if (!active || !p) return null;
                      const pct = totalPie ? Math.round((p.value / totalPie) * 100) : 0;
                      return (
                        <div className="rounded-xl bg-white px-3 py-2 text-xs shadow-md ring-1 ring-zinc-200">
                          <div className="font-medium text-zinc-900">{p.name}</div>
                          <div className="mt-1 text-zinc-600">
                            {p.value}개 · {pct}%
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Pie data={pieData.filter((p) => p.value > 0)} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                    {pieData
                      .filter((p) => p.value > 0)
                      .map((p) => {
                        return <Cell key={p.code} fill={moodHex(p.code)} stroke="#ffffff" strokeWidth={2} />;
                      })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-2 grid grid-cols-2 gap-2">
            {pieData
              .filter((p) => p.value > 0)
              .sort((a, b) => b.value - a.value)
              .slice(0, 6)
              .map((p) => (
                <div key={p.code} className="rounded-xl bg-white/70 px-3 py-2 ring-1 ring-zinc-200">
                  <div className="text-xs font-medium text-zinc-700">{p.name}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {p.value}개 · {totalPie ? Math.round((p.value / totalPie) * 100) : 0}%
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">자주 등장한 단어</div>
            <div className="mt-1 text-xs text-zinc-500">간단한 단어 분리 기반이라 완벽하진 않아요</div>
          </div>
          <div className="text-xs text-zinc-500">상위 {keywords.length}개</div>
        </div>

        {keywords.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 p-10 text-center text-sm text-zinc-500">
            표시할 단어가 없어요
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {keywords.map((k) => (
              <div key={k.term} className="rounded-2xl bg-white/70 p-4 ring-1 ring-zinc-200">
                <div className="text-sm font-semibold text-zinc-900">{k.term}</div>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                  <span>등장</span>
                  <span className="tabular-nums font-medium text-zinc-700">{k.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function RangeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl px-3 py-2 text-xs font-medium transition",
        active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100",
      )}
    >
      {label}
    </button>
  );
}
