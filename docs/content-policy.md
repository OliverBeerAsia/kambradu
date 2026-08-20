# Content policy

## Two tiers of content

The gate that matters is not how many words there are. It is what is being claimed about them.

**Tier A, dictionary-attested reference.** A form copied from Baxter and de Silva, with the printed page, the name of the person who checked it, and `speaker_attested: false`. Collocations and example sentences may be included when they are copied from the source with a page. The interface says "Checked against the dictionary" and never "approved". This tier rests on a licence, CC BY-SA 4.0, which the source already grants. **It does not require a community partnership and may grow.**

**Tier B, community-endorsed teaching material.** Contemporary usage guidance, preferred forms, pronunciation, speaker recordings, stories, learner contributions, publication, and anything presented as how people speak today. **This tier requires a named community relationship and agreed rules, and remains closed.**

Applying the Tier B gate to Tier A material was a category error that held the public prototype at two words. Applying the Tier A standard to Tier B material would be far worse, and must not happen.

## Current public boundary

The public lexicon contains Tier A entries only. Each entry has an exact dictionary locator with a printed page number, a transcription checking record, source attribution, licence, a named spelling system, and an evidence record. There is no public pronunciation respelling, recording, story or learner contribution.

Composed example sentences are not permitted. An example without a source page is rejected by `scripts/seed-firestore.mjs`.

## Evidence model

Evidence fields are independent booleans:

- `source_transcribed`: the form was copied from the named source.
- `source_checked`: the transcription and locator were checked against that source.
- `speaker_attested`: a named speaker has attested the form or use.
- `partner_reviewed`: a named partner review process has checked it.
- `public_use_allowed`: available evidence and rights allow this prototype use.

For every current entry:

- `source_transcribed`: true
- `source_checked`: true
- `speaker_attested`: false
- `partner_reviewed`: false
- `public_use_allowed`: true

The word “approved” must not be inferred from these fields.

## Source records

Every source-derived item needs:

- title and authors;
- publisher and date where available;
- stable URL, DOI or archive record;
- exact locator;
- licence or permission basis;
- transcription and checking record.

## Stress marking

Stress is part of the printed entry, not an analysis of it. The dictionary underlines the
stressed syllable and marks stress on a final vowel with an unpronounced final `h`.

- A `stress` span is recorded only by reading the printed page for that headword. It is
  never derived from the general stress rules alone, never from the plain-text extraction,
  and never by analogy with Portuguese.
- The span is stored as character offsets into the headword and must fall inside it.
  `scripts/validate-seed.mjs` rejects any span that does not.
- Where the source leaves a word unmarked, including every monosyllable, the app shows no
  mark. An absent mark is a fact about the source, not a gap to fill.
- The interface draws the underline the source draws. It does not add a respelling, a
  phonetic transcription or an audio claim, all of which remain Tier B.

## Personal memories

Learner memories are not public language content. They remain in the current browser unless the learner exports a backup. They must not be uploaded, indexed, used as teaching material or treated as evidence.

## New material

Do not add a new teaching item until a named reviewer can verify:

- contemporary use;
- preferred form and meaningful variation;
- lesson suitability;
- public-use permission.

Recordings additionally require speaker consent, access limits, withdrawal and deletion rules.

## Seed safety

The public seed contains the same two traced entries and no stories. The historical `loja`, `balcao` or `balkau` and sample-sentence seed is under `scripts/seeds/quarantine/` and must not be deployed. The seed script rejects quarantine paths, unsupported fields and missing evidence.
