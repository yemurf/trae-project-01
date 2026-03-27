import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EntryEditor from "@/components/EntryEditor";
import { useDiaryStore } from "@/stores/useDiaryStore";

export default function EntryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getById = useDiaryStore((s) => s.getById);
  const entry = useDiaryStore((s) => s.entries.find((e) => e.id === id));
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    void (async () => {
      const found = await getById(id);
      setLoading(false);
      setNotFound(!found);
    })();
  }, [getById, id]);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/60 ring-1 ring-zinc-200" />;
  }

  if (notFound || !entry) {
    return (
      <Card className="p-10 text-center">
        <div className="text-lg font-semibold">수정할 일기를 찾지 못했어요</div>
        <div className="mt-2 text-sm text-zinc-600">홈으로 돌아가서 다시 선택해 주세요.</div>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate("/")}>홈으로</Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="text-lg font-semibold">일기 수정</div>
        <div className="text-sm text-zinc-600">감정과 내용을 바꿔도 좋아요</div>
      </div>
      <EntryEditor mode="edit" initial={entry} />
    </div>
  );
}

