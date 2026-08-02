> Historical maintenance record. It is not proof of current dependency, deployment or production status.

# 2026-05-24 Security And Runtime Maintenance

Scope: local security and runtime review after Node/npm updates. The main security issue was a protected-route bypass through a client-set demo cookie.

## Changes Made

- Gated the `kambradu_demo_user=true` cookie in `src/middleware.ts` behind server-side `KAMBRADU_DEMO_AUTH_ENABLED=true`.
- Hid and guarded the local demo sign-in button unless `NEXT_PUBLIC_KAMBRADU_DEMO_AUTH_ENABLED=true`.
- Added both demo-auth flags to `.env.example` with safe default `false`.
- Updated `README.md` to document that demo auth is local/emulator-only.
- Updated Playwright smoke-test configuration to enable the demo flags only for smoke tests.
- Ran `npm update`, which refreshed the lockfile.

## Verification

- `npm run type-check`: passed.
- `npm run build`: passed on Next.js 15.5.18.
- `KAMBRADU_DEMO_AUTH_ENABLED=true NEXT_PUBLIC_KAMBRADU_DEMO_AUTH_ENABLED=true npm run test:smoke -- --project=chromium`: passed, 10 tests.
- `KAMBRADU_DEMO_AUTH_ENABLED=true NEXT_PUBLIC_KAMBRADU_DEMO_AUTH_ENABLED=true npm run test:smoke -- --project=mobile`: passed, 10 tests.
- Runtime negative check without demo flags: request to `/journal` with `Cookie: kambradu_demo_user=true` returned `307` to `/sign-in?next=%2Fjournal`.

## Known Remaining Issue

- `npm audit --audit-level=moderate` still reports 10 moderate vulnerabilities through current Next.js/PostCSS and Firebase Admin / Google Cloud chains.
- `npm audit fix` offered forced downgrades to old/breaking versions, so this pass intentionally did not force the change.
- Firebase CLI is missing on this machine, so Firebase rules tests were not run.

## Follow-Up

- Track upstream safe updates for Next.js, PostCSS, Firebase Admin, and Google Cloud packages.
- Keep both demo-auth flags false outside local emulator and smoke-test runs.
- Install Firebase CLI before running rules verification.
