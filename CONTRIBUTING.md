# Contributing

Kambradu accepts code, documentation, and curated content workflow improvements.

## Development

1. Install dependencies with `npm install`.
2. Run `npm run dev`.
3. Verify with `npm run type-check`, `npm run build`, and `npm run test:smoke -- --project=chromium`.

## Content Contributions

- Do not commit source PDFs, raw OCR, bulk dictionary extraction, private recordings, or consent records.
- Use curated JSON or Firestore writes that include attribution, source, license, review status, access level, and consent/provenance fields.
- User-submitted material must enter `draft` or `submitted` review status. Only stewards can approve publication.
- Restricted or community-only material must not be indexed or cached as public content.

## Pull Requests

- Keep changes scoped and explain any Firestore or Storage rule impact.
- Include screenshots for visible UI changes.
- Add or update tests for routing, contribution validation, review behavior, or rules changes.
