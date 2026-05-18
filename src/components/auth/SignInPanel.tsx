"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export function SignInPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/journal";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function startDemoSession() {
    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/journal";

    document.cookie = "kambradu_demo_user=true; path=/; max-age=604800; SameSite=Lax";
    router.push(safeNext, { scroll: true });
  }

  function submitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }

    if (!isFirebaseConfigured) {
      setMessage("Firebase credentials are not configured locally yet. Use the demo session for local testing.");
      return;
    }

    setMessage("Firebase Auth wiring is present; connect project credentials before live sign-in.");
  }

  return (
    <section className="auth-panel" aria-labelledby="sign-in-heading">
      <div>
        <h1 id="sign-in-heading">Sign in to save, record, and submit</h1>
        <p>
          Public Kristang content stays browseable without an account. Learner journals, saved words, uploads, and
          steward review are private or role-limited.
        </p>
      </div>

      <form onSubmit={submitEmail}>
        <label>
          Email
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="maria@example.com"
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            type="password"
            value={password}
          />
        </label>
        <button type="submit">
          <Mail size={18} aria-hidden="true" />
          Continue with email
        </button>
      </form>

      <button className="secondary-action" onClick={startDemoSession} type="button">
        Continue as local demo user
      </button>

      {message ? <p className="form-message">{message}</p> : null}
    </section>
  );
}
