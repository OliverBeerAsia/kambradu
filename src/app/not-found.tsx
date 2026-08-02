import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="page completion-page">
        <h1>This page is not available.</h1>
        <p>Return to the public Kristang learning prototype.</p>
        <Link className="primary-action" href="/">Go to Today</Link>
      </div>
    </AppShell>
  );
}
