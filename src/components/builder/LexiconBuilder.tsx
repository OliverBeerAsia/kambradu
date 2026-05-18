"use client";

import type { FormEvent } from "react";
import { CheckCircle2, Download, FileText, Plus, Send } from "lucide-react";
import { useState } from "react";
import { AccessPill } from "@/components/ui/AccessPill";
import { starterBuilderEntries } from "@/data/kristang";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import type { AccessLevel, PersonalLexiconEntry } from "@/types/kambradu";

type BuilderDraft = Pick<
  PersonalLexiconEntry,
  "headword" | "englishGloss" | "alternateSpellings" | "example" | "sourceNote" | "access"
>;

const initialDraft: BuilderDraft = {
  headword: "",
  englishGloss: "",
  alternateSpellings: "",
  example: "",
  sourceNote: "",
  access: "community"
};

function createEntryId(headword: string) {
  const slug = headword
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `personal-${slug || "entry"}-${Date.now()}`;
}

export function LexiconBuilder() {
  const [entries, setEntries] = useLocalStorageState<PersonalLexiconEntry[]>(
    "kambradu-personal-lexicon-v1",
    starterBuilderEntries
  );
  const [draft, setDraft] = useState<BuilderDraft>(initialDraft);
  const [message, setMessage] = useState("");
  const [showExport, setShowExport] = useState(false);

  function update<K extends keyof BuilderDraft>(key: K, value: BuilderDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function addEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.headword.trim() || !draft.englishGloss.trim() || !draft.sourceNote.trim()) {
      setMessage("Headword, English gloss, and source note are required.");
      return;
    }

    const nextEntry: PersonalLexiconEntry = {
      id: createEntryId(draft.headword),
      userId: "demo",
      communityId: "kristang-melaka",
      headword: draft.headword.trim(),
      englishGloss: draft.englishGloss.trim(),
      alternateSpellings: draft.alternateSpellings.trim(),
      example: draft.example.trim(),
      sourceNote: draft.sourceNote.trim(),
      access: draft.access,
      status: "private",
      createdAt: new Date().toISOString()
    };

    setEntries((current) => [nextEntry, ...current]);
    setDraft(initialDraft);
    setMessage("Entry saved privately in this browser.");
  }

  function markReady(entryId: string) {
    setEntries((current) =>
      current.map((entry) => (entry.id === entryId ? { ...entry, status: entry.status === "ready" ? "private" : "ready" } : entry))
    );
  }

  const readyCount = entries.filter((entry) => entry.status === "ready").length;
  const exportPreview = JSON.stringify(
    entries.map((entry) => ({
      headword: entry.headword,
      englishGloss: entry.englishGloss,
      alternateSpellings: entry.alternateSpellings,
      example: entry.example,
      sourceNote: entry.sourceNote,
      access: entry.access,
      status: entry.status
    })),
    null,
    2
  );

  return (
    <section className="builder-workbench" aria-label="Personal lexicon builder">
      <form className="builder-form" onSubmit={addEntry}>
        <div className="rail-title compact-title">
          <h2>Build your own mini-dictionary</h2>
          <Plus size={18} aria-hidden="true" />
        </div>

        <div className="form-grid">
          <label>
            Headword
            <input value={draft.headword} onChange={(event) => update("headword", event.target.value)} placeholder="teng bong" />
          </label>

          <label>
            English gloss
            <input
              value={draft.englishGloss}
              onChange={(event) => update("englishGloss", event.target.value)}
              placeholder="good morning"
            />
          </label>
        </div>

        <label>
          Alternate spellings
          <input
            value={draft.alternateSpellings}
            onChange={(event) => update("alternateSpellings", event.target.value)}
            placeholder="Comma-separated variants or family spellings"
          />
        </label>

        <label>
          Example sentence or context
          <textarea
            rows={4}
            value={draft.example}
            onChange={(event) => update("example", event.target.value)}
            placeholder="Where did you hear this, and how would you use it?"
          />
        </label>

        <label>
          Source note
          <textarea
            rows={3}
            value={draft.sourceNote}
            onChange={(event) => update("sourceNote", event.target.value)}
            placeholder="Family speaker, lesson, dictionary, song, recipe, or observation."
          />
        </label>

        <label>
          Intended access if submitted
          <select value={draft.access} onChange={(event) => update("access", event.target.value as AccessLevel)}>
            <option value="open">Open</option>
            <option value="community">Community</option>
            <option value="restricted">Restricted</option>
          </select>
        </label>

        <button className="primary-action" type="submit">
          <FileText size={18} aria-hidden="true" />
          Add to my lexicon
        </button>

        {message ? <p className="form-message">{message}</p> : null}
      </form>

      <aside className="builder-list">
        <div className="builder-summary">
          <span>
            <strong>{entries.length}</strong>
            private entries
          </span>
          <span>
            <strong>{readyCount}</strong>
            ready for steward prep
          </span>
        </div>

        <div className="builder-actions">
          <button type="button" onClick={() => setShowExport((current) => !current)}>
            <Download size={17} aria-hidden="true" />
            {showExport ? "Hide export" : "Preview export"}
          </button>
          <a href="/contribute">
            <Send size={17} aria-hidden="true" />
            Submit ready entries
          </a>
        </div>

        {showExport ? (
          <label className="export-box">
            Review-ready JSON
            <textarea readOnly rows={8} value={exportPreview} />
          </label>
        ) : null}

        <div className="personal-entry-list">
          {entries.map((entry) => (
            <article className="personal-entry-card" key={entry.id}>
              <div>
                <h3>{entry.headword}</h3>
                <p>{entry.englishGloss}</p>
              </div>
              <div className="entry-status-row">
                <AccessPill level={entry.access} />
                <span>{entry.status === "ready" ? "Ready for review prep" : "Private draft"}</span>
              </div>
              {entry.example ? <blockquote>{entry.example}</blockquote> : null}
              <small>{entry.sourceNote}</small>
              <button type="button" onClick={() => markReady(entry.id)}>
                <CheckCircle2 size={17} aria-hidden="true" />
                {entry.status === "ready" ? "Move back to private" : "Mark ready for review"}
              </button>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}
