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
          <h2>Built around Kristang</h2>
          <p>
            Kambradu currently offers dictionary-listed Kristang words for learning and personal notes. It is independent
            and is not endorsed by a Kristang community body.
          </p>
          <p>Shared community material will require named partners, clear permissions and a review process they help define.</p>
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
          <h2>Respecting sources and permissions</h2>
          <p>
            Explore currently includes only a small set of traced dictionary-listed forms. No community story, recording
            or personal contribution should appear publicly without a named source, appropriate permission and a review
            process agreed with community partners.
          </p>
          <Link className="primary-link" href="/lexicon">
            Browse dictionary-listed entries
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
