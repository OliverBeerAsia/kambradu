import { AppShell } from "@/components/layout/AppShell";
import { LexiconSearch } from "@/components/lexicon/LexiconSearch";
import { publicLexiconEntries } from "@/data/kristang";

export default function LexiconPage() {
  return (
    <AppShell activePath="/lexicon">
      <div className="route-page">
        <section className="route-heading">
          <h1>Kristang lexicon</h1>
          <p>
            Browse approved public entries first. Community and restricted material remains behind membership and steward
            rules.
          </p>
        </section>
        <LexiconSearch entries={publicLexiconEntries} />
      </div>
    </AppShell>
  );
}
