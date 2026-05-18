"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Upload } from "lucide-react";
import { AccessState, LedgerStrip, RecordRow, WorkbenchHeader, cycleLedgerItems } from "@/components/ui/Workbench";
import { submitCycle } from "@/lib/learning-cycles";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import type { AccessLevel, ContentType, ContributionDraft } from "@/types/kambradu";

const initialDraft: ContributionDraft = {
  communityId: "kristang-melaka",
  contentType: "word",
  title: "",
  body: "",
  englishGloss: "",
  provenance: "",
  consent: "",
  access: "community",
  attributionName: "",
  reviewStatus: "draft"
};

export function ContributionForm() {
  const { activeCycle, activeContributionDraft, updateCycle } = useLearningCycles();
  const [draft, setDraft] = useLocalStorageState<ContributionDraft>("kambradu-contribution-draft-v1", initialDraft);
  const [hydratedCycleId, setHydratedCycleId] = useState("");
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "ready">("idle");
  const [message, setMessage] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (hydratedCycleId !== activeCycle.id) {
      setDraft(activeContributionDraft);
      setHydratedCycleId(activeCycle.id);
    }
  }, [activeContributionDraft, activeCycle.id, hydratedCycleId, setDraft]);

  function update<K extends keyof ContributionDraft>(key: K, value: ContributionDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function toggleRecording() {
    if (recordingState === "recording") {
      mediaRecorderRef.current?.stop();
      setRecordingState("ready");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("This browser does not expose microphone recording in the current context.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingState("recording");
      setMessage("");
    } catch {
      setMessage("Microphone access was not granted.");
    }
  }

  function submitForReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.title.trim() || !draft.body.trim() || !draft.provenance.trim() || !draft.consent.trim()) {
      setMessage("Title, content, provenance, and consent are required before steward review.");
      return;
    }

    const submittedDraft: ContributionDraft = {
      ...draft,
      id: draft.id ?? `contributions/${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      reviewStatus: "submitted",
      submittedBy: "demo",
      updatedAt: new Date().toISOString()
    };

    setDraft(submittedDraft);
    updateCycle(activeCycle.id, (cycle) => submitCycle(cycle, submittedDraft));
    setMessage("Draft is queued locally as submitted and attached to the active learning cycle.");
  }

  return (
    <form className="contribution-form" onSubmit={submitForReview}>
      <WorkbenchHeader
        title={`${activeCycle.title}: submission packet`}
        description="The packet is built from the active cycle: lesson, practice, private notes, builder entries, speaker checks, and consent."
        cycle={activeCycle}
      />
      <LedgerStrip items={cycleLedgerItems(activeCycle)} />

      <div className="packet-summary">
        <AccessState
          state={activeCycle.reviewStatus === "approved" ? "approved" : activeCycle.contributionId ? "review" : "local"}
          label={activeCycle.contributionId ? "Review packet created" : "Local draft packet"}
          detail={activeCycle.contributionId ?? "No Firestore write until Firebase is configured."}
        />
        <RecordRow
          title="Cycle data included"
          detail={`${activeCycle.practiceReviewIds.length} practice reviews, ${activeCycle.journalEntryIds.length} notes, ${activeCycle.personalLexiconEntryIds.length} builder entries, ${activeCycle.speakerCheckIds.length} speaker checks.`}
          status={activeCycle.reviewStatus}
        />
      </div>

      <div className="form-grid">
        <label>
          Content type
          <select value={draft.contentType} onChange={(event) => update("contentType", event.target.value as ContentType)}>
            <option value="word">Word</option>
            <option value="phrase">Phrase</option>
            <option value="story">Story</option>
            <option value="note">Note</option>
          </select>
        </label>

        <label>
          Access level
          <select value={draft.access} onChange={(event) => update("access", event.target.value as AccessLevel)}>
            <option value="open">Open</option>
            <option value="community">Community</option>
            <option value="restricted">Restricted</option>
          </select>
        </label>
      </div>

      <label>
        Title or headword
        <input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="loja" />
      </label>

      <label>
        English gloss
        <input
          value={draft.englishGloss ?? ""}
          onChange={(event) => update("englishGloss", event.target.value)}
          placeholder="shop, store"
        />
      </label>

      <label>
        Content
        <textarea
          rows={6}
          value={draft.body}
          onChange={(event) => update("body", event.target.value)}
          placeholder="Word notes, phrase, story text, translation, or transcription."
        />
      </label>

      <label>
        Provenance
        <textarea
          rows={3}
          value={draft.provenance}
          onChange={(event) => update("provenance", event.target.value)}
          placeholder="Where did this come from, and who should stewards contact if they need context?"
        />
      </label>

      <label>
        Consent and attribution
        <textarea
          rows={3}
          value={draft.consent}
          onChange={(event) => update("consent", event.target.value)}
          placeholder="Confirm permission to store, review, and publish at the chosen access level."
        />
      </label>

      <label>
        Attribution name
        <input
          value={draft.attributionName}
          onChange={(event) => update("attributionName", event.target.value)}
          placeholder="Name, family, or anonymous"
        />
      </label>

      <div className="recorder-box">
        <button className={`record-button ${recordingState === "recording" ? "recording" : ""}`} onClick={toggleRecording} type="button">
          {recordingState === "recording" ? <Square size={24} aria-hidden="true" /> : <Mic size={26} aria-hidden="true" />}
        </button>
        <span>
          {recordingState === "idle"
            ? "Record audio"
            : recordingState === "recording"
              ? "Recording now"
              : "Audio ready for upload queue"}
        </span>
        <button type="button">
          <Upload size={17} aria-hidden="true" />
          Upload file
        </button>
      </div>

      <button className="primary-action" type="submit">
        Submit for steward review
      </button>

      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
