import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { LexiconBuilder } from "@/components/builder/LexiconBuilder";
import { notFound } from "next/navigation";

export default function BuilderPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <AppShell activePath="/builder" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>My word list</h1>
        </section>
        <LexiconBuilder />
      </div>
    </AppShell>
  );
}
