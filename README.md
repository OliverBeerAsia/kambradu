# Kambradu

**Learn the language. Keep what matters.**

`Kambradu` means friend in Kristang. The name appears in Alan N. Baxter and Patrick de Silva's *A Dictionary of Kristang (Malacca Creole Portuguese)*.

Kambradu is a language-learning and memory platform. It helps someone learn through words, people, places and everyday experiences, then keep the notes and memories that make the language meaningful.

The current prototype begins with Kristang.

## Why Kambradu exists

The idea grew from my own attempts to learn Kristang and a visit to Melaka in 2013. I had found a greeting, but I still had a basic problem: who could I say it to?

Learning any language is difficult. It becomes harder when speakers are far away, learning material is scarce or mainly academic, and words are separated from the people and situations that give them meaning.

Kambradu explores a simple idea: learning and documenting a language can be part of the same journey.

A learner might begin with a word, then keep a correction, an expression, a recipe, a song, a photograph, a story or a memory. Together, they connect language learning with everyday life.

## The two parts of Kambradu

Kambradu brings together personal learning and trusted language resources.

### Personal learning and memory

- a journal for words, stories, recipes, songs and reflections;
- a personal lexicon that grows through learning;
- simple practice and learning support;
- recordings and photographs, once storage, consent and deletion are properly designed;
- progress that does not depend on streaks or penalties.

### Trusted learning resources

- short lessons using words, audio and video;
- searchable dictionaries and language resources;
- stories, music, films and contemporary cultural material;
- different speakers, family forms and writing conventions;
- material reviewed under rules set with the relevant community.

The long-term purpose is to connect these two parts responsibly. Something kept for yourself may later be shared, but only when the people involved choose to share it and an appropriate community review process exists.

## The learning rhythm

The main Kambradu rhythm is:

`Meet -> Try -> Connect -> Keep`

- **Meet:** encounter a traced word, phrase, voice or story.
- **Try:** practise without compulsory speaking or accent scoring.
- **Connect:** place the language in a real situation or personal context.
- **Keep:** save the word, note or memory on your device.

Sharing is separate and optional. Learning never depends on publishing cultural knowledge.

## Product principles

### Clear adult language

Kambradu uses clear adult language, manageable choices and one meaningful action at a time. Simplicity should remove friction without talking down to anyone.

The experience avoids guilt after an absence, compulsory speaking, accent scores, childish praise, upload rewards and leaderboards built around cultural contributions.

### Language lives with people

Dictionaries and lessons matter, but language also lives in relationships, neighbourhoods, kitchens, journeys, work, humour, music and contemporary life.

### Keep first, share separately

Personal notes start on the learner's device. Sharing should always be a separate choice with a clear audience, purpose and route for withdrawal.

### Community authority

Kambradu is infrastructure, not a cultural authority. Communities should determine their preferred names, language varieties, review processes, access rules and appropriate uses.

The platform should make room for family and regional variation rather than forcing one spelling or pronunciation.

### Honest evidence

A dictionary entry, a reviewed recording and a learner's note are different kinds of evidence. Kambradu should show where material came from, what has been checked and what remains uncertain.

Missing audio must not look playable. Test material must not look community-approved.

## What works now

Kambradu is currently an independent interaction prototype.

Implemented:

- a simple Today screen with one clear next step;
- one-screen-at-a-time Kristang practice;
- an equally visible route through practice without speaking;
- My Memories, combining saved words, notes and personal word entries;
- memory capture with one question per screen;
- a small Explore collection containing traced dictionary-listed forms;
- responsive desktop and mobile layouts;
- keyboard, focus and screen-reader improvements;
- local demonstrations of the journal, personal lexicon and learning cycle;
- Firebase-oriented schemas, rules and emulator scaffolding.

The main navigation has four destinations:

1. **Today:** begin or return to practice.
2. **Learn:** find lessons and learning resources.
3. **Memories:** keep words, notes and personal context.
4. **Explore:** browse traced reference material.

## Prototype limits

This repository is not ready to hold sensitive or irreplaceable community material.

At present:

- learner records use browser `localStorage`;
- other people using the same browser profile may be able to see them;
- real account authentication and community roles are not operational;
- recording, durable playback, upload and deletion are not implemented;
- community review is a design direction, not operational governance;
- consent is not yet a complete, revocable permission record;
- offline and installed-app behaviour are not production-ready;
- sharing and steward routes remain closed in production.

Do not enter confidential family material, sacred knowledge, sensitive locations or irreplaceable recordings into this prototype.

Kambradu is not yet governed, endorsed or linguistically approved by a Kristang community body. Public teaching material beyond traced reference entries will require named community partnership, permission and review.

## What Kambradu should not become

Kambradu should not become:

- a public-by-default cultural corpus;
- a source of training data for AI systems;
- an accent-ranking or spelling-enforcement tool;
- a system that rewards people for uploading community knowledge;
- an app that treats one person, family or city as the whole language;
- a claim that technology can "save" a language on behalf of its speakers.

The aim is to help people learn, teach and create in their languages under governance defined by their speakers.

## Local development

Requirements:

- Node.js 22
- npm

Install and start the app:

```bash
npm install
npm run dev
```

For the current local QA port:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3217
```

The demo sign-in exists only for local tests of the closed contribution and review routes. It is disabled unless both flags are explicitly enabled:

```bash
KAMBRADU_DEMO_AUTH_ENABLED=true NEXT_PUBLIC_KAMBRADU_DEMO_AUTH_ENABLED=true npm run dev -- --hostname 127.0.0.1 --port 3217
```

Keep these flags unset or `false` outside local testing.

## Verification

```bash
npm run type-check
npm run build
npm run test:smoke
```

The smoke suite covers desktop and mobile Chromium.

## Firebase

The repository includes Firebase-oriented Auth, Firestore, Storage and Hosting scaffolding. These services are not required for the device-local learning experience.

Copy `.env.example` to `.env.local` when working with a real Firebase project. For emulator work:

```bash
npm run firebase:emulators
```

Only seed material that has a traceable source, compatible licence, appropriate access level and recorded review state:

```bash
FIREBASE_PROJECT_ID=demo-kambradu npm run seed:firestore -- scripts/seeds/kristang-curated-sample.json
```

Never commit service-account files, raw source PDFs or bulk dictionary extracts.

## Source and content responsibility

The current reference entries cite:

- Alan N. Baxter and Patrick de Silva
- *A Dictionary of Kristang (Malacca Creole Portuguese)*
- Pacific Linguistics, The Australian National University
- 2005, online edition 2015
- DOI: [10.15144/PL-564.cover](https://doi.org/10.15144/PL-564.cover)
- online edition licence: CC BY-SA 4.0

Code and language content have different rights. See [docs/content-policy.md](docs/content-policy.md).

## License

The application code is MIT licensed. Language content, recordings, photographs and personal contributions require their own source, access, consent and licence records.
