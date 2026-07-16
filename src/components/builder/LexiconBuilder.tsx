"use client";

import type { FormEvent } from "react";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { starterBuilderEntries } from "@/data/kristang";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import { MEMORY_STORAGE_KEYS } from "@/lib/hooks/use-memories-data";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import type { PersonalLexiconEntry } from "@/types/kambradu";

type BuilderDraft = Pick<
  PersonalLexiconEntry,
  "headword" | "englishGloss" | "alternateSpellings" | "example" | "sourceNote"
>;

const initialDraft: BuilderDraft = {
  headword: "",
  englishGloss: "",
  alternateSpellings: "",
  example: "",
  sourceNote: ""
};

function createEntryId(headword: string) {
  const slug = headword
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `users/demo/personalLexicon/personal-${slug || "entry"}-${Date.now()}`;
}

export function LexiconBuilder() {
  const { attachPersonalLexiconEntry, isHydrated: cyclesReady } = useLearningCycles();
  const [entries, setEntries, entriesReady] = useLocalStorageState<PersonalLexiconEntry[]>(
    MEMORY_STORAGE_KEYS.personalLexicon,
    starterBuilderEntries
  );
  const [draft, setDraft] = useState<BuilderDraft>(initialDraft);
  const [message, setMessage] = useState("");

  function update<K extends keyof BuilderDraft>(key: K, value: BuilderDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function addEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.headword.trim() || !draft.englishGloss.trim() || !draft.sourceNote.trim()) {
      setMessage("Add the word, its meaning and where it came from.");
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
      access: "restricted",
      status: "private",
      createdAt: new Date().toISOString()
    };

    setEntries((current) => [nextEntry, ...current]);
    attachPersonalLexiconEntry(nextEntry.id);
    setDraft(initialDraft);
    setMessage("Saved on this device. Other people using this browser profile may be able to see it.");
  }

  if (!cyclesReady || !entriesReady) {
    return <section className="builder-workbench" aria-label="My word list"><p role="status">Preparing your words...</p></section>;
  }

  return (
    <section className="builder-workbench simple-builder" aria-label="My word list">
      <form className="builder-form" onSubmit={addEntry}>
        <div className="rail-title compact-title">
          <h2>Add a word to your list</h2>
          <Plus size={18} aria-hidden="true" />
        </div>

        <label>
          Kristang word or phrase
          <input required value={draft.headword} onChange={(event) => update("headword", event.target.value)} />
        </label>

        <label>
          Meaning in English
          <input required value={draft.englishGloss} onChange={(event) => update("englishGloss", event.target.value)} />
        </label>

        <label>
          Other spellings, if relevant
          <input value={draft.alternateSpellings} onChange={(event) => update("alternateSpellings", event.target.value)} />
        </label>

        <label>
          Your example or context
          <textarea rows={3} value={draft.example} onChange={(event) => update("example", event.target.value)} />
        </label>

        <label>
          Where this came from
          <textarea required rows={3} value={draft.sourceNote} onChange={(event) => update("sourceNote", event.target.value)} />
        </label>

        <button className="primary-action" type="submit">
          <FileText size={18} aria-hidden="true" />
          Save on this device
        </button>

        {message ? <p className="form-message" role="status" aria-live="polite">{message}</p> : null}
      </form>

      <aside className="builder-list" aria-labelledby="my-words-heading">
        <h2 id="my-words-heading">My words</h2>
        <div className="personal-entry-list">
          {entries.map((entry) => (
            <article className="personal-entry-card" key={entry.id}>
              <div>
                <h3>{entry.headword}</h3>
                <p>{entry.englishGloss}</p>
              </div>
              {entry.example ? <blockquote>{entry.example}</blockquote> : null}
              <small>{entry.sourceNote}</small>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}
