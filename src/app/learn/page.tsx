import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { LearningPlan } from "@/components/learn/LearningPlan";

export default function LearnPage() {
  return (
    <AppShell activePath="/learn" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Cycle</h1>
        </section>
        <LearningPlan />
      </div>
    </AppShell>
  );
}
