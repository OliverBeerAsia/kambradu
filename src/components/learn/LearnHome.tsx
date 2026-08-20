"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dictionaryAttribution, publicLexiconEntries } from "@/data/kristang";
import type { LexicalEntry } from "@/types/kambradu";
import { LANGUAGE_TAG } from "@/lib/language";

const themes = [
  { tag: "greetings", label: "Greetings" },
  { tag: "family", label: "Family" },
  { tag: "home", label: "Home" },
  { tag: "food", label: "Food" },
  { tag: "daily life", label: "Daily life" },
  { tag: "body", label: "The body" },
  { tag: "weather", label: "Weather" },
  { tag: "animals", label: "Animals" },
  { tag: "people", label: "People" }
];

function grouped(): Array<{ label: string; entries: LexicalEntry[] }> {
  const seen = new Set<string>();
  const groups = themes.map(({ tag, label }) => {
    const entries = publicLexiconEntries.filter((entry) => entry.tags.includes(tag) && !seen.has(entry.id));
    for (const entry of entries) seen.add(entry.id);
    return { label, entries };
  });
  return groups.filter((group) => group.entries.length > 0);
}

export function LearnHome() {
  const groups = grouped();

  return (
    <div className="page learn-page">
      <header className="page-heading">
        <h1>Learn a word.</h1>
        <p>{publicLexiconEntries.length} words from the reference dictionary, grouped by where you might use them.</p>
      </header>

      {groups.map((group) => (
        <section className="theme-group" key={group.label}>
          <h2>{group.label}</h2>
          <ul className="word-list">
            {group.entries.map((entry) => (
              <li key={entry.id}>
                <Link href={`/practice?lesson=${entry.id}`}>
                  <span>
                    <strong lang={LANGUAGE_TAG}>{entry.headword}</strong>
                    <small>{entry.englishGlosses.join(", ")}</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <details className="dictionary-reference">
        <summary>Sources</summary>
        <div className="dictionary-inner">
          <p>
            {dictionaryAttribution.authors}, <cite>{dictionaryAttribution.label}</cite>. {dictionaryAttribution.license}.
          </p>
          <p>Checked against the dictionary. Not yet checked with a speaker or community partner.</p>
        </div>
      </details>
    </div>
  );
}
