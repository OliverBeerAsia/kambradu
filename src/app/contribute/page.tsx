import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { ContributionForm } from "@/components/contribution/ContributionForm";

export default function ContributePage() {
  return (
    <AppShell activePath="/contribute" authSlot={<UserMenu />}>
      <div className="route-page narrow-page">
        <section className="route-heading">
          <h1>Record and submit</h1>
          <p>
            Every word, phrase, story, and note needs provenance, consent, access level, and steward approval before it
            appears publicly.
          </p>
        </section>
        <ContributionForm />
      </div>
    </AppShell>
  );
}
