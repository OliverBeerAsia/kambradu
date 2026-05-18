# Kambradu

Kambradu is a Kristang-first public MVP for endangered-language learning and community stewardship. Anyone can browse approved public Kristang words, phrases, and stories. Signed-in learners can save words, keep a private journal, record or upload media, and submit material for steward review.

## MVP Scope

- Primary operating zones: `Today`, `Browse`, `Practice`, `Build`, `Review`
- Public routes: `/`, `/lexicon`, `/lessons`, `/stories`, `/about`
- Authenticated routes: `/practice`, `/learn`, `/journal`, `/builder`, `/saved`, `/contribute`, `/steward`
- Hybrid local learning cycle: lesson -> practice -> private note/build -> speaker check -> contribution -> steward feedback -> revision -> approval -> public visibility
- Roadmap-derived learner tools: audio-first practice, private journal, personal lexicon builder, cycle plan, and lesson/resource catalog
- Firebase-first backend plan: Auth, Firestore, Storage, Hosting, and local emulators
- Public content is approved-only. Contributor material remains draft/submitted until a steward approves it.
- Raw source PDFs and bulk extracted dictionary text are excluded from Git.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Next. The current QA/dev port is `http://127.0.0.1:3217` when started with:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3217
```

Use the local demo sign-in button on `/sign-in` to set a demo cookie for protected routes.

## Verification

```bash
npm run type-check
npm run build
npm run test:smoke -- --project=chromium
npm run test:smoke -- --project=mobile
```

## Firebase

Copy `.env.example` to `.env.local` and add Firebase web app values. For emulator work:

```bash
npm run firebase:emulators
```

This requires the Firebase CLI to be installed and authenticated locally. Firestore rules tests can then run with
`npm run test:rules`.

Seed curated public content only after reviewing source, license, access, and attribution:

```bash
FIREBASE_PROJECT_ID=demo-kambradu npm run seed:firestore -- scripts/seeds/kristang-curated-sample.json
```

The seed script uses Application Default Credentials or `FIREBASE_SERVICE_ACCOUNT_JSON`. Do not commit service-account files.

## Content Attribution

Dictionary-derived entries must include attribution for Alan N. Baxter and Patrick de Silva, Pacific Linguistics, DOI/source note, and the CC BY-SA 4.0 online-edition license. See `docs/content-policy.md`.

## Design System

The local MVP follows the HeadsUp / LevelHeads product language, but the current interface is intentionally quieter: five persistent tabs, one clear purpose per screen, fewer explanatory paragraphs, and Hegel used mainly for consent/privacy guidance. See `docs/design/README.md`.

## License

Code is MIT licensed. Content and media have separate source, access, consent, and license fields.
