import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { ContributionForm } from "@/components/contribution/ContributionForm";

export default function ContributePage() {
  return (
    <AppShell activePath="/contribute" authSlot={<UserMenu />}>
      <div className="route-page narrow-page">
        <section className="route-heading">
          <h1>Submit</h1>
        </section>
        <ContributionForm />
      </div>
    </AppShell>
  );
}
