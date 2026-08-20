import { AppShell } from "@/components/layout/AppShell";
import { LexiconBuilder } from "@/components/builder/LexiconBuilder";
import { notFound } from "next/navigation";

export default function BuilderPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <AppShell activePath="/builder">
      <div className="route-page">
        <section className="route-heading">
          <h1>My word list</h1>
        </section>
        <LexiconBuilder />
      </div>
    </AppShell>
  );
}
