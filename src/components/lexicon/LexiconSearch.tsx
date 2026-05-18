"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, Search, Volume2 } from "lucide-react";
import { AccessPill } from "@/components/ui/AccessPill";
import { normalizeSearch } from "@/lib/access";
import type { LexicalEntry } from "@/types/kambradu";

export function LexiconSearch({ entries }: { entries: LexicalEntry[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(entries[0]?.id ?? "");
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];

  const results = useMemo(() => {
    const normalized = normalizeSearch(query);

    if (!normalized) {
      return entries;
    }

    return entries.filter((entry) => {
      const haystack = [
        entry.headword,
        entry.normalizedHeadword,
        ...entry.englishGlosses,
        ...entry.alternateSpellings,
        ...entry.tags
      ]
        .map(normalizeSearch)
        .join(" ");

      return haystack.includes(normalized);
    });
  }, [entries, query]);

  useEffect(() => {
    if (results.length && !results.some((entry) => entry.id === selectedId)) {
      setSelectedId(results[0].id);
    }
  }, [results, selectedId]);

  return (
    <section className="lexicon-browser" aria-label="Kristang lexicon browser">
      <div className="search-panel">
        <label className="search-box">
          <Search size={19} aria-hidden="true" />
          <input
            autoComplete="off"
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Kristang or English"
            type="search"
            value={query}
          />
        </label>

        <div className="entry-list" role="listbox" aria-label="Lexicon entries">
          {results.map((entry) => (
            <button
              aria-selected={selected?.id === entry.id}
              className={`entry-row ${selected?.id === entry.id ? "selected" : ""}`}
              key={entry.id}
              onClick={() => setSelectedId(entry.id)}
              role="option"
              type="button"
            >
              <span>
                <strong>{entry.headword}</strong>
                <small>{entry.englishGlosses.join(", ")}</small>
              </span>
              <AccessPill level={entry.access} />
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <article className="entry-detail">
          <div className="detail-heading">
            <div>
              <h2>{selected.headword}</h2>
              <p>{selected.englishGlosses.join(", ")}</p>
            </div>
            <button className="sound-button" type="button" aria-label={`Play ${selected.headword}`}>
              <Volume2 size={21} aria-hidden="true" />
            </button>
          </div>

          <div className="detail-meta">
            {selected.partOfSpeech ? <span>{selected.partOfSpeech}</span> : null}
            {selected.pronunciation ? <span>{selected.pronunciation}</span> : null}
            <AccessPill level={selected.access} />
          </div>

          {selected.alternateSpellings.length ? (
            <p className="detail-line">
              <strong>Alternate spellings</strong>
              {selected.alternateSpellings.join(", ")}
            </p>
          ) : null}

          {selected.example ? (
            <blockquote>
              <span>{selected.example}</span>
              {selected.exampleTranslation ? <small>{selected.exampleTranslation}</small> : null}
            </blockquote>
          ) : null}

          <div className="source-box">
            <strong>Source and license</strong>
            <span>
              {selected.source.label}. {selected.source.license}
            </span>
          </div>

          <div className="detail-actions">
            <button type="button">
              <Bookmark size={18} aria-hidden="true" />
              Save word
            </button>
            <a href="/contribute">Add pronunciation</a>
          </div>
        </article>
      ) : (
        <article className="entry-detail">
          <h2>No matching entries</h2>
          <p>Try a Kristang word, English gloss, or tag.</p>
        </article>
      )}
    </section>
  );
}
