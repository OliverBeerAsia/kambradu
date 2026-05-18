# Product Roadmap Implementation Notes

This implementation translates the local roadmap sources into a Firebase-ready local MVP without committing the source PDF or research markdown.

## Roadmap Sources

- `Kambradu (V1.2).pdf`: original V1 deck covering the learner problem, bottom-up journaling and lexicon-building, top-down resources, recording, PWA direction, social sharing, and structure/support.
- `deep-research-report (1).md`: research report recommending a community-governed, audio-first, offline-capable PWA with consent, review, access control, export, learning loops, and mobile-friendly contribution.

Both files remain excluded by `.gitignore`.

## Implemented Local Features

- The shell now uses five plain operating zones: `Today`, `Browse`, `Practice`, `Build`, and `Review`.
- `/`: a simplified learner home with one primary next action, three main routes, saved words, and review state.
- `/lessons`: the Browse surface for cycle-ready lesson/resource units.
- `/learn`: active local cycle status, next action, feedback, and progress.
- `/practice`: cycle-filtered audio-first practice with hidden text reveal, recall confidence, private use note, local spaced-review scheduling, and restricted speaker checks before contribution.
- `/journal` and `/builder`: private note and personal mini-dictionary surfaces that attach artifacts to the active local cycle.
- `/contribute`: builds a local submission packet from active cycle data.
- `/steward`: local review bench for requesting changes, recording revisions, approving, and exposing approved local entries in `/lexicon`.

The current local proof is deliberately hybrid: localStorage-backed workflows with Firestore-shaped IDs, not full emulator persistence yet.

## Next Backend Step

Wire the local cycle workflow to Firestore collections after Firebase Auth and emulator tooling are configured:

- `users/{userId}/learningPlans/{planId}`
- `users/{userId}/practiceReviews/{reviewId}`
- `users/{userId}/speakerChecks/{checkId}`
- `users/{userId}/personalLexicon/{entryId}`
- `users/{userId}/journalEntries/{entryId}`
- `contributions/{contributionId}`
- `communities/{communityId}/lessons/{lessonId}`

Personal lexicon entries should remain private until a user explicitly submits them through the contribution workflow.
