import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { PracticeSession } from "@/components/practice/PracticeSession";

export default function PracticePage() {
  return (
    <AppShell activePath="/practice" authSlot={<UserMenu />} immersive>
      <div className="route-page gentle-practice-page">
        <PracticeSession />
      </div>
    </AppShell>
  );
}
