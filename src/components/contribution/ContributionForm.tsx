"use client";

import { useEffect, useState } from "react";
import { AccessState, LedgerStrip, RecordRow, WorkbenchHeader, cycleLedgerItems } from "@/components/ui/Workbench";
import { submitCycle } from "@/lib/learning-cycles";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import type { ContentType, ContributionDraft } from "@/types/kambradu";

const initialDraft: ContributionDraft = {
  communityId: "kristang-melaka",
  contentType: "word",
  title: "",
  body: "",
  englishGloss: "",
  provenance: "",
  consent: "",
  access: "restricted",
  attributionName: "",
  reviewStatus: "draft"
};

export function ContributionForm() {
  const { activeCycle, activeContributionDraft, updateCycle, isHydrated: cyclesReady } = useLearningCycles();
  const [draft, setDraft, draftReady] = useLocalStorageState<ContributionDraft>("kambradu-contribution-draft-v1", initialDraft);
  const [hydratedCycleId, setHydratedCycleId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (cyclesReady && draftReady && hydratedCycleId !== activeCycle.id) {
      setDraft(activeContributionDraft);
      setHydratedCycleId(activeCycle.id);
    }
  }, [activeContributionDraft, activeCycle.id, cyclesReady, draftReady, hydratedCycleId, setDraft]);

  function update<K extends keyof ContributionDraft>(key: K, value: ContributionDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
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
    setMessage("Draft saved on this device for future review. It has not been published.");
  }

  if (!cyclesReady || !draftReady || hydratedCycleId !== activeCycle.id) {
    return <form className="contribution-form"><p role="status">Preparing your private draft...</p></form>;
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
          label={activeCycle.contributionId ? "Draft prepared" : "Draft on this device"}
          detail="This prototype does not send or publish contributions."
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

        <p>This draft stays on this device.</p>
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
        Permission notes
        <textarea
          rows={3}
          value={draft.consent}
          onChange={(event) => update("consent", event.target.value)}
          placeholder="Note what permission would still be needed before any review or sharing."
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

      <button className="primary-action" type="submit">
        Keep draft for future review
      </button>

      {message ? <p className="form-message" role="status" aria-live="polite">{message}</p> : null}
    </form>
  );
}
