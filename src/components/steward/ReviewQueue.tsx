"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Download, X } from "lucide-react";
import { AccessPill } from "@/components/ui/AccessPill";
import { LedgerStrip, WorkbenchHeader, cycleLedgerItems } from "@/components/ui/Workbench";
import { reviewQueueSeed } from "@/data/kristang";
import { approveCycle, requestCycleChanges } from "@/lib/learning-cycles";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import type { ContributionDraft, LearningCycle } from "@/types/kambradu";

type ReviewDisplayItem = ContributionDraft & {
  id: string;
  cycleId?: string;
  cycle?: LearningCycle;
};

export function ReviewQueue() {
  const { activeCycle, cycles, updateCycle } = useLearningCycles();
  const [items, setItems] = useState<ContributionDraft[]>(reviewQueueSeed);
  const cycleItems = useMemo<ReviewDisplayItem[]>(
    () =>
      cycles
        .filter((cycle) => cycle.contributionId)
        .map((cycle) => ({
          id: cycle.contributionId as string,
          cycleId: cycle.id,
          cycle,
          communityId: cycle.communityId,
          contentType: cycle.submission?.contentType ?? "note",
          title: cycle.submission?.title ?? cycle.title,
          body: cycle.submission?.body ?? `Local cycle submission for ${cycle.title}.`,
          englishGloss: cycle.submission?.englishGloss,
          provenance: cycle.submission?.provenance ?? `Learning cycle ${cycle.id}`,
          consent: cycle.submission?.consent ?? "Local prototype consent pending steward check.",
          access: cycle.submission?.access ?? "community",
          attributionName: cycle.submission?.attributionName ?? "Local learner",
          reviewStatus: cycle.reviewStatus === "changes-requested" ? "changes-requested" : cycle.reviewStatus === "approved" ? "approved" : "submitted",
          submittedBy: cycle.userId
        })),
    [cycles]
  );
  const reviewItems: ReviewDisplayItem[] = useMemo(
    () => [
      ...cycleItems,
      ...items.map((item) => ({
        ...item,
        id: item.id ?? item.title
      }))
    ],
    [cycleItems, items]
  );
  const [selectedId, setSelectedId] = useState(reviewItems[0]?.id ?? "");
  const [feedbackNote, setFeedbackNote] = useState("Add a clearer source, consent note, or speaker check before publication.");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reviewItems.some((item) => item.id === selectedId)) {
      setSelectedId(reviewItems[0]?.id ?? "");
    }
  }, [reviewItems, selectedId]);

  const selectedItem = reviewItems.find((item) => item.id === selectedId) ?? reviewItems[0];

  function updateStatus(id: string | undefined, status: "approved" | "rejected" | "changes-requested") {
    if (!id) {
      return;
    }

    const cycleItem = reviewItems.find((item) => item.id === id && item.cycleId);

    if (cycleItem?.cycleId) {
      updateCycle(cycleItem.cycleId, (cycle) =>
        status === "approved" ? approveCycle(cycle) : requestCycleChanges(cycle, feedbackNote)
      );
      setMessage(status === "approved" ? "Cycle approved locally and exposed to public browse." : "Feedback sent to the learner cycle.");
      return;
    }

    setItems((current) => current.map((item) => (item.id === id ? { ...item, reviewStatus: status } : item)));
    setMessage(status === "approved" ? "Seed review item approved locally." : "Seed review item marked for changes.");
  }

  return (
    <section className="review-workbench">
      <div className="review-column">
        <WorkbenchHeader
          title="Steward review bench"
          description="Local submissions can be approved, sent back for revision, and surfaced in public browse after approval."
          cycle={activeCycle}
        />
        <LedgerStrip items={cycleLedgerItems(activeCycle)} />

        <h2>Submitted material</h2>
        {reviewItems.map((item) => (
          <button
            className={`review-card ${selectedItem?.id === item.id ? "selected" : ""}`}
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            type="button"
          >
            <span>
              <strong>{item.title}</strong>
              <small>{item.contentType} · {item.attributionName}</small>
            </span>
            <AccessPill level={item.access} />
            <em>{item.reviewStatus}</em>
          </button>
        ))}
      </div>

      {selectedItem ? (
        <article className="review-detail">
          <div className="detail-heading">
            <div>
              <h2>{selectedItem.title}</h2>
              <p>{selectedItem.englishGloss || selectedItem.contentType}</p>
            </div>
            <AccessPill level={selectedItem.access} />
          </div>

          <dl className="review-facts">
            <div>
              <dt>Content</dt>
              <dd>{selectedItem.body}</dd>
            </div>
            <div>
              <dt>Provenance</dt>
              <dd>{selectedItem.provenance}</dd>
            </div>
            <div>
              <dt>Consent</dt>
              <dd>{selectedItem.consent}</dd>
            </div>
            <div>
              <dt>Attribution</dt>
              <dd>{selectedItem.attributionName}</dd>
            </div>
            {selectedItem.cycle ? (
              <div>
                <dt>Cycle packet</dt>
                <dd>
                  {selectedItem.cycle.practiceReviewIds.length} practice reviews, {selectedItem.cycle.journalEntryIds.length} notes,{" "}
                  {selectedItem.cycle.personalLexiconEntryIds.length} builder entries, {selectedItem.cycle.speakerCheckIds.length} speaker checks.
                </dd>
              </div>
            ) : null}
          </dl>

          <label>
            Steward notes
            <textarea
              rows={4}
              value={feedbackNote}
              onChange={(event) => setFeedbackNote(event.target.value)}
              placeholder="Checks completed, edit requests, publication notes."
            />
          </label>

          <div className="review-actions">
            <button onClick={() => updateStatus(selectedItem.id, "approved")} type="button">
              <Check size={18} aria-hidden="true" />
              Approve and publish
            </button>
            <button onClick={() => updateStatus(selectedItem.id, "changes-requested")} type="button">
              <X size={18} aria-hidden="true" />
              Request changes
            </button>
            <button type="button" onClick={() => setMessage(`${reviewItems.length} local review items ready for export.`)}>
              <Download size={18} aria-hidden="true" />
              Export reviewed set
            </button>
          </div>

          {message ? <p className="form-message">{message}</p> : null}
        </article>
      ) : null}
    </section>
  );
}
