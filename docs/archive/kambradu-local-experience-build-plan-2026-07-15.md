> Historical document. Preserved as evidence of the July 2026 build process. It does not describe the current public prototype.

# Kambradu Local Experience Build Plan

Date: 15 July 2026  
Status: Active local implementation  
Source: [Dream App Audit](kambradu-dream-app-audit-2026-07-15.md)

## Product direction

Kambradu should feel like a warm invitation into living language, not an administrative dashboard.

The learner promise for this build is:

> Learn one living phrase. Keep one family memory.

Every primary learner screen should help answer:

> Who will you use this with?

## Experience requirements from the owner

- Very friendly and easy to understand.
- Polished, confident, and joyful.
- Lightly gamified without streak guilt, competition, or extractive engagement.
- Malaysian-rooted colour and atmosphere.
- Mobile-first, while retaining a capable desktop Steward Studio.
- Real progress should mean language use, relationships, memory, and growing capability.

## Visual direction

The first local visual system uses a Malaysian-inspired material palette:

- coconut cream for calm reading surfaces;
- turmeric gold for energy and primary action;
- pandan green for growth and success;
- bunga raya coral for warmth and emphasis;
- Straits teal for trust and navigation;
- indigo for depth and editorial contrast.

This is an initial product-design direction, not a claim of universal Malaysian identity. Final branding, motifs, names, photography, and cultural symbols require Kristang and broader community co-design.

The learner UI should use rounded, tactile cards, generous spacing, warm copy, small celebrations, and human context. Dense ledgers and status rails belong in Steward Studio.

## Gentle gamification model

Use:

- a weekly language rhythm rather than a fragile daily streak;
- "phrases growing," "memories kept," and real-world missions;
- visible small-step progress through Hear, Try, Use, and Remember;
- celebrations for returning after a break;
- private capability milestones;
- optional family or circle projects with no ranking.

Avoid:

- public leaderboards;
- hearts or lives;
- streak loss;
- shame messages;
- points for uploading community knowledge;
- accent scores;
- publication counts as learning progress.

## First implementation slice

The first local slice is deliberately bounded. It will:

1. Reframe Today around one living language mission.
2. Introduce the Malaysian-inspired colour system.
3. Add gentle weekly-rhythm and language-growth feedback.
4. Replace operational learner navigation with Today, Learn, Capture, Library, and Community.
5. Add a mobile bottom navigation.
6. Fix the 390px Saved Words and Review State layout collisions.
7. Preserve the current routes and underlying local workflow.
8. Keep all audio claims truthful until real recording and playback are implemented.

### Files in scope for slice one

- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/ui/BrandMark.tsx`
- `tests/public-smoke.spec.ts`
- this plan and the audit document

Pre-existing modified files outside this list must remain untouched.

## Slice one acceptance criteria

- Desktop Today has one clear primary mission and feels warm rather than administrative.
- The first mobile viewport shows the mission and its primary action without layout collision.
- Mobile has persistent access to Today, Learn, Capture, Library, and Community.
- Saved words and access badges never overlap at 390px.
- Public and protected state remains visible but is not the dominant learner message.
- The experience presents gentle progress without punitive mechanics.
- Existing protected routes and core local cycle tests continue to work.
- Type-check, production build, Chromium smoke, mobile smoke, and visual QA pass.

## Next implementation slices

### Slice two: Honest audio learning

- Real record, playback, retake, stream cleanup, and IndexedDB persistence.
- One complete audio-rich Shop Visit pathway.
- Separate recognition, understanding, production, and use states.
- Connect Today, Saved, Practice, and due scheduling.

### Slice three: My Memory

- Multimodal private library for voice, phrase, story, image, recipe, song, person, and place.
- "Practise this," "Ask someone," and "Prepare selected parts for review."
- Local export and restore.

### Slice four: Family Relay

- No-account speaker response link.
- Voice reply, alternate form, uncertainty, and decline options.
- Versioned, purpose-specific consent receipt.

### Slice five: Governed publication

- Real roles and separate Steward Studio.
- Immutable review packet and decision events.
- Linguistic and cultural review.
- Trusted publication projection, correction, withdrawal, and purge.

## Resume point

If work stops, resume by checking:

1. the exact file scope above;
2. `git status --short` for pre-existing changes;
3. the acceptance criteria for the active slice;
4. desktop and 390 x 844 screenshots;
5. `npm run type-check`, `npm run build`, and `npm run test:smoke`.

## Slice 1.1: Hegel and radical simplification

The user review of the first slice showed that the Today dashboard still asked learners to process too much. Slice 1.1 replaces that dashboard with one Hegel-led invitation, one phrase, one main action, one privacy reassurance, and one quiet progress cue.

Implemented locally:

- Hegel is the primary visual and emotional guide on Today and onboarding.
- Today has one visible action, `Start with Hegel`.
- Secondary choices sit behind `More for today`.
- Navigation is reduced to Today, Learn, Memories, and Explore.
- The top bar contains only the language and account controls.
- Technical route status and prototype labels are removed from the learner view.
- Email sign-in is optional and disclosed only when requested.
- The current NomadConnex Cili Padi palette is used: warm ink, sand, paper, Cili action red, Cili tint, palm success, and amber warning.
- Primary controls are at least 48px in the simplified experience.
- Drawer focus is trapped and returned to its opener, and background surfaces are isolated while it is open.
- Hegel remains a guide, not a source of linguistic or consent authority.

Research translated into the design:

- Front of House: one task per screen, progressive disclosure, clear recovery, and one dominant next action.
- Duolingo: immediate interactive value and short learning units.
- Memrise: one flexible `Up next` recommendation instead of a demanding activity dashboard.
- Drops: a short, contextual session frame.
- Khan Academy Kids: a character with a clear guidance role, adapted here for an adult and intergenerational audience.
- WCAG 2.2 and W3C cognitive accessibility guidance: manageable choices, clear copy, visible focus, larger targets, and reduced motion.

Remaining simplification work:

1. Turn Practice into one visible step at a time: Hear, Try, Meaning, Use, Done.
2. Replace technical learner words such as cycle, ledger, packet, provenance, and access level with plain language.
3. Merge saved words, journal entries, recordings, and private lexicon items into Memories.
4. Convert Capture into a short contextual flow rather than a main workspace.
5. Simplify Learn to one resume action and a small set of pathways.
