"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HegelCompanion } from "@/components/ui/HegelCompanion";

export function SignInPanel() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/journal";
  const demoAuthEnabled = process.env.NEXT_PUBLIC_KAMBRADU_DEMO_AUTH_ENABLED === "true";

  function startDemoSession() {
    if (!demoAuthEnabled) {
      return;
    }

    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/journal";

    document.cookie = "kambradu_demo_user=true; path=/; max-age=604800; SameSite=Lax";
    window.location.assign(safeNext);
  }

  return (
    <section className="auth-panel simple-auth-panel" aria-labelledby="sign-in-heading">
      <HegelCompanion compact>
        <p className="hegel-hello">Welcome. I&apos;m Hegel.</p>
        <h1 id="sign-in-heading">Shared work is not available yet.</h1>
        <p>Learning and memories still work on this device.</p>
      </HegelCompanion>

      {demoAuthEnabled ? (
        <button className="simple-auth-start" aria-label="Continue as local demo user" onClick={startDemoSession} type="button">
          Start learning
        </button>
      ) : null}

      <Link className="simple-auth-browse" href="/lessons">
        Return to Learn
      </Link>
    </section>
  );
}
