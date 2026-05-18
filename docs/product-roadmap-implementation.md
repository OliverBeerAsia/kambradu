# Product Roadmap Implementation Notes

This implementation translates the local roadmap sources into a Firebase-ready local MVP without committing the source PDF or research markdown.

## Roadmap Sources

- `Kambradu (V1.2).pdf`: original V1 deck covering the learner problem, bottom-up journaling and lexicon-building, top-down resources, recording, PWA direction, social sharing, and structure/support.
- `deep-research-report (1).md`: research report recommending a community-governed, audio-first, offline-capable PWA with consent, review, access control, export, learning loops, and mobile-friendly contribution.

Both files remain excluded by `.gitignore`.

## Implemented Local Features

- `/lessons`: public top-down lesson/resource catalog for word, phrase, story, and culture units.
- `/practice`: authenticated audio-first daily practice loop with hidden text reveal, recall confidence, private use note, local spaced-review scheduling, and restricted speaker checks before contribution.
- `/learn`: authenticated multi-track practice plan for listening, review, journaling, recording, and culture notes.
- `/builder`: authenticated personal mini-dictionary for learner-owned entries, access intent, source notes, review-ready export preview, and submission handoff.
- Existing `/journal`, `/saved`, `/contribute`, and `/steward` routes now sit inside the same roadmap-derived learner/contributor/steward loop.

## Next Backend Step

Wire `/learn` and `/builder` to Firestore collections after Firebase Auth is configured:

- `users/{userId}/learningPlans/{planId}`
- `users/{userId}/practiceReviews/{reviewId}`
- `users/{userId}/speakerChecks/{checkId}`
- `users/{userId}/personalLexicon/{entryId}`
- `communities/{communityId}/lessons/{lessonId}`

Personal lexicon entries should remain private until a user explicitly submits them through the contribution workflow.
