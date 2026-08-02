> Historical audit. Findings may have been superseded. Use `docs/current-state.md` for current status.

# Kambradu: Current System Audit and Dream App Blueprint

Date: 15 July 2026  
Source vision: `Kambradu (V1.2).pdf`, 15 slides, September 2022  
Current system: Kambradu Next.js repository on `main` at `d066e21`

## Executive verdict

Kambradu has found an important product idea, but the current build does not yet deliver the full proposal.

The strongest interpretation of the original vision is not "Duolingo for endangered languages" and not a digital archive. It is this:

> Kambradu turns family language interactions into private learning moments that can, with explicit consent and community authority, become durable shared language memory.

The present repository proves parts of that idea unusually well. It contains a coherent local learner cycle, private journaling, personal lexicon building, speaker checks, provenance, access labels, contribution packets, steward feedback, and simulated publication. Those are valuable product assets.

However, it is still a local interaction prototype:

- The real audio experience is not implemented.
- Private records are stored in browser `localStorage`, not a safe offline vault.
- Authentication, community roles, sync, notifications, invitations, and social connection are not operational.
- The top-down content offer is a very small static seed set.
- Community governance is represented as fields and labels, not enforceable authority.
- The interface feels like a language operations dashboard rather than a warm, living, intergenerational experience.
- The mobile layout has visible overlaps at 390px.
- Several current publication and access paths are unsafe for real community content.

### Overall assessment

| Dimension | Score | Verdict |
|---|---:|---|
| Fidelity to the 2022 concept | 2.5 / 5 | Many proposed surfaces exist, but their core behavior is thin or simulated. |
| Bottom-up learner tools | 3 / 5 | The best-developed part of the prototype. |
| Top-down lessons and resources | 1.5 / 5 | A content shell, not yet a learning offer. |
| Connection between learners and speakers | 1 / 5 | A speaker-check form exists, but no reciprocal interaction. |
| Audio-first learning and documentation | 1 / 5 | Audio is mostly visual language and browser permission scaffolding. |
| Gentle, inclusive, all-ages experience | 2 / 5 | Clear and legible, but dense, administrative, English-only, and not elder-first. |
| Community governance and trust | 1.5 / 5 | Strong intent, insufficient enforcement and consent detail. |
| Offline and low-data readiness | 1 / 5 | Manifest and service-worker source exist, but the offline promise is not operational. |
| Multi-language readiness | 0.5 / 5 | `communityId` exists, but product, data, interface, and policy are Kristang-hard-coded. |
| Readiness for real sensitive content | 1 / 5 | Not safe for a public or community-content pilot yet. |

This is not a failed build. It is a successful concept prototype whose most valuable insight is now clearer than the implementation around it.

## The dream already inside the 2022 proposal

The deck begins with a personal and intergenerational story: grandparents, identity, a visit to Melaka, and the difficulty of finding someone with whom to say a simple greeting. That matters more than the feature list.

The proposal identifies four connected problems:

1. A learner may have few or no nearby speakers.
2. Available materials may be academic, scarce, text-heavy, or culturally detached.
3. The learner may not know what to do next or how to recognise progress.
4. Valuable knowledge lives in voices, family practices, recipes, songs, stories, places, and relationships, not only in dictionaries.

It then proposes two complementary halves:

- Bottom-up: private journal, learner-built lexicon, recording, structure, support, and encouragement.
- Top-down: courses, dictionaries, approved resources, user-generated cultural material, and social connection.

The distinctive idea is the bridge between those halves. A learner's private encounter can, when appropriate, become a trusted community resource. That same resource can then help another learner create a new encounter.

## What the current system genuinely delivers

### 1. A coherent learner-to-steward vertical slice

The current loop connects:

`lesson -> practice -> private note -> personal lexicon -> speaker check -> contribution -> steward feedback -> approval -> browse`

The repository states this clearly in [README.md](../README.md#L7) and acknowledges that it is a local proof rather than a completed backend in [product-roadmap-implementation.md](product-roadmap-implementation.md#L23).

This is the strongest part of the product. It demonstrates that learning, documentation, consent, and review can belong to one system.

### 2. Privacy and provenance are visible product concepts

The interface repeatedly tells the learner that material is private first. Contributions ask for provenance, consent, attribution, and access. Firestore rules distinguish open, community, and restricted access. The content policy says that submissions are not public until reviewed.

That is substantially more responsible than a conventional crowdsourced dictionary.

### 3. The personal lexicon and journal reflect the original bottom-up vision

The builder can hold a headword, English gloss, alternate spelling, example, source note, intended access, and workflow status. The journal is private and attaches notes to an active cycle. These are useful foundations for a personal heritage portfolio.

### 4. The system avoids punitive gamification

There are no public leaderboards, hearts, loss aversion, or shame-based streaks. The tone encourages returning and continuing. This is appropriate for a language experience tied to identity, family, anxiety, and historical pressure.

### 5. The desktop visual system is coherent

The desktop app has strong hierarchy, consistent components, visible access states, clear primary actions, good contrast, semantic labels, a skip link, and visible focus states. The current Steward Studio visual language is useful for operational work.

## Critical gaps and risks

These are not all equal. The first group blocks the use of real community content.

### P0: Public and community trust blockers

#### Public browsing does not consistently respect access

Approved local entries are converted to lexicon entries regardless of whether their access is open, community, or restricted in [learning-cycles.ts](../src/lib/learning-cycles.ts#L284). [LocalLexiconBrowser.tsx](../src/components/lexicon/LocalLexiconBrowser.tsx#L10) then merges all of them into the public lexicon.

The static public seed also includes a community-access item. "Approved" and "public" must be separate decisions.

#### Steward authority is not enforced in the app

`/steward` is protected only by the same demo sign-in check as learner pages. [middleware.ts](../src/middleware.ts#L3) does not check a community role. In the local proof, the same browser can act as learner, speaker, contributor, and steward.

This is acceptable for a prototype demonstration, but not for a pilot.

#### The reviewer cannot inspect the underlying evidence

The submission packet displays counts of practice reviews, notes, lexicon entries, and speaker checks rather than the reviewable evidence itself. [ReviewQueue.tsx](../src/components/steward/ReviewQueue.tsx#L139) shows the counts. The drafted security rules keep speaker checks owner-private, and the rules test explicitly denies steward access.

The correct solution is not broad access to a learner's private vault. It is an immutable, deliberately disclosed review snapshot containing only the evidence the learner and speaker agreed to share.

#### Consent is a statement, not a revocable grant

The contribution form validates that a free-text consent field is non-empty in [ContributionForm.tsx](../src/components/contribution/ContributionForm.tsx#L67). The data model reduces consent further to broad states and two booleans.

Real consent needs separate choices for:

- private storage;
- review by named people or a council;
- family or community teaching;
- public web display;
- download and redistribution;
- translation, transcription, and subtitles;
- research;
- commercial use;
- AI training;
- voice synthesis;
- expiry, renewal, and withdrawal.

The speaker, contributor, rights holder, cultural authority, and guardian may be different people.

#### Real private records are not safely stored

Journals, learning cycles, practice reviews, speaker checks, drafts, and personal lexicon items currently live in same-origin browser `localStorage`. This is plaintext, not user-scoped, fragile on shared devices, and vulnerable to browser clearing or later account switching.

Do not accept sensitive family, sacred, minor, or precise-location content until this boundary is replaced.

#### Publication and withdrawal lack an auditable lifecycle

There is no immutable revision history, dual approval, recusal, appeal, emergency takedown, consent expiry, or downstream cache/export purge.

For sensitive language material, withdrawal is a core feature, not an administrative afterthought.

### P0: The audio-first promise is not real

The recorder requests microphone access and starts `MediaRecorder`, but does not collect `dataavailable` chunks, create a Blob, preview the recording, save it, upload it, or attach it to a consent receipt. It also does not stop the microphone stream tracks. See [ContributionForm.tsx](../src/components/contribution/ContributionForm.tsx#L43).

The upload button has no handler. The practice play button only changes UI state in [PracticeSession.tsx](../src/components/practice/PracticeSession.tsx#L199). An approved entry is marked `hasAudio` when a speaker-check ID exists, even when no audio exists, in [learning-cycles.ts](../src/lib/learning-cycles.ts#L303).

For an orally focused, low-resource language, speaker audio is not a decorative enhancement. It is part of the primary learning object.

### P0: The learning loop is conflated with publication

The current cycle treats practice, a journal entry, a lexicon entry, a speaker check, submission, feedback, and approval as one progress sequence. A learner can effectively "complete" a cycle through workflow activity without demonstrating comprehension or use. A learner who becomes more capable but never submits content cannot complete the loop.

These must become separate, connected branches:

```text
Learn -> retrieve -> use -> reflect -> retain
                         \
                          optional contribution -> review -> selective publication
```

Contribution should never be the price of learning.

### P1: The learning mechanics are mostly shells

- Lessons are catalog cards, not sequenced audio lessons with objectives, input, support, practice, and assessment.
- Practice does not verify listening, recall, or production before accepting confidence.
- Saved words, practice history, and the Today queue are disconnected data islands.
- The reminder selector creates no reminder, notification, calendar event, or email.
- The review scheduler has a chronology problem: the newest-first list is reversed before `find`, causing the oldest matching review to be selected in [PracticeSession.tsx](../src/components/practice/PracticeSession.tsx#L76).
- Journal entries cannot yet hold audio, images, recipes, songs, places, or structured story material.
- Approved stories and phrases are flattened into lexicon entries instead of generating new stories, lessons, clips, and practice items.

### P1: The product lacks people, place, and living culture

The interface is dominated by cards, ledgers, statuses, queues, and workflow labels. There are almost no named voices, faces, family relationships, neighbourhoods, routes, kitchens, coastlines, festivals, contemporary creative work, or real situations.

The 2022 deck's emotional centre is "my grandmother" and "who can I say this to?" The current centre is "what status is this record?"

### P1: Mobile is responsive, but not mobile-first

Live review at 390 x 844 found:

- the header occupies two rows and delays the primary content;
- operational metadata stacks above the first meaningful practice action;
- Saved Words text overlaps its schedule labels;
- Review State text collides with its access badge;
- the floating local-guide control overlaps nearby content;
- there is no persistent mobile navigation or central Capture action.

The CSS collapses desktop grids to one column, but does not reprioritise the experience for small screens.

### P1: Static seed content is presented with more authority than the evidence supports

Several entries are marked approved with generic community attribution. The festival story is a thin demonstration seed but appears culturally approved. Pronunciations, phrases, and spellings may be correct, but the repository does not preserve named verification evidence.

Until verified by named Kristang language partners, demo material should be labelled:

- interface demonstration only;
- linguistically unverified;
- not community-approved;
- not suitable for public teaching.

Dictionary licensing proves permission to reuse the source. It does not prove current community endorsement or contemporary usage.

### P2: The PWA and multi-language promises are not operational

The repository contains a manifest and `sw.js`, but no source code registers the service worker. The worker's restricted-route list also omits protected learner routes such as `/practice`, `/learn`, and `/builder`.

The product is hard-coded to `demo`, `Maria D.`, `kristang-melaka`, English interface labels, and a single Kristang content module. A `communityId` field is a useful start, but it does not provide language, variety, locality, orthography, script, governance, or translation architecture.

## The recommended product definition

### Product promise

> Learn one living phrase. Keep one family memory.

### Strategic identity

> A community-governed bridge between family language learning and a living, consented language corpus.

### Core question

Every learner-facing part of Kambradu should answer:

> Who will you use this with?

### North-star outcome

Use a mission outcome rather than daily active users:

> The percentage of active learner-speaker pairs completing at least four meaningful language-use moments per month.

A meaningful language-use moment means a learner prepared or discovered an expression, used or discussed it with another person, and captured a reflection, correction, or speaker response.

## The Kambradu Living Language Loop

```text
Encounter a real voice
        |
Hear and understand in context
        |
Try privately
        |
Use with a person or in a real situation
        |
Keep a memory, correction, or variant
        |
Return for spaced retrieval
        |
Optionally ask permission to contribute
        |
Speaker validates -> stewards govern -> publish selectively
        |
Approved material becomes new learning
```

This loop should replace the current publication-centred definition of progress.

## Dream experience model

### 1. Onboarding: start with purpose and relationship

Ask:

- Who do you want to speak with?
- Where do you want to use the language?
- What can you already understand, say, read, or write?
- Which family or community forms matter to you?
- Do you have someone you can ask?
- What would make you proud in six weeks?
- Do you need low-data, offline, large-text, or audio-led mode?

Example destinations:

- Greet my grandmother naturally.
- Understand the kitchen conversation during Christmas.
- Cook kalderada from a family recording.
- Introduce myself at a community event.
- Retell one family story to my children.

Allow guest, local-first use. Defer account creation until the learner chooses backup, sync, or contribution.

### 2. Today: one small real-world mission

Replace the operational dashboard with one human, contextual card:

- named speaker or approved collection;
- a short phrase or story clip;
- place and occasion;
- one Play button;
- one Continue button;
- one suggested use today.

Progress copy should say things like "three family phrases kept" or "you understood two speakers," not only show ledger counts.

### 3. Hear: a true audio-first phrase player

- Real speaker audio, never fake waveform decoration.
- Normal, slow, and loop playback.
- Text hidden initially but always available.
- Optional Kristang, Bahasa Malaysia, and English views.
- Chunking, transcript, and translation after listening.
- Multiple speaker or family variants where available.
- Source and permission details in a secondary sheet, not in the main learning flow.

### 4. Try: private recording without accent scoring

- Hold to record.
- Replay and retake.
- Compare by ear with the speaker.
- Keep privately or discard.
- Never rank accents or imply one family variant is defective.

### 5. Use: a meaningful micro-mission

Examples:

- Send a morning greeting to a relative.
- Ask what one kitchen object is called.
- Practise buying something at a shop.
- Follow one step of a recipe.
- Ask for a childhood memory connected to a song.
- Retell a 30-second story.

Include a solo or diaspora route using approved community clips and optional mentors.

### 6. Family Relay: make the speaker side radically lighter

A learner taps "Ask someone." Kambradu creates a small, no-account link that can travel through WhatsApp, SMS, or email.

The recipient can:

- hear the learner's question;
- answer by voice or text;
- choose "yes," "another way," "not in our family," or "I am not sure";
- offer another pronunciation, spelling, or example;
- choose who may hear or reuse the response;
- remain named, pseudonymous, or anonymous;
- decline without pressure;
- withdraw later.

The speaker receives a copy of the finished family card or story. The exchange must be reciprocal, not extractive.

### 7. My Memory: a multimodal private scrapbook

Merge the emotional jobs of Journal and Builder into a personal library of:

- voices;
- words and phrases;
- recipes;
- songs;
- photos and objects;
- people and relationships;
- places and journeys;
- family stories;
- learner attempts and reflections.

Every item can offer:

- Practise this.
- Ask someone.
- Add another family variant.
- Build a story.
- Prepare selected parts for community review.

### 8. A phrase has a life

The public or community phrase card should show more than a headword and gloss:

- speaker and relationship, where permitted;
- place and occasion;
- audience and register;
- generation or age group;
- variety and orthography;
- several audio attestations;
- translations in tagged languages;
- variants and uncertainty;
- source evidence;
- access protocol and consent history.

Show "my family says..." next to "another family says..." without forcing false consensus.

### 9. Stories, places, and memory routes

Let stories attach to a home, kampung, river, coastline, street, market, school, church, longhouse, migration route, or diaspora city. Support exact, approximate, or hidden location.

Do not reduce culture to museum pins. The meaningful object may be movement between places, a seasonal route, a family journey, or a contemporary event.

### 10. Steward Studio

Move the current workbench density into a separate, role-protected desktop and tablet experience. A reviewer should see:

- the exact source recording segment;
- speaker and contributor roles;
- transcript and translations;
- each proposed form, sense, and variant;
- provenance chain;
- consent permissions and expiry;
- cultural protocol labels;
- disagreements and prior revisions;
- the exact surfaces on which an approved item will appear.

Support linguistic review, cultural-authority review, partial approval, access restriction, recusal, council quorum, appeals, corrections, and withdrawal.

## Recommended mobile information architecture

Use five learner-facing destinations:

| Destination | Purpose |
|---|---|
| Today | One personal next step, recent voice, and resume. |
| Learn | Guided phrase and story sessions plus downloaded packs. |
| Capture | Central action for Voice, Photo, Word, Story, Recipe, or Song. |
| Library | Community and Mine, searchable offline. |
| Community | People, questions, events, circles, and feedback. |

Put goals, family connections, permissions, export, storage, offline state, and settings in Profile.

Show Steward Studio only to authorised reviewers. Do not make moderation a main navigation item for ordinary learners.

## Linguistic model: from dictionary entry to attestation graph

The current headword model privileges one spelling and treats alternatives as a string list. The dream system should preserve claims and evidence:

```text
form
  -> sense
  -> usage event
  -> speaker
  -> recording segment
  -> place and occasion
  -> consent grant
  -> source
  -> review decision
```

Recommended concepts:

- `Language`: community-approved name, identifiers, scripts, direction.
- `Community`: governance, places, memberships, policies.
- `Variety`: family, locality, generation, or community-defined lect.
- `OrthographyProfile`: accepted symbols, display preferences, search normalisation.
- `FormVariant`: spelling, pronunciation, register, place, speaker, confidence, relationship to other forms.
- `Sense`: language-tagged definitions and translations.
- `UsageEvent`: who said what, to whom, where, when, and why.
- `MediaSegment`: exact time range, transcript, translation, and speaker turns.
- `Attestation`: source-backed claim linking form, sense, event, speaker, and evidence.
- `ContentLineage`: source -> approved object -> lesson -> practice -> learner artifact.

Community-endorsed teaching forms can exist without deleting dissenting or parallel evidence.

## Learning model

### Separate skill states

A learner can recognise a phrase without being able to produce it. Track at least:

- audio recognition;
- contextual understanding;
- spoken production;
- transfer to a new situation;
- comprehension across speakers or variants;
- dialogue or retell ability.

### Capture task evidence, not confidence alone

Each review event should record:

- prompt and response mode;
- correct, partly correct with support, or not yet;
- support used;
- confidence;
- optional response recording;
- speaker or variant heard;
- due date and full history.

Use an understandable expanding scheduler based on successful retrieval and support use. After a break, reflow the queue gently instead of creating a punishing backlog.

### Let approved community material generate learning

An approved recording segment should be able to become:

- a listening item;
- a shadowing prompt;
- a dialogue;
- a story reconstruction;
- a dictation;
- a cultural mission;
- a variant comparison;
- a future lesson.

The community corpus and the learning system should reinforce each other.

## Malaysian cultural and historical framing

### Change the rhetoric from rescue to language futures

The deck's language about "saving" endangered languages and being "too late" for some communities should be revised. Language shift is not simply a failure of preservation. It can reflect colonial rule, schooling, migration, stigma, economic pressure, land loss, and state language policy.

Recommended language:

> Kambradu helps people speak, learn, teach, create in, and govern the future of their languages.

Use terms such as endangered, dormant, awakening, or revitalising only when the relevant community accepts them.

### Do not treat Malaysian language communities as one category

Kristang and Chetti Malay Creole histories, Peninsular Orang Asli communities, Indigenous peoples of Sabah and Sarawak, sign-language communities, migrant communities, and transboundary languages have different histories, authorities, legal contexts, and access needs.

Kambradu should provide common infrastructure for different community constitutions, not one universal cultural policy.

### Use community-approved names

The community-led [Kodrah Kristang terminology guidance](https://kodrah.kristang.com/terminology/) prefers Kristang or Serani in relevant contexts and explains why names that centre only Malacca or Portugal can be inappropriate outside specific Malaysian contexts.

The current `Kristang / Melaka` label should therefore be treated as a pilot workspace label, not a universal identity claim. Model Melaka, Kuala Lumpur, Singapore, Perth, and other diaspora places as connected communities and routes where partners want that representation.

Names such as Chitty/Chetti Malay, Orang Kanaq/Kanaq, Jakun, Ten'edn/Maniq, Kenaboi, Sabum, Wila', Lelak, and Seru require community and scholarly verification before product use. Vitality status and speaker counts need source, date, method, and uncertainty.

### Make culture present-tense

Support current family life, kitchens, football, school, work, worship, fishing, gaming, jokes, memes, music, dating, community politics, festivals, and new creative work. Do not present people as static heritage exhibits.

## Community governance and consent

### Community Charter Studio

Before a language space opens, its community should define:

- preferred names and spellings;
- who holds authority;
- reviewer roles and scope;
- quorum, recusal, and appeal rules;
- orthography and variation policy;
- cultural sensitivity categories;
- default access and retention;
- consent renewal and withdrawal;
- permitted and prohibited AI use;
- export, archive, ownership, and exit rights;
- benefit sharing, payment, or honoraria;
- local-language names for roles and access states;
- what must never be uploaded or digitised.

The [CARE Principles](https://www.gida-global.org/careprinciples) emphasise collective benefit, authority to control, responsibility, and ethics. They should shape the governance process, but cannot replace the community's own decisions.

### Protocol-based access

Replace a universal three-level model with community-configured protocols such as:

- public;
- registered learners;
- verified community members;
- family or kin group;
- named circle;
- cultural-authority group;
- seasonal or embargoed;
- sacred or never digitise.

Audio, transcript, image, translation, teaching derivative, and download may each need different permissions. The strictest applicable protocol should flow to all previews and derivatives.

### Versioned consent receipt

A consent receipt should identify participants, purposes, audience, expiry, attribution, restrictions, and how withdrawal works. It should support text, audio, witnessed, assisted, guardian, and child-assent forms.

AI training, voice synthesis, commercial use, download, and derivative creation should default to no.

### Publication lifecycle

```text
private draft
  -> rights evidence
  -> linguistic review
  -> cultural-authority review
  -> accessibility and metadata check
  -> dual or council approval
  -> server-created publication
```

Every decision should be an immutable event. Open publication should never be a field a normal client can set directly.

## Target technical architecture

```text
Next.js PWA
  |
  +-- Public cache
  |     App shell, approved-open packs, low-bandwidth media
  |
  +-- Encrypted local vault in IndexedDB
  |     Private notes, recordings, PII, consent evidence, revisions
  |
  +-- Sync outbox
        Idempotent operations, resumable uploads, conflicts, visible status
          |
          +-- Firebase Auth and App Check
          +-- Firestore private and community records
          +-- Cloud Storage originals and derivatives
          +-- Trusted backend publication and revocation functions
```

Important boundaries:

- Keep harmless preferences in `localStorage`; move feature records and audio to IndexedDB.
- Save audio locally as chunks arrive, before attempting upload.
- Preserve original media, access copies, checksums, duration, format, and derivatives.
- Make contribution revisions immutable.
- Create public records only through trusted backend code after approval.
- Provide explicit states: Only on this device, Queued, Synced privately, In review, Published.
- Cache only approved-open material.
- Build accountless local use first, then explicit backup and sync.
- Support encrypted export and tested restore.
- Implement takedown propagation across publications, packs, caches, and exports.
- Use Unicode-safe stable identifiers and language-tagged values.

Recommended backend domains:

- `languages`
- `communities`
- `memberships`
- `communityCharters`
- `vaultItems`
- `mediaAssets`
- `mediaSegments`
- `consentGrants`
- `sources`
- `attestations`
- `contributions/{id}/revisions`
- `reviews`
- `reviewEvents`
- `publications`
- `takedowns`
- `learningObjects`
- `skillStates`
- `reviewEvents`
- `missions`
- `speakerRequests`
- `speakerResponses`

## Accessibility and safeguarding

### Accessibility priorities

- English, Bahasa Malaysia, and community-language interface options.
- Correct `lang` tags on words, phrases, and translations.
- Elder mode with larger text, larger controls, audio instructions, and less metadata.
- Captions, editable transcripts, playback speed, repeat, and slow audio.
- Text alternatives for waveforms.
- Live-region announcements for save, sync, and error messages.
- Focus trap and focus return for the mobile drawer.
- Reduced-motion support.
- Diacritic and script-friendly input.
- Low-bandwidth and offline modes with visible storage status.
- Shared-device "leave no trace" mode.
- WCAG 2.2 AA testing with elders and disabled community members.

### Safeguarding priorities

- No direct messages, follower graph, public minor profiles, or precise public locations in the first pilot.
- Minor contributions restricted by default with guardian consent and child assent.
- A named safeguarding lead and report, block, escalation, and incident process.
- Assisted consent must never allow a helper to override the speaker.
- Deceased persons, trauma, contested ownership, medicinal knowledge, genealogy, sacred content, and third-party mentions require dedicated protocol review.

## Phased delivery plan

### Phase 0: Community contract and domain model, 4 to 8 weeks

Goals:

- form a paid Kristang pilot council;
- agree the charter, names, access protocols, review roles, consent purposes, AI policy, withdrawal, and success measures;
- identify what must never be online;
- verify or clearly relabel all seed content;
- separate learning progress from contribution progress;
- threat-model shared devices, minors, sensitive content, and uploads.

Exit gate: a ratified community charter and testable rights model.

### Phase 1: Honest single-device, audio-first MVP, 8 to 12 weeks

Build:

- real record, playback, retake, and local persistence;
- IndexedDB private vault;
- one complete audio-rich Kristang pathway;
- a real Today due queue;
- connected Saved, Practice, and Today states;
- mobile-first Today, Learn, Capture, and Library;
- local export and restore;
- repaired service worker and true offline operation;
- removal of simulated upload and publication claims.

Exit gate: after one initial load, a learner can use Kambradu offline for seven days, record audio, close and reopen, export, restore, and lose nothing.

### Phase 2: Private sync and Family Relay, 8 to 12 weeks

Build:

- real authentication and role separation;
- private multi-device sync;
- resumable media upload;
- speaker request and no-account response links;
- versioned consent receipts;
- 20 to 30 audio-rich daily-life missions;
- multilingual and elder modes;
- account deletion and shared-device privacy controls.

Exit gate: learner-speaker pairs can complete reciprocal private exchanges without exposing one user's data to another.

### Phase 3: Governed contribution and publication, 8 to 12 weeks

Build:

- immutable revisions;
- evidence-rich review packets;
- linguistic and cultural review roles;
- dual approval for open content;
- partial approval and access restriction;
- audit events, corrections, appeals, and takedown;
- server-created public projections;
- reviewed contributions becoming new learning objects;
- community export and backup.

Exit gate: no client can make content public directly, and a withdrawal drill removes access from live surfaces, packs, and caches.

### Phase 4: Closed Kristang pilot, 8 to 12 weeks

Suggested cohort:

- 20 to 40 learner-family pairs;
- 6 to 10 speakers;
- 2 to 4 trained stewards;
- local and diaspora participation;
- one weekly real-world mission;
- optional in-person recording and support sessions;
- interviews at weeks 1, 4, and 8.

Pilot gates:

- zero self-approval;
- verified rights on every real item;
- dual approval for open publication;
- successful withdrawal and cache-purge drill;
- community export and termination test;
- no critical authentication or security-rules findings;
- shared-device privacy test;
- elder and disabled-user task success;
- a completed safeguarding incident exercise;
- sustainable steward queue and speaker burden.

### Phase 5: Second-community scalability proof

Only after the Kristang loop works:

- partner with one linguistically and culturally different community;
- let that community select its own decision-makers;
- configure names, roles, scripts, variants, access, and governance without forking code;
- treat every mismatch as product learning.

Do not launch a self-service "add a language" feature.

### Phase 6: Community-owned federation

- sovereign but interoperable community spaces;
- community-specific branding and policy;
- archive and export standards;
- optional public discovery and place experiences;
- training for language champions;
- carefully bounded, opt-in, human-reviewed AI only where explicitly authorised.

## First 12 product epics

1. Community charter, terminology, and content-verification process.
2. Public-access filtering and honest prototype labels.
3. Separate learning state from contribution state.
4. Real local audio capture, playback, persistence, and cleanup.
5. Encrypted or strongly protected IndexedDB vault with export and restore.
6. One complete audio-rich "Shop visit" pathway with task evidence.
7. Connected Today, due queue, Saved, and Practice states.
8. Mobile-first learner shell with central Capture.
9. Family Relay request and speaker response.
10. Structured, versioned consent and protocol access.
11. Role-enforced, evidence-rich Steward Studio and trusted publication.
12. Living Memory Cards and content lineage into future learning.

## Success measures

### Learning

- 7-, 30-, and 90-day audio recognition.
- Delayed spoken production.
- Understanding across speakers or contexts.
- Short dialogue and retell performance.
- Learner-selected can-do outcomes.
- Before-and-after speech samples using a community-designed rubric.

### Relationships and revitalisation

- Meaningful language-use missions completed.
- Reciprocal learner-speaker exchanges.
- Active learner-speaker pairs.
- Speaker response rate and burden.
- Returning families and stewards.
- New domains of real language use.
- Approved audio and story minutes.
- Representation across families, places, generations, and variants.
- Proportion of community contributions reused in learning.

### Trust

- Rights evidence complete before review.
- Consent comprehension.
- Review turnaround and changes requested.
- Withdrawals fulfilled within the promised time.
- Number and severity of access incidents.
- Community ability to export, migrate, and terminate its space.

Do not use streak length, raw word count, uploads, screen time, or publication volume as the primary definition of success.

## Product anti-goals

Kambradu should not become:

- a Duolingo clone with endangered-language content;
- an archive that stores voices but does not produce new use;
- a public-by-default corpus;
- a free dataset for generative AI training;
- a crowdsourced dictionary without accountable stewardship;
- a social feed optimised for attention and virality;
- a spelling-enforcement tool that erases family and regional variants;
- an app that requires elders to become software power users;
- an all-languages platform before one community succeeds;
- a replacement for families, speakers, teachers, or community organisations;
- a heavy video product that excludes low-bandwidth users;
- a dashboard that mistakes uploads or screen time for revitalisation;
- a platform that claims to save a language on behalf of its speakers.

## Immediate recommendation

Do not begin by wiring every existing local object directly to Firestore. That would harden prototype assumptions in the most sensitive part of the product.

Begin with three moves:

1. Form the Kristang pilot council and agree the governance contract.
2. Build one honest, complete, offline audio-learning loop around a real speaker and real consent.
3. Re-centre the learner experience on "Who will you use this with?"

The current consent, access, and review concepts should be preserved. The current operational visual language should become the Steward Studio. The learner side should shift toward voices, people, place, memory, and one small daily act of use.

That is the version of Kambradu that can become more than an app: infrastructure for living transmission.

## Evidence and research base

This audit combined:

- visual and text review of all 15 slides of `Kambradu (V1.2).pdf`;
- code and documentation review of the current repository;
- live desktop and 390 x 844 mobile inspection;
- type-check and production build verification;
- specialist reviews in product strategy, UX/UI, documentary linguistics, Malaysian cultural history, language-learning science, community governance and safeguarding, and offline/privacy architecture.

External anchors:

- [UNESCO Language Vitality and Endangerment](https://ich.unesco.org/doc/src/00120-EN.pdf): intergenerational transmission, domains of use, new media, community attitudes, and documentation quality matter more than word counts.
- [Global Indigenous Data Alliance CARE Principles](https://www.gida-global.org/careprinciples): collective benefit, authority to control, responsibility, and ethics.
- [Kodrah Kristang terminology guidance](https://kodrah.kristang.com/terminology/): community-led naming and the limits of Melaka- or Portugal-centred labels.
- [Kodrah Kristang: About the People and Language](https://kodrah.kristang.com/about-kristang/): community description, locations, language, and revitalisation activity.
- [FirstVoices](https://www.firstvoices.com/about): a useful example of technology paired with language educators, elders, youth, language champions, and community planning.
- [Local Contexts Labels](https://localcontexts.org/labels/about-the-labels/): models for community-specific cultural protocols and provenance.
- [Mukurtu cultural protocols](https://mukurtu.org/support/traditional-knowledge-labels-faq/): useful reference for protocol-aware digital heritage access.

These frameworks are references, not substitutes for direct authority from the relevant Malaysian communities.
