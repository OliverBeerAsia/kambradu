# Firebase boundary and deferred schema

Firebase Hosting is the intended release surface. Firestore, Authentication and Storage are not part of the current learner experience.

## Current learner storage

The public prototype stores one versioned record in browser storage:

```text
kambradu-local-data-v2
  version
  memories[]
  reviews[]
  activeSession
  updatedAt
```

Dates are ISO strings. Import validates the complete structure. Malformed current data is preserved for recovery.

## Public reference seed

The optional Firestore seed contains:

- one community descriptor;
- `sabang`;
- `janela`;
- no stories, recordings, pronunciation or learner records.

Every entry includes its source locator and the five evidence fields defined in [content-policy.md](content-policy.md).

## Deferred governed model

Do not connect the current learner record directly to production Firestore.

A future governed model must first define:

- identity and account recovery;
- private data ownership;
- encryption and operator access;
- consent, withdrawal and deletion;
- audio and file retention;
- community roles and authority;
- evidence and publication state;
- export and audit requirements.

Firestore rules in this repository are scaffolding for later review. Passing emulator tests does not authorize production learner data or publication.
