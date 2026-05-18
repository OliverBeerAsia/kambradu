import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { LexiconBuilder } from "@/components/builder/LexiconBuilder";

export default function BuilderPage() {
  return (
    <AppShell activePath="/builder" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Build</h1>
        </section>
        <LexiconBuilder />
      </div>
    </AppShell>
  );
}
