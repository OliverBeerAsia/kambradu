import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { PracticeSession } from "@/components/practice/PracticeSession";

export default function PracticePage() {
  return (
    <AppShell activePath="/practice" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Practice session</h1>
          <p>
            A private audio-first loop for hearing, recalling, using, and checking Kristang before anything moves into
            public review.
          </p>
        </section>
        <PracticeSession />
      </div>
    </AppShell>
  );
}
