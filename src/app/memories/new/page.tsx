import { AppShell } from "@/components/layout/AppShell";
import { MemoryCapture } from "@/components/memories/MemoryCapture";

export default function NewMemoryPage() {
  return <AppShell activePath="/memories"><MemoryCapture /></AppShell>;
}
