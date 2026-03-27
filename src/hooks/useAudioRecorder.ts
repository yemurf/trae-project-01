import { useCallback, useMemo, useRef, useState } from "react";

type Status = "idle" | "recording" | "stopped" | "unsupported";

export function useAudioRecorder() {
  const supported = typeof window !== "undefined" && "MediaRecorder" in window && !!navigator.mediaDevices?.getUserMedia;
  const [status, setStatus] = useState<Status>(supported ? "idle" : "unsupported");
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [durationMs, setDurationMs] = useState<number | undefined>(undefined);
  const chunksRef = useRef<BlobPart[]>([]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const startAtRef = useRef<number>(0);

  const start = useCallback(async () => {
    if (!supported) {
      setStatus("unsupported");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      setLastBlob(blob);
      setDurationMs(Date.now() - startAtRef.current);
      for (const track of stream.getTracks()) track.stop();
      recorderRef.current = null;
      setStatus("stopped");
    };

    startAtRef.current = Date.now();
    recorder.start();
    setLastBlob(null);
    setDurationMs(undefined);
    setStatus("recording");
  }, [supported]);

  const stop = useCallback(() => {
    const r = recorderRef.current;
    if (!r) return;
    if (r.state === "recording") r.stop();
  }, []);

  const reset = useCallback(() => {
    setLastBlob(null);
    setDurationMs(undefined);
    setStatus(supported ? "idle" : "unsupported");
  }, [supported]);

  const isRecording = status === "recording";

  return useMemo(
    () => ({ status, supported, isRecording, lastBlob, durationMs, start, stop, reset }),
    [status, supported, isRecording, lastBlob, durationMs, start, stop, reset],
  );
}

