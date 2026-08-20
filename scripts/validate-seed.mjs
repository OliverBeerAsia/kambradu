/**
 * The content boundary for anything that leaves this repository.
 *
 * These checks are the code form of docs/content-policy.md. They live apart
 * from scripts/seed-firestore.mjs so they can be run without Firebase
 * credentials, which is what makes them testable rather than merely present.
 */

/**
 * Throws if a lexical entry is outside the current publishable boundary.
 *
 * `known` is the set of spelling traditions the community has declared. Passing
 * it in, rather than naming one here, is what lets a second language use these
 * checks without editing them.
 */
export function validateSeedEntry(entry, known) {
  if (!(known instanceof Set) || known.size === 0) {
    throw new Error("Checking an entry needs the set of spelling traditions its community declares.");
  }

  if (!entry.id) {
    throw new Error("Every lexical entry needs an id");
  }

  if (
    !entry.source?.locator ||
    entry.evidence?.source_checked !== true ||
    entry.evidence?.public_use_allowed !== true
  ) {
    throw new Error(`Entry ${entry.id} needs an exact source locator and public source-checked evidence.`);
  }

  if (!Number.isInteger(entry.source.page) || !entry.source.checkedBy || !entry.source.checkedAt) {
    throw new Error(`Entry ${entry.id} needs a printed page number and a transcription checking record.`);
  }

  if (typeof entry.orthography !== "string" || !known.has(entry.orthography)) {
    throw new Error(`Entry ${entry.id} must name a spelling system its community has declared.`);
  }

  // Variation is normal in a language with no agreed written standard, so many
  // variants are never an error. What is required is that each one says what
  // kind of difference it is, because a different spelling and a different form
  // are not the same claim, and that none of them is presented as the correct one.
  for (const variant of entry.variants ?? []) {
    if (!variant.form || typeof variant.form !== "string") {
      throw new Error(`Entry ${entry.id} has a variant with no form.`);
    }
    if (!known.has(variant.orthography)) {
      throw new Error(`Entry ${entry.id} has a variant in an undeclared spelling system.`);
    }
    if (variant.kind !== "spelling" && variant.kind !== "form") {
      throw new Error(`Entry ${entry.id} has a variant that does not say whether it differs in spelling or in form.`);
    }
    if (variant.form === entry.headword) {
      throw new Error(`Entry ${entry.id} lists its own headword as a variant.`);
    }
    if (/\b(correct|proper|standard|official|wrong|incorrect)\b/i.test(variant.note ?? "")) {
      throw new Error(`Entry ${entry.id} ranks a variant against the headword. No form is the correct one.`);
    }
  }

  // Approval claims, invented pronunciation respellings and audio stay out.
  if (entry.reviewStatus || entry.pronunciation || entry.hasAudio) {
    throw new Error(`Entry ${entry.id} contains fields outside the text-only public prototype boundary.`);
  }

  // Example sentences are allowed only when copied from the source with a page.
  // A composed sentence has no page, which is what separates the two.
  for (const example of entry.examples ?? []) {
    if (!example.text || !example.translation || !Number.isInteger(example.page)) {
      throw new Error(`Entry ${entry.id} has an example without a source page. Composed examples are not seedable.`);
    }
  }

  // Stress is transcribed from the printed underline, so the span must fall
  // inside the headword. A span that does not is a guess rather than a reading.
  if (entry.stress !== undefined) {
    const { start, end } = entry.stress ?? {};
    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 0 ||
      end <= start ||
      end > (entry.headword?.length ?? 0)
    ) {
      throw new Error(`Entry ${entry.id} has a stress span that is not inside its headword.`);
    }
  }

  if (entry.example || entry.exampleTranslation) {
    throw new Error(`Entry ${entry.id} uses the old unsourced example fields. Use examples[] with a page.`);
  }
}

/** Throws if a whole seed payload is outside the boundary. */
export function validateSeedPayload(payload, seedPath = "") {
  if (seedPath.includes("quarantine")) {
    throw new Error("Quarantined seed files must never be deployed.");
  }

  if (!payload.community?.id) {
    throw new Error("Seed file must include community.id");
  }

  const known = new Set(Object.keys(payload.orthographies ?? {}));
  if (known.size === 0) {
    throw new Error("Seed file must declare the spelling traditions its entries are written in.");
  }

  for (const entry of payload.lexicalEntries ?? []) {
    validateSeedEntry(entry, known);
  }

  // Stories carry voice, authorship and consent, so they stay behind the
  // partnership gate.
  if ((payload.stories ?? []).length > 0) {
    throw new Error("Stories are not seedable in the current public prototype.");
  }
}
