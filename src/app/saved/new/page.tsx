import { AppShell } from "@/components/layout/AppShell";
import { MemoryCapture } from "@/components/memories/MemoryCapture";
import { UserMenu } from "@/components/layout/UserMenu";

export default function NewMemoryPage() {
  return (
    <AppShell activePath="/saved/new" authSlot={<UserMenu />}>
      <div className="route-page memory-route-page">
        <MemoryCapture />
      </div>
    </AppShell>
  );
}
