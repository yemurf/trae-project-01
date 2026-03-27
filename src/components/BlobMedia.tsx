import { useEffect, useMemo, useState } from "react";
import { getBlob } from "@/utils/diaryDb";

export default function BlobMedia({
  blobId,
  kind,
  className,
}: {
  blobId: string;
  kind: "image" | "audio";
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    void (async () => {
      const record = await getBlob(blobId);
      if (!active || !record) return;
      objectUrl = URL.createObjectURL(record.blob);
      setUrl(objectUrl);
    })();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [blobId]);

  const content = useMemo(() => {
    if (!url) return null;
    if (kind === "audio") {
      return <audio className={className} controls src={url} />;
    }
    return <img className={className} src={url} alt="첨부 이미지" />;
  }, [className, kind, url]);

  return content;
}

