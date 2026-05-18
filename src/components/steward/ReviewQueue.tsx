"use client";

import { useState } from "react";
import { Check, Download, X } from "lucide-react";
import { AccessPill } from "@/components/ui/AccessPill";
import { reviewQueueSeed } from "@/data/kristang";
import type { ContributionDraft } from "@/types/kambradu";

export function ReviewQueue() {
  const [items, setItems] = useState<ContributionDraft[]>(reviewQueueSeed);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  function updateStatus(id: string | undefined, status: "approved" | "rejected") {
    if (!id) {
      return;
    }

    setItems((current) => current.map((item) => (item.id === id ? { ...item, reviewStatus: status } : item)));
  }

  return (
    <section className="review-workbench">
      <div className="review-column">
        <h2>Submitted material</h2>
        {items.map((item) => (
          <button
            className={`review-card ${selected?.id === item.id ? "selected" : ""}`}
            key={item.id}
            onClick={() => setSelectedId(item.id ?? "")}
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

      {selected ? (
        <article className="review-detail">
          <div className="detail-heading">
            <div>
              <h2>{selected.title}</h2>
              <p>{selected.englishGloss || selected.contentType}</p>
            </div>
            <AccessPill level={selected.access} />
          </div>

          <dl className="review-facts">
            <div>
              <dt>Content</dt>
              <dd>{selected.body}</dd>
            </div>
            <div>
              <dt>Provenance</dt>
              <dd>{selected.provenance}</dd>
            </div>
            <div>
              <dt>Consent</dt>
              <dd>{selected.consent}</dd>
            </div>
            <div>
              <dt>Attribution</dt>
              <dd>{selected.attributionName}</dd>
            </div>
          </dl>

          <label>
            Steward notes
            <textarea rows={4} placeholder="Checks completed, edit requests, publication notes." />
          </label>

          <div className="review-actions">
            <button onClick={() => updateStatus(selected.id, "approved")} type="button">
              <Check size={18} aria-hidden="true" />
              Approve and publish
            </button>
            <button onClick={() => updateStatus(selected.id, "rejected")} type="button">
              <X size={18} aria-hidden="true" />
              Request changes
            </button>
            <button type="button">
              <Download size={18} aria-hidden="true" />
              Export reviewed set
            </button>
          </div>
        </article>
      ) : null}
    </section>
  );
}
