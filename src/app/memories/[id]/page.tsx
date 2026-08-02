import { AppShell } from "@/components/layout/AppShell";
import { MemoryEditor } from "@/components/memories/MemoryEditor";

export default async function MemoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AppShell activePath="/memories"><MemoryEditor memoryId={decodeURIComponent(id)} /></AppShell>;
}
