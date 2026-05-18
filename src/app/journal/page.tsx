import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { JournalEditor } from "@/components/journal/JournalEditor";

export default function JournalPage() {
  return (
    <AppShell activePath="/journal" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Private journal</h1>
        </section>

        <JournalEditor />
      </div>
    </AppShell>
  );
}
