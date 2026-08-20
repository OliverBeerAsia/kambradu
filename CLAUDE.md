# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

It has two parts. **Founding intent** is the long-term vision and does not change with
a milestone. **Current milestone** is what is actually true of the code today. When the
two disagree, the current milestone governs what you build, and the founding intent
governs what you build toward. `docs/product-principles.md` is the binding copy and
interaction contract.

---

## Part 1: Founding intent

**Kambradu** helps learners of endangered languages document their learning journey and
build proficiency. The initial focus is Kristang (Malacca Creole Portuguese), with the
longer-term vision of other Malaysian endangered languages. `kambradu` is Kristang for
*friend* (Baxter and de Silva, page 44).

### Mission

Making it easier to learn endangered languages by providing tools for self-directed
learning, progress tracking, and community connection - especially for languages that
lack traditional learning resources, native speakers nearby, or cultural assets like
films and books.

### Core philosophy

- **Bottom-Up Learning**: Empowering individual learners to document vocabulary, sentences, recipes, songs, and cultural knowledge
- **Emotional Connection**: Learning is emotionally satisfying when you document your heritage
- **Accessibility**: reaching people across devices and socio-economic situations
- **Gentle UX**: Friendly, encouraging interface appealing to all ages

### Variation is the normal state

Kambradu is built for endangered and indigenous languages, and most of them have no
agreed written standard. Some have several competing ones, some have none at all, and
in many the spelling a person uses is part of where they are from and who taught them.

This is a founding design constraint, not an edge case to handle later.

- **Never require a standard to exist.** No code path may assume there is one correct
  spelling, one authoritative source, or one canonical form to fall back on.
- **Variation is valid data, never an error.** Several forms for one word is the expected
  state. Validation checks that a form is attested and says what kind of difference it is;
  it never checks a form against a preferred one.
- **Never rank forms.** Nothing in the data or the interface may call a form correct,
  proper, standard, official, wrong or a misspelling. `scripts/validate-seed.mjs` rejects
  variant notes that do, and `tests/public-smoke.spec.ts` rejects the words on screen.
- **Separate a different spelling from a different form.** Same sound written differently
  is one word. A different sound is a different form, tied to who is speaking, and must not
  be collapsed into the first.
- **Name the tradition, not the winner.** Every form records which tradition it belongs to.
  Traditions are declared per community and referred to by string id, so a new language
  declares its own without anyone editing a shared union.
- **Keep language specifics out of shared code.** The language tag lives in
  `src/lib/language.ts`, never as a literal in a component. Guards take a community's
  declared traditions as an argument rather than naming one.

Kambradu must never become a spelling-enforcement tool. Being corrected on how you write
your own language is a common part of why people stop writing it at all.

### Language learning principles embedded

Based on "Multi Track Attack" and "All Japanese All The Time" methodologies:

- **Immersion**: Encourage daily interaction with the language
- **Comprehensible Input**: Start with basic phrases, build progressively
- **Positive Reinforcement**: Gentle UX, celebration of progress, no punishment for breaks
- **Habit Formation**: gentle rhythm and returnability
- **Personalization**: Learner builds their own content library
- **Audio-First**: Recording and playback central to oral language traditions

The founding question, from a 2013 visit to Melaka, is the test for any learner feature:
*I had found a Kristang greeting, but who could I say it to?*

---

## Part 2: Current milestone

What is true of the code right now. Do not describe the product to a user in terms of
Part 1 that Part 2 contradicts.

- **Web, not an installed app.** There is no service worker and no web manifest. Offline
  use is not supported. Treat any PWA reference in older documents as out of date.
- **Static files, no server.** The site builds with `output: "export"` to plain HTML, CSS
  and JavaScript. Nothing runs server-side, because nothing needs to: the words are bundled
  at build time and everything a learner creates stays in their browser. This is why there
  is no middleware and no dynamic route. A consequence worth remembering: a page that ships
  is public, so anything that should not be public has to be absent from the build rather
  than gated at request time.
- **No streaks, points, leaderboards or loss warnings.** `docs/product-principles.md`
  forbids them. "Habit Formation" above means a gentle rhythm, not streak tracking.
- **No accounts, no sync, no uploads, no sharing.** Everything a learner creates lives in
  their own browser and can be exported.
- **Two languages.** Kristang is the reason the project exists and is the default.
  Malay sits beside it as a bridge: it is what Kristang's spelling is built on, and most
  learners here already read it. Malay is *not* endangered, and the interface says so on
  the chooser rather than implying the two carry the same urgency. Kambradu is not the
  right place to preserve Malay, and no effort goes into it beyond serving Kristang.
- **Malay words are transcribed, not checked.** They come from Wiktionary with a per-entry
  address and are marked `source_checked: false`, so the content guard refuses to seed
  them. That is the guard working, not a bug to route around.
- **Audio.** There is no community or speaker audio, and adding any is gated on a named
  community relationship. A learner recording their *own* voice privately is a different
  thing and is not gated, because it involves nobody else's consent.

### Two tiers of language content

This distinction matters more than any other rule in the repository.

- **Tier A, dictionary-attested reference.** Copied from Baxter and de Silva with an exact
  page, checked by a named person, and carrying `speaker_attested: false`. The interface
  says "Checked against the dictionary" and never "approved". This tier needs a licence,
  which exists (CC BY-SA 4.0), not a community partnership. It can grow.
- **Tier B, community-endorsed teaching material.** Contemporary usage guidance,
  pronunciation, speaker audio, publication, anything presented as how people speak
  today. Gated on a named community relationship. Do not build it yet.

**Never invent Kristang.** A previous build shipped `loja` for "shop" and the sentence
"Nha mae bai loja kompra sabang". Neither `loja` nor `nha` occurs anywhere in the cited
dictionary; the attested forms are `butika` and `yo sa`. Generating creole content by
analogy with Portuguese is the specific failure mode to avoid. If a form is not in the
source with a page number, it does not go in. See `scripts/seeds/quarantine/`.

Use `node scripts/lookup-dictionary.mjs <layout.txt> <headword>` to check a form against
the source before adding it.

## Kristang-specific context

- Kristang is a Portuguese-Malay creole spoken in Melaka, Malaysia
- Critically endangered with ~1000 speakers
- Primarily oral tradition, limited written resources
- Reference dictionary available (see `kristang dictionary.pdf`); it is a local reference only and must not be deployed
- Community-driven revitalization efforts ongoing
- Cultural connection through food, songs, family stories
- **Stress is marked, and transcribed rather than inferred.** Baxter and de Silva
  underline the *stressed syllable* in each main entry, and an unpronounced final `h`
  marks stress on a final vowel (Introduction, sections 4 and 5). Their general rules are
  A: words ending in a vowel stress the penultimate syllable; B: words ending in a
  consonant stress the final syllable. The rules predict most words but not all, so a
  `stress` span is only ever recorded by reading the printed page. OCR destroys exactly
  this information, because the underline sits under the characters it corrupts.
  Monosyllables carry no mark in the source and carry none here.
- **Spelling systems compete, and Baxter is the current one.** Kristang never acquired a
  standard written form accepted across its communities. Baxter and de Silva use a
  Malay-based orthography where a final `h` marks final-syllable stress (`papiah`); other
  community materials differ, notably Marbeck (`kacoru` for Baxter's `kachoru`). The
  Kodrah Kristang revitalisation initiative in Singapore, and the Pinchah Kristang
  dictionary, work in the Baxter orthography, so citing Baxter is also current practice
  rather than a historical choice. Every entry names its `orthography`, and variants sit
  beside each other rather than one being marked correct. Kambradu must not become a
  spelling-enforcement tool.
- **Separate a different spelling from a different form.** Variants that sound the same and
  differ only in spelling (`kachoru`/`kacoru`) are one word. Variants that reorder
  consonants and so sound different (`porta`/`potra`, `kandri`/`karni`, `ebra`/`erba`) are
  different forms tied to who is speaking, and must not be collapsed into one. This is the
  line Pinchah Kristang draws, on the grounds that standardising sound would make a
  stronger claim over the language than standardising spelling does.
- All Kristang text carries `lang="mcm"`.

## Important notes

- This is a passion project with deep cultural significance
- Performance matters: many users may have older devices or slower connections
- Privacy is paramount: user learning data is personal and sensitive
- Audio quality is important for oral language preservation
- The goal is language revitalization, not just an app - community impact is the measure of success
- Kambradu is infrastructure, not a cultural authority, and does not claim that technology can save a language

## Resources

- Vision document: `Kambradu (V1.2).pdf`
- Kristang reference: `kristang dictionary.pdf`
- Language learning methodology: Multi Track Attack (Barry Farber), AJATT (Khatzumoto)
- Binding product and copy contract: `docs/product-principles.md`. Its no-machine-filler
  word list, brand rules, heading depth and text-size floor are enforced by
  `tests/public-smoke.spec.ts`; the content boundary is enforced by
  `scripts/validate-seed.mjs` and `tests/validate-seed.test.mjs`.
- Content rules and evidence fields: `docs/content-policy.md`
