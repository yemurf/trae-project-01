import { cn } from "@/lib/utils";
import { MOODS, type MoodCode } from "@/types/diary";

export default function MoodPicker({ value, onChange }: { value: MoodCode; onChange: (v: MoodCode) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {MOODS.map((m) => {
        const selected = m.code === value;
        return (
          <button
            key={m.code}
            type="button"
            onClick={() => onChange(m.code)}
            className={cn(
              "flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm ring-1 transition",
              selected
                ? cn("bg-white ring-zinc-900/20", "shadow-sm")
                : "bg-white/60 ring-zinc-200 hover:bg-white",
            )}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg leading-none">{m.emoji}</span>
              <span className="font-medium text-zinc-900">{m.label}</span>
            </span>
            <span className={cn("h-2 w-2 rounded-full", m.color.bg)} />
          </button>
        );
      })}
    </div>
  );
}

