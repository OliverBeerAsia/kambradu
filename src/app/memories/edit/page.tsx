"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { MemoryEditor } from "@/components/memories/MemoryEditor";

/**
 * A memory is identified by a query parameter rather than a path segment.
 *
 * Memories are created in the browser and exist nowhere else, so their ids
 * cannot be known when the site is built. A path segment would demand a server
 * to render a page whose content the server can never see.
 */
function RequestedMemory() {
  const id = useSearchParams().get("id") ?? "";
  return <MemoryEditor memoryId={id} />;
}

export default function MemoryEditPage() {
  return (
    <AppShell activePath="/memories">
      <Suspense fallback={null}>
        <RequestedMemory />
      </Suspense>
    </AppShell>
  );
}
