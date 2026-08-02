> Historical document. Preserved for context only. Use `docs/current-state.md` for current status.

# Kambradu continuation brief

Updated: 16 July 2026

This is the clean restart document for the next implementation round.

## Product promise

Kambradu helps someone learn a living phrase, use it with a real person, and keep the word, voice, story, recipe, photo, place, or memory that gives it meaning.

The distinctive loop is:

`Hear -> Try -> Use -> Keep -> optionally share`

Learning and documentation belong together. Publication is a separate, optional, consent-led branch.

## Four learner destinations

1. Today: one small next step, gentle structure, and encouragement.
2. Learn: courses, short lessons, listening practice, and trusted resources.
3. Memories: journal notes, recordings, personal words, photos, recipes, songs, people, places, and stories.
4. Explore: community-approved words, voices, stories, culture, and people.

Capture should happen inside Memories or after a learning moment. Steward tools, review packets, and publication controls must stay outside ordinary learner navigation.

## Hegel rules

- Hegel is the warm guide, not the Kambradu logo.
- Show the owl at most once per screen.
- Introduce the name once during onboarding. Do not add a visible `Hegel` label beside a recognisable portrait on later screens.
- Hegel can orient, reassure, and celebrate.
- Hegel is not the source of Kristang, cultural authority, consent decisions, or community rulings.
- Use brief, adult copy. No guilt, nagging, baby talk, streak threats, or constant exclamation marks.
- After an absence: `Welcome back. Nothing to catch up on.`

## Current implemented direction

- Today contains one Hegel-led invitation and one primary action.
- The page uses the NomadConnex Cili Padi palette: warm ink, sand, paper, Cili red, soft peach, palm green, and restrained turmeric.
- Navigation is reduced to Today, Learn, Memories, and Explore.
- The language identity in the top bar is static while only Kristang is available.
- The owl was removed from the Kambradu brand mark.
- The visible `Hegel` heading and `Start with Hegel` button label were removed.
- The desktop sidebar collapses at 960px.
- Today is top-aligned instead of vertically centred.
- Today no longer creates artificial mobile page height beneath the bottom navigation.
- The shell now has one real main landmark and the skip link reaches page content.
- Drawer focus, background isolation, focus return, account naming, live status messages, and recording-control labels have been improved.
- Practice is now an immersive, one-visible-step flow with no learner sidebar or bottom navigation.
- My Memories now combines saved words, private notes, and personal words without merging their storage models.
- Add a memory is progressive, private by default, and asks only one question at a time.
- The app icon now uses the Kambradu mark. Hegel remains a guide inside the experience.
- Local-data screens wait for browser storage to hydrate before accepting input, preventing first clicks from being undone.

## Non-negotiable UX contract

- One question per screen.
- One primary action and at most one quiet secondary action.
- One H1 and one supporting sentence.
- No kicker, header, and subheader stacks.
- No cards inside cards above the fold.
- No learner sidebar during a lesson.
- Maximum four global destinations.
- At least 44px controls, preferably 48px.
- Audio is user-controlled and always has a transcript or visible text alternative.
- Everything starts private.
- No streak loss, hearts, leaderboards, XP pressure, accent scoring, or rewards for uploading cultural knowledge.

## Implemented: gentle Practice

Practice now presents one visible step at a time:

1. Hear: play the verified word or phrase. Replay is always available.
2. Try: optional private speaking or a low-pressure non-recording alternative.
3. Use: choose where or with whom it might fit.
4. Keep: save a private word or short memory.
5. Done: offer `Ask someone` or finish for today.

Prompt switching, the clickable workbench, ledgers, review history, speaker forms, contribution state, and future publication controls have been removed from normal practice.

Current interaction principles:

- `Meet sabang.`
- `Try sabang, if you want.`
- `Where might sabang fit?`
- `Keep this for yourself?`
- `Language lives with people.`

The current prompt is labelled dictionary-listed and does not pretend that missing audio exists. Checked community audio is still required before a true Hear experience.

## Implemented: My Memories

The Memories landing page now contains:

- H1: `My memories`
- Promise: `Words, voices and stories you want to keep.`
- Primary action: `Add a memory`
- A mixed `Recently kept` stream using saved-word, journal, and personal-lexicon data.
- First capture question: `What would you like to keep?`
- Initial choices: something someone said, a word or phrase, a story or note, or a photo or object.
- End with `Save privately`.

The existing record types remain distinct. The mixed feed is a presentation layer, not a shared persistence model.

## Next round

1. Simplify Learn. Replace the operational cycle workbench, ledgers, and multi-track dashboard with a small pathway and one recommended lesson.
2. Repair Explore content authority. Add explicit evidence states and remove fake audio controls, unsupported pronunciations, generic approval claims, and demo material presented as verified teaching content.
3. Simplify first-run onboarding to one welcome, one language choice, and one first learning moment.
4. Move advanced builder, contribution, and community-review tools behind deliberate learner choices instead of exposing them through ordinary learning routes.
5. Design real audio and photo storage only when playback, deletion, consent, attribution, withdrawal, and offline behaviour can be honestly supported.

## Plain-language replacements

- learning cycle -> your next step
- journal -> memory or note
- lexicon builder -> save a word
- speaker check -> ask someone
- provenance -> where this came from
- access level -> who can see this
- contribute or submit -> share a copy
- steward -> community reviewer
- submission packet -> remove from learner UI

## Responsive acceptance matrix

Verify at:

- 1440 x 900
- 1024 x 600
- 900 x 600
- 820 x 700
- 390 x 844
- 320 x 844
- 200 percent browser zoom and enlarged text

Acceptance:

- no horizontal page scrolling;
- no cropped headline, owl, button, or bottom navigation;
- the first action appears without a large empty area above it;
- mobile bottom navigation does not cover the last action;
- desktop sidebar does not starve the learning card;
- only one owl appears in the viewport.

## Files changed in this design round

- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/auth/SignInPanel.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/UserMenu.tsx`
- `src/components/ui/BrandMark.tsx`
- `src/components/ui/HegelCompanion.tsx`
- accessibility status-message changes in builder, contribution, journal, practice, and steward components
- `tests/public-smoke.spec.ts`

## Verification before handoff

Current proof on 16 July 2026:

- TypeScript type-check passed.
- 22 Playwright smoke tests passed across desktop Chromium and a 390 x 844 mobile viewport.
- Visual checks passed at 1440 x 900, 1024 x 600, 900 x 600, 820 x 700, 390 x 844, 320 x 844, and a 720 x 450 zoom-equivalent viewport.
- No tested viewport produced horizontal page scrolling.
- At 320 x 844, the last memory choice clears the fixed navigation after scrolling.

Run:

1. `npm run type-check`
2. `npm run build`
3. restart the development server after the build
4. `npm run test:smoke`
5. `git diff --check`

The build and development server both use `.next`. Running a production build while the development server is active can briefly invalidate development assets. Restart the server before browser QA or smoke tests.

## Scope truth

All work remains local. Nothing has been committed, pushed, deployed, or published.

The worktree already contained unrelated changes before this design round. Preserve them and inspect `git status --short` before staging anything.
