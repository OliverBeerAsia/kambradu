"use client";

import Link from "next/link";
import { BookHeart, Feather, HardDrive, Plus, StickyNote } from "lucide-react";
import { useMemo } from "react";
import { useMemoriesData } from "@/lib/hooks/use-memories-data";
import { buildMemoryFeed } from "@/lib/memories";

const memoryIcons = {
  "saved-word": BookHeart,
  note: StickyNote,
  "personal-word": Feather
};

export function MemoriesHome() {
  const { isHydrated, journalEntries, personalLexiconEntries, savedWords } = useMemoriesData();
  const memories = useMemo(
    () => buildMemoryFeed({ journalEntries, personalLexiconEntries, savedWords }).slice(0, 8),
    [journalEntries, personalLexiconEntries, savedWords]
  );

  return (
    <section className="memories-home" aria-labelledby="memories-heading">
      <header className="memories-intro">
        <div>
          <h1 id="memories-heading">My memories</h1>
          <p>Words, voices and stories you want to keep.</p>
        </div>
        <Link className="memory-add-button" href="/saved/new" prefetch={false}>
          <Plus size={21} aria-hidden="true" />
          Add a memory
        </Link>
      </header>

      <div className="memories-section-heading">
        <h2>Recently kept</h2>
        <span>
          <HardDrive size={15} aria-hidden="true" />
          On this device
        </span>
      </div>

      {!isHydrated ? (
        <p className="memories-loading" role="status">Loading your memories...</p>
      ) : memories.length ? (
        <ul className="memory-list">
          {memories.map((memory) => {
            const Icon = memoryIcons[memory.kind];

            return (
              <li className={`memory-row memory-${memory.kind}`} key={`${memory.kind}-${memory.id}`}>
                <span className="memory-row-icon" aria-hidden="true"><Icon size={21} /></span>
                <span className="memory-row-copy">
                  <small>{memory.label}</small>
                  <strong>{memory.title}</strong>
                  <span>{memory.detail}</span>
                </span>
                <span className="memory-private-label">On this device</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="memories-empty">
          <BookHeart size={34} aria-hidden="true" />
          <h2>Nothing here yet.</h2>
          <p>Keep a word, voice or story when it matters.</p>
          <Link className="primary-action" href="/saved/new" prefetch={false}>Add a memory</Link>
        </div>
      )}
    </section>
  );
}
