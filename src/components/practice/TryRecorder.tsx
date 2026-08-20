"use client";

import { Mic, Square, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteRecording, getRecording, recordingsSupported, saveRecording } from "@/lib/recordings";
import { LANGUAGE_TAG } from "@/lib/language";

type Status = "idle" | "recording" | "saved" | "unsupported" | "denied" | "failed";

/**
 * A private attempt at saying the word. Nothing here is scored or compared with
 * anyone. The recording stays in this browser.
 */
export function TryRecorder({ entryId, headword }: { entryId: string; headword: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startedAtRef = useRef(0);

  /** Releasing the microphone matters: without this the tab keeps showing as recording. */
  const releaseMicrophone = useCallback(() => {
    for (const track of streamRef.current?.getTracks() ?? []) track.stop();
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  const showBlob = useCallback((blob: Blob) => {
    setPlaybackUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(blob);
    });
  }, []);

  useEffect(() => {
    if (!recordingsSupported()) {
      setStatus("unsupported");
      return;
    }
    let active = true;
    getRecording(entryId)
      .then((existing) => {
        if (!active || !existing) return;
        showBlob(existing.blob);
        setStatus("saved");
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [entryId, showBlob]);

  // Stop the microphone and release the object URL when leaving the step.
  useEffect(
    () => () => {
      releaseMicrophone();
      setPlaybackUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
    },
    [releaseMicrophone]
  );

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        releaseMicrophone();
        if (blob.size === 0) {
          setStatus("idle");
          return;
        }
        showBlob(blob);
        try {
          await saveRecording({
            entryId,
            blob,
            mimeType: blob.type,
            durationMs: Date.now() - startedAtRef.current,
            createdAt: new Date().toISOString()
          });
          setStatus("saved");
        } catch {
          setStatus("failed");
        }
      };

      recorder.start();
      setStatus("recording");
    } catch (error) {
      releaseMicrophone();
      setStatus((error as DOMException)?.name === "NotAllowedError" ? "denied" : "failed");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  async function discard() {
    releaseMicrophone();
    setPlaybackUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setStatus("idle");
    await deleteRecording(entryId).catch(() => undefined);
  }

  if (status === "unsupported") {
    return <p className="try-note">This browser cannot record audio. You can say the word aloud instead.</p>;
  }

  return (
    <div className="try-recorder">
      {status === "recording" ? (
        <button className="secondary-action" type="button" onClick={stopRecording}>
          <Square size={18} aria-hidden="true" />Stop
        </button>
      ) : (
        <button className="secondary-action" type="button" onClick={startRecording}>
          <Mic size={18} aria-hidden="true" />
          {status === "saved" ? "Record again" : "Record"}
        </button>
      )}

      {status === "recording" ? <p className="try-note" role="status">Recording. Say <span lang={LANGUAGE_TAG}>{headword}</span>.</p> : null}
      {status === "denied" ? <p className="try-note" role="status">The microphone is not available. You can say the word aloud instead.</p> : null}
      {status === "failed" ? <p className="try-note" role="status">That recording could not be saved. You can try again.</p> : null}

      {playbackUrl ? (
        <div className="try-playback">
          {/* The learner's own attempt, not reviewed community audio. */}
          <audio className="own-recording" controls preload="metadata" src={playbackUrl} aria-label={`Your recording of ${headword}`} />
          <button className="quiet-action" type="button" onClick={discard}>
            <Trash2 size={17} aria-hidden="true" />Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
