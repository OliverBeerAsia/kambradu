import { AppShell } from "@/components/layout/AppShell";
import { MemoriesHome } from "@/components/memories/MemoriesHome";
import { UserMenu } from "@/components/layout/UserMenu";

export default function SavedPage() {
  return (
    <AppShell activePath="/saved" authSlot={<UserMenu />}>
      <div className="route-page memories-route-page">
        <MemoriesHome />
      </div>
    </AppShell>
  );
}
