import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import MoodPicker from "@/components/MoodPicker";
import { clampIntensity } from "@/utils/date";
import type { MoodCode } from "@/types/diary";

export default function EntryBasicInfoCard({
  entryDate,
  setEntryDate,
  mood,
  setMood,
  intensity,
  setIntensity,
}: {
  entryDate: string;
  setEntryDate: (v: string) => void;
  mood: MoodCode;
  setMood: (v: MoodCode) => void;
  intensity: 1 | 2 | 3 | 4 | 5;
  setIntensity: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <Card>
      <div className="text-sm font-semibold">기본 정보</div>
      <div className="mt-3 grid gap-3">
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600">날짜</div>
          <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600">기분</div>
          <MoodPicker value={mood} onChange={setMood} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-600">
            <span>강도</span>
            <span className="tabular-nums">{intensity}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={intensity}
            onChange={(e) => setIntensity(clampIntensity(Number(e.target.value)))}
            className="w-full accent-zinc-900"
          />
        </div>
      </div>
    </Card>
  );
}

