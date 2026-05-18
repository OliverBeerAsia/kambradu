import { AppShell } from "@/components/layout/AppShell";
import { LocalLexiconBrowser } from "@/components/lexicon/LocalLexiconBrowser";
import { publicLexiconEntries } from "@/data/kristang";

export default function LexiconPage() {
  return (
    <AppShell activePath="/lexicon">
      <div className="route-page">
        <section className="route-heading">
          <h1>Kristang lexicon</h1>
        </section>
        <LocalLexiconBrowser entries={publicLexiconEntries} />
      </div>
    </AppShell>
  );
}
