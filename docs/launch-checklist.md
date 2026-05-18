# Launch Checklist

## Local MVP

- `npm ci`
- `npm run type-check`
- `npm run build`
- `npm run test:smoke -- --project=chromium`
- `npm run test:smoke -- --project=mobile`
- Manual desktop and mobile viewport check for `/`, `/lexicon`, `/lessons`, `/learn`, `/practice`, `/builder`, `/contribute`, and `/steward`
- Confirm the interface still follows the five-zone IA: `Today`, `Browse`, `Practice`, `Build`, `Review`

## Firebase

- Create Firebase project.
- Enable Firebase Auth email/password and optional Google sign-in.
- Enable Firestore and Storage.
- Deploy Firestore and Storage rules.
- Run emulators for rules validation.
- Install Firebase CLI locally before running `npm run test:rules`.
- Seed only curated JSON with attribution and review/access fields.

## Hosting and Domain

- Deploy Firebase Hosting preview first.
- Deploy production only after smoke checks pass.
- Add `kambradu.oliverwoods.net` in Firebase Hosting.
- Add Firebase-provided DNS verification/hosting record for `kambradu.oliverwoods.net`.
- Verify HTTPS, PWA manifest, service worker, public browsing, auth, upload path, review path, and no restricted content in public cache.

## GitHub

- Confirm `.gitignore` excludes PDFs, raw extracts, build output, env files, service accounts, and node modules.
- Commit code and docs.
- Create public repo `OliverBeerAsia/kambradu`.
- Push `main`.
