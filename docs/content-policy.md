# Content policy

## Current public boundary

The public prototype contains two Kristang entries: `sabang` and `janela`.

Each entry has an exact dictionary locator, source attribution, licence and evidence record. There is no public pronunciation, example sentence, recording, story or learner contribution.

## Evidence model

Evidence fields are independent booleans:

- `source_transcribed`: the form was copied from the named source.
- `source_checked`: the transcription and locator were checked against that source.
- `speaker_attested`: a named speaker has attested the form or use.
- `partner_reviewed`: a named partner review process has checked it.
- `public_use_allowed`: available evidence and rights allow this prototype use.

For the current entries:

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
