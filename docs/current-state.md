# Current state

Updated: 19 August 2026

## Source baseline

- Branch: `main`
- Baseline commit and tag: `d0bc0ad18b4ce222b09b96ef4e04fc019a67ee5d`, `v0.1.0`
- Release candidate: `v0.2.0`, based on that commit.
- Type-check, unit tests and a production build pass locally.
- Browser smoke tests now run locally: 14 Playwright tests pass against the production server.

## Production truth

The current deployment at `kambradu.web.app` was not reachable from the available browser or network tools in this implementation session. Its route map, screenshots, headers and release identifier remain unverified.

Do not infer that the local build is deployed. Do not promote it until the live release is fingerprinted and a preview is verified from an exact commit.

## Public routes in the local production build

- `/`: Today
- `/learn`: dictionary-attested words grouped by theme, with collapsed source details
- `/practice`: lesson-scoped Meet, Meaning, Recall, Connect and Keep flow
- `/memories`: browser-saved memories and data controls
- `/memories/new`: add a word or note
- `/memories/[id]`: edit, practise or delete a memory
- `/about`: sources, permissions and project status
- `/status`: non-visual release metadata

Aliases redirect from `/lessons`, `/lexicon`, `/stories`, `/saved`, `/saved/new` and `/journal`.

`/builder`, `/contribute`, `/steward` and `/sign-in` return the not-found page in production. Their local demonstrations remain available only during development.

## Learner data

The public prototype uses one versioned browser record: `kambradu-local-data-v2`.

It contains memories, reviews and the unfinished practice session. Fresh browsers start empty. Exact historical demo fixtures are removed during migration, while edited or user-created records are retained. Malformed current data is left in place and offered for download before a learner can start fresh.

There is no account, cloud sync, upload, community audio, photograph, sharing or Firestore learner persistence.

## Content

Only `sabang` and `janela` are public. Both are labelled as checked against the Baxter and de Silva dictionary. Neither is presented as speaker attested, partner reviewed or community approved.

The former `loja`, `balcao` or `balkau` and sample-sentence seed is quarantined and rejected by the seed script.

## Known release blockers

- fingerprint the existing live deployment;
- verify the clean Next.js 15.5.21 install in CI; the local lockfile consistency check passes, but package installation is restricted in this environment;
- review the remaining transitive dependency advisories and confirm they do not enter the public runtime;
- commit the intended source so the release identifier names an exact source state;
- run the production smoke suite in an environment that can bind a local port;
- complete automated serious and critical accessibility scanning;
- complete keyboard, VoiceOver and 200 percent zoom checks;
- deploy and verify a Firebase preview;
- promote the same verified artifact only after the preview passes.
