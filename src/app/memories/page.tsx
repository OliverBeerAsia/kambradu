import { AppShell } from "@/components/layout/AppShell";
import { MemoriesHome } from "@/components/memories/MemoriesHome";

export default function MemoriesPage() {
  return <AppShell activePath="/memories"><MemoriesHome /></AppShell>;
}
