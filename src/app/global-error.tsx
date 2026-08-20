"use client";

import "./globals.css";

// Replaces the root layout, so it owns <html> and <body> and cannot rely on AppShell.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="page completion-page">
          <h1>Something went wrong.</h1>
          <p>Your memories are still saved in this browser. Nothing was deleted.</p>
          <button className="primary-action" onClick={reset} type="button">Try again</button>
          <p>If this keeps happening, open Memories and export a backup.</p>
        </main>
      </body>
    </html>
  );
}
