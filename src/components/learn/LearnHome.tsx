"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Language, LexicalEntry } from "@/types/kambradu";

const themes = [
  { tag: "greetings", label: "Greetings" },
  { tag: "numbers", label: "Numbers" },
  { tag: "family", label: "Family" },
  { tag: "home", label: "Home" },
  { tag: "food", label: "Food" },
  { tag: "daily life", label: "Daily life" },
  { tag: "body", label: "The body" },
  { tag: "weather", label: "Weather" },
  { tag: "animals", label: "Animals" },
  { tag: "people", label: "People" },
  { tag: "verbs", label: "Doing things" },
  { tag: "describing", label: "Describing things" }
];

function grouped(entries: LexicalEntry[]): Array<{ label: string; entries: LexicalEntry[] }> {
  const seen = new Set<string>();
  const groups = themes.map(({ tag, label }) => {
    const matching = entries.filter((entry) => entry.tags.includes(tag) && !seen.has(entry.id));
    for (const entry of matching) seen.add(entry.id);
    return { label, entries: matching };
  });
  return groups.filter((group) => group.entries.length > 0);
}

export function LearnHome({ language }: { language: Language }) {
  const groups = grouped(language.entries);

  return (
    <div className="page learn-page">
      <header className="page-heading">
        <h1>Learn a word.</h1>
        <p>
          {language.entries.length} {language.name} words, grouped by where you might use them.
        </p>
      </header>

      {groups.map((group) => (
        <section className="theme-group" key={group.label}>
          <h2>{group.label}</h2>
          <ul className="word-list">
            {group.entries.map((entry) => (
              <li key={entry.id}>
                <Link href={`/practice?lesson=${entry.id}`}>
                  <span>
                    <strong lang={language.tag}>{entry.headword}</strong>
                    <small>{entry.glosses.join(", ")}</small>
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
            {language.attribution.authors ? `${language.attribution.authors}, ` : null}
            <cite>{language.attribution.label}</cite>. {language.attribution.license}.
          </p>
          <p>{language.evidenceNote}</p>
        </div>
      </details>
    </div>
  );
}
