"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <AppShell>
      <div className="page completion-page">
        <h1>Something went wrong.</h1>
        <p>Your memories are still saved in this browser. Nothing was deleted.</p>
        <button className="primary-action" onClick={reset} type="button">Try again</button>
        <p>If this keeps happening, <Link href="/memories">open Memories</Link> and export a backup.</p>
      </div>
    </AppShell>
  );
}
