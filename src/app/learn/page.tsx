import { AppShell } from "@/components/layout/AppShell";
import { LearnHome } from "@/components/learn/LearnHome";

export default function LearnPage() {
  return (
    <AppShell activePath="/learn">
      <LearnHome />
    </AppShell>
  );
}
