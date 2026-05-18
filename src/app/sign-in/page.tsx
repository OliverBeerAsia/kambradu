import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SignInPanel } from "@/components/auth/SignInPanel";

export default function SignInPage() {
  return (
    <AppShell activePath="/sign-in">
      <div className="route-page narrow-page">
        <Suspense fallback={<div className="auth-panel">Loading sign-in…</div>}>
          <SignInPanel />
        </Suspense>
      </div>
    </AppShell>
  );
}
