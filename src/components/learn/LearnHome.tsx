"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { lessonUnits, publicLexiconEntries } from "@/data/kristang";

export function LearnHome() {
  return (
    <div className="page learn-page">
      <header className="page-heading">
        <h1>Learn a word.</h1>
        <p>Start with <span lang="mcm">sabang</span> or <span lang="mcm">janela</span>.</p>
      </header>

      <section className="lesson-list" aria-label="Learning moments">
        {lessonUnits.map((lesson) => {
          const entry = publicLexiconEntries.find((item) => lesson.focus.includes(item.id));
          return (
            <article className="lesson-card" key={lesson.id}>
              <div>
                <p className="evidence-label">Checked against the dictionary</p>
                <h2 lang="mcm">{entry?.headword}</h2>
                <p>{entry?.englishGlosses.join(", ")}</p>
              </div>
              <Link href={`/practice?lesson=${lesson.id}`}>
                Learn {entry?.headword}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </section>

      <details className="dictionary-reference">
        <summary>Sources</summary>
        <div className="dictionary-inner">
          <ul className="dictionary-results">
            {publicLexiconEntries.map((entry) => (
              <li key={entry.id}>
                <span><strong lang="mcm">{entry.headword}</strong> {entry.englishGlosses.join(", ")}</span>
              </li>
            ))}
          </ul>
          <p>{publicLexiconEntries[0].source.authors}, <cite>{publicLexiconEntries[0].source.label}</cite>. {publicLexiconEntries[0].source.license}.</p>
          <p>Checked against the dictionary. Not yet checked with a speaker or community partner.</p>
        </div>
      </details>
    </div>
  );
}
