import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { LearningPlan } from "@/components/learn/LearningPlan";

export default function LearnPage() {
  return (
    <AppShell activePath="/learn" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Learning plan</h1>
          <p>
            Turn the original multi-track language-learning idea into small daily loops: listen, review, journal, record,
            and connect words to culture.
          </p>
        </section>
        <LearningPlan />
      </div>
    </AppShell>
  );
}
