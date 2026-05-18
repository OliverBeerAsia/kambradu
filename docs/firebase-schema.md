# Firebase Schema

## Top-Level Collections

- `communities/{communityId}`: language/community metadata.
- `communities/{communityId}/memberships/{uid}`: learner, contributor, steward, and admin roles.
- `users/{uid}`: private user profile and settings.
- `users/{uid}/journalEntries/{entryId}`: private learner journal.
- `users/{uid}/personalLexicon/{entryId}`: private mini-dictionary entries before submission.
- `users/{uid}/learningPlans/{planId}`: private task completion, reminder cadence, and review rhythm.
- `users/{uid}/practiceReviews/{reviewId}`: private audio-first recall results, confidence, next review date, and local reflection.
- `users/{uid}/speakerChecks/{checkId}`: private speaker questions, consent state, access intent, and review-prep status.
- `users/{uid}/savedWords/{savedId}`: private saved/review state.
- `users/{uid}/goals/{goalId}`: private learner goals.
- `communities/{communityId}/lessons/{lessonId}`: reviewed lesson/resource units that can reference approved words, phrases, stories, recordings, or external resources.
- `lexicalEntries/{entryId}`: reviewed dictionary entries with access and source metadata.
- `stories/{storyId}`: reviewed phrases and stories.
- `recordings/{recordingId}`: uploaded-media metadata.
- `contributions/{contributionId}`: draft/submitted material awaiting steward review.
- `consentProfiles/{profileId}`: consent and attribution profiles.
- `exports/{exportId}`: steward-requested exports.

## Required Publication Fields

Public content must include `communityId`, `access`, `reviewStatus`, and `source` or contribution attribution.

Only `reviewStatus: "approved"` and `access: "open"` should be browseable without sign-in.

## Safe Local Emulator Defaults

Use `demo-kambradu` with `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` for local work. The client treats `demo-*` project IDs as emulator-only and connects Auth, Firestore, and Storage independently as each SDK is initialized, so opening Auth first does not prevent Firestore or Storage from attaching later.

Do not place source PDFs, private journals, uploaded recordings, consent profiles, service-account JSON, or emulator exports in Git.
