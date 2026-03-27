import EntryEditor from "@/components/EntryEditor";

export default function EntryNew() {
  return (
    <div>
      <div className="mb-4">
        <div className="text-lg font-semibold">새 일기</div>
        <div className="text-sm text-zinc-600">오늘의 감정을 짧게라도 기록해요</div>
      </div>
      <EntryEditor mode="create" />
    </div>
  );
}

