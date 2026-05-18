import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { dictionaryAttribution, kristangCommunity } from "@/data/kristang";

export default function AboutPage() {
  return (
    <AppShell activePath="/about">
      <div className="route-page narrow-page">
        <section className="route-heading">
          <h1>About Kambradu</h1>
          <p>{kristangCommunity.publicDescription}</p>
        </section>

        <section className="policy-panel">
          <h2>Kristang-first public MVP</h2>
          <p>
            Kambradu starts with approved Kristang material that anyone can browse. Signed-in learners can keep private
            journals, save review words, record audio, and submit material. Nothing user-submitted becomes public until a
            steward approves it.
          </p>
        </section>

        <section className="policy-panel">
          <h2>Dictionary attribution</h2>
          <p>
            Dictionary-derived entries are attributed to {dictionaryAttribution.authors}, <em>{dictionaryAttribution.label}</em>,
            {` ${dictionaryAttribution.publisher}, ${dictionaryAttribution.year}.`}
          </p>
          <p>
            DOI/source note:{" "}
            <a href={dictionaryAttribution.url} rel="noreferrer" target="_blank">
              {dictionaryAttribution.doi}
            </a>
            . Online edition license: {dictionaryAttribution.license}.
          </p>
        </section>

        <section className="policy-panel">
          <h2>Content boundaries</h2>
          <p>
            Raw source PDFs and bulk extracted dictionary text are not part of the public code repo. Curated seed data
            should be imported privately into Firestore with source, license, access, and review status fields.
          </p>
          <Link className="primary-link" href="/lexicon">
            Browse approved entries
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
