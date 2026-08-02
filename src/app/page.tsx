import { AppShell } from "@/components/layout/AppShell";
import { TodayHome } from "@/components/today/TodayHome";

export default function Home() {
  return (
    <AppShell activePath="/">
      <TodayHome />
    </AppShell>
  );
}
