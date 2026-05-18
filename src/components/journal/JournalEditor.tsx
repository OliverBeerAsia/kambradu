"use client";

import { useState, type FormEvent } from "react";
import { BookOpen, FileText } from "lucide-react";
import { LedgerStrip, RecordRow, WorkbenchHeader, cycleLedgerItems } from "@/components/ui/Workbench";
import { kristangCommunity } from "@/data/kristang";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import type { JournalEntry } from "@/types/kambradu";

const starterJournalEntries: JournalEntry[] = [
  {
    id: "users/demo/journalEntries/shop-visit-starter",
    userId: "demo",
    communityId: kristangCommunity.id,
    title: "Words from the shop",
    body: "Practise loja, balcao, and papia. Ask family for pronunciation before submitting public notes.",
    tags: ["shop", "practice"],
    linkedEntryIds: ["loja"],
    isPrivate: true,
    createdAt: "2026-05-17T00:00:00.000Z"
  }
];

export function JournalEditor() {
  const { activeCycle, attachJournalEntry } = useLearningCycles();
  const [entries, setEntries] = useLocalStorageState<JournalEntry[]>("kambradu-journal-entries-v1", starterJournalEntries);
  const [title, setTitle] = useState(`${activeCycle.title} note`);
  const [body, setBody] = useState(
    `I am working through ${activeCycle.title}. Keep the note private until source and consent are clear.`
  );
  const [message, setMessage] = useState("");
  const activeEntries = entries.filter((entry) => activeCycle.journalEntryIds.includes(entry.id));

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      setMessage("Title and journal entry are required.");
      return;
    }

    const entry: JournalEntry = {
      id: `users/demo/journalEntries/${slugify(title)}-${Date.now()}`,
      userId: "demo",
      communityId: kristangCommunity.id,
      title: title.trim(),
      body: body.trim(),
      tags: activeCycle.focus,
      linkedEntryIds: activeCycle.practicePromptIds,
      isPrivate: true,
      createdAt: new Date().toISOString()
    };

    setEntries((current) => [entry, ...current]);
    attachJournalEntry(entry.id);
    setMessage("Private note attached to the active cycle.");
  }

  return (
    <section className="learner-grid">
      <form className="journal-editor" onSubmit={saveEntry}>
        <WorkbenchHeader
          title={`${activeCycle.title}: private note`}
          description="Journal entries stay on this device and only contribute metadata to the local cycle packet."
          cycle={activeCycle}
        />
        <LedgerStrip items={cycleLedgerItems(activeCycle)} />

        <label>
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          Journal entry
          <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={8} />
        </label>
        <button className="primary-action" type="submit">
          <FileText size={18} aria-hidden="true" />
          Save private note
        </button>
        {message ? <p className="form-message">{message}</p> : null}
      </form>

      <aside className="rail-panel">
        <div className="rail-title compact-title">
          <h2>Active cycle notes</h2>
          <BookOpen size={17} aria-hidden="true" />
        </div>
        <div className="cycle-record-list">
          {activeEntries.map((entry) => (
            <RecordRow key={entry.id} title={entry.title} detail={entry.body} meta="Private journal" status="Local" />
          ))}
          {activeEntries.length === 0 ? (
            <RecordRow title="No attached notes yet" detail="Save one note here to move the active cycle forward." status="Private" />
          ) : null}
        </div>
        <div className="mini-review-list">
          {activeCycle.focus.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </div>
      </aside>
    </section>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
