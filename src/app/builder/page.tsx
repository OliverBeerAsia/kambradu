import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { LexiconBuilder } from "@/components/builder/LexiconBuilder";

export default function BuilderPage() {
  return (
    <AppShell activePath="/builder" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Lexicon builder</h1>
          <p>
            Build a private mini-dictionary from family phrases, lessons, recipes, songs, and field notes before anything
            moves into steward review.
          </p>
        </section>
        <LexiconBuilder />
      </div>
    </AppShell>
  );
}
