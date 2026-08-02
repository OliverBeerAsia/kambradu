import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { ContributionForm } from "@/components/contribution/ContributionForm";
import { notFound } from "next/navigation";

export default function ContributePage() {
  if (process.env.NODE_ENV !== "development") notFound();
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
