# Contributing to Kambradu

Kambradu is currently an independent public prototype. Code contributions are welcome for the existing text-only, local-first boundary. New language material, recordings, uploads, accounts, sharing and publishing are not open contribution areas yet.

## Local setup

Requirements:

- Node.js 22
- npm 10

Install and run:

```bash
npm ci
npm run dev
```

## Required checks

```bash
npm run type-check
npm run test:unit
npm run build
npm run test:smoke
```

The smoke suite builds the site, starts it with `next start`, then tests the public routes in Chromium. If the environment cannot bind a local port, record that limitation separately from build and unit-test results.

## Public build safety

Production builds fail when either demo-auth flag is `true`:

- `KAMBRADU_DEMO_AUTH_ENABLED`
- `NEXT_PUBLIC_KAMBRADU_DEMO_AUTH_ENABLED`

Builder, contribution, steward and sign-in demonstrations are development-only. Do not expose them from a production build.

The Firebase CLI version is pinned in npm scripts. Firestore is not the learner data store for this milestone.

## Copy and interface review

Every public change must follow [docs/product-principles.md](docs/product-principles.md). Keep the writing warm, adult and direct. Remove repeated explanations, internal product language, canned praise, inflated claims and em dashes.

## Language content

Do not add a teaching item without:

- an exact source locator;
- a compatible licence or permission record;
- the evidence fields in [docs/content-policy.md](docs/content-policy.md);
- a named reviewer for any claim beyond source transcription and checking.

Never seed a file under `scripts/seeds/quarantine/`.
