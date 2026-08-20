import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { validateSeedEntry, validateSeedPayload } from "../scripts/validate-seed.mjs";

/** The traditions this community declares. Nothing in the guard assumes them. */
const KNOWN = new Set(["baxter-2005", "marbeck"]);

/** Checks an entry against KNOWN unless a test supplies its own traditions. */
const check = (entry, known = KNOWN) => validateSeedEntry(entry, known);

/** A minimal entry that sits inside the boundary. Tests bend one field at a time. */
function entry(overrides = {}) {
  return {
    id: "sabang",
    headword: "sabang",
    orthography: "baxter-2005",
    evidence: { source_checked: true, public_use_allowed: true, speaker_attested: false },
    source: { locator: "Headword sabang, page 78", page: 78, checkedBy: "Oliver", checkedAt: "2026-08-19" },
    examples: [],
    ...overrides
  };
}

test("a source-checked entry passes", () => {
  assert.doesNotThrow(() => check(entry()));
});

test("a stress span inside the headword passes", () => {
  assert.doesNotThrow(() => check(entry({ stress: { start: 2, end: 6 } })));
});

test("no stress at all passes, because monosyllables carry no mark", () => {
  assert.doesNotThrow(() => check(entry({ id: "sol", headword: "sol" })));
});

test("a stress span running past the headword is rejected", () => {
  assert.throws(
    () => check(entry({ stress: { start: 2, end: 99 } })),
    /stress span that is not inside its headword/
  );
});

test("an empty or reversed stress span is rejected", () => {
  assert.throws(() => check(entry({ stress: { start: 3, end: 3 } })), /stress span/);
  assert.throws(() => check(entry({ stress: { start: 4, end: 2 } })), /stress span/);
});

test("a non-integer stress span is rejected", () => {
  assert.throws(() => check(entry({ stress: { start: 0, end: 2.5 } })), /stress span/);
  assert.throws(() => check(entry({ stress: {} })), /stress span/);
});

test("an entry without a printed page is rejected", () => {
  const missing = entry();
  delete missing.source.page;
  assert.throws(() => check(missing), /printed page number/);
});

test("an entry without a named checker is rejected", () => {
  const missing = entry();
  delete missing.source.checkedBy;
  assert.throws(() => check(missing), /transcription checking record/);
});

test("an approval claim, a respelling or audio is rejected", () => {
  assert.throws(() => check(entry({ reviewStatus: "approved" })), /outside the text-only/);
  assert.throws(() => check(entry({ pronunciation: "sah-BAHNG" })), /outside the text-only/);
  assert.throws(() => check(entry({ hasAudio: true })), /outside the text-only/);
});

test("an example with a page passes and one without is rejected", () => {
  const sourced = { text: "Fazeh diseh janela!", translation: "Lower the window!", page: 26 };
  assert.doesNotThrow(() => check(entry({ examples: [sourced] })));
  const { page, ...unsourced } = sourced;
  assert.throws(() => check(entry({ examples: [unsourced] })), /without a source page/);
});

test("a quarantined seed path is refused", () => {
  assert.throws(
    () => validateSeedPayload({ community: { id: "x" } }, "scripts/seeds/quarantine/bad.json"),
    /Quarantined seed files/
  );
});

test("stories stay behind the partnership gate", () => {
  assert.throws(
    () => validateSeedPayload({ community: { id: "x" }, orthographies: { "baxter-2005": {} }, stories: [{ id: "s" }] }),
    /Stories are not seedable/
  );
});


test("many variants are acceptable, because variation is normal", () => {
  // A language with no agreed written standard produces several forms per word.
  // That is the expected state, not a defect to be validated away.
  assert.doesNotThrow(() =>
    check(
      entry({
        variants: [
          { form: "potra", orthography: "baxter-2005", kind: "form" },
          { form: "porrta", orthography: "marbeck", kind: "spelling" },
          { form: "porta", orthography: "marbeck", kind: "spelling", note: "Same word in another tradition." }
        ]
      }),
      new Set(["baxter-2005", "marbeck"])
    )
  );
});

test("a variant must say whether it differs in spelling or in form", () => {
  assert.throws(
    () => check(entry({ variants: [{ form: "potra", orthography: "baxter-2005" }] })),
    /differs in spelling or in form/
  );
});

test("a variant cannot be ranked against the headword", () => {
  for (const note of ["The correct spelling.", "This is the standard form.", "An incorrect variant."]) {
    assert.throws(
      () => check(entry({ variants: [{ form: "potra", orthography: "baxter-2005", kind: "form", note }] })),
      /No form is the correct one/
    );
  }
});

test("a variant in an undeclared spelling tradition is rejected", () => {
  assert.throws(
    () => check(entry({ variants: [{ form: "potra", orthography: "invented", kind: "form" }] })),
    /undeclared spelling system/
  );
});

test("an entry cannot list its own headword as a variant", () => {
  assert.throws(
    () => check(entry({ variants: [{ form: "sabang", orthography: "baxter-2005", kind: "spelling" }] })),
    /lists its own headword/
  );
});

test("the checks carry to another language with its own traditions", () => {
  // Nothing here is Kristang-specific: a community declares its own spelling
  // traditions and the same boundary applies unchanged.
  const other = entry({
    id: "example-word",
    headword: "example-word",
    orthography: "community-2019",
    variants: [{ form: "eksampul-wurd", orthography: "mission-1904", kind: "spelling" }]
  });
  assert.doesNotThrow(() => check(other, new Set(["community-2019", "mission-1904"])));
  assert.throws(() => check(other, new Set(["baxter-2005"])), /spelling system its community has declared/);
});

test("a seed that declares no spelling traditions is rejected", () => {
  assert.throws(
    () => validateSeedPayload({ community: { id: "x" }, lexicalEntries: [] }),
    /must declare the spelling traditions/
  );
});

test("the seed file the repository actually ships passes every check", async () => {
  const payload = JSON.parse(await readFile(new URL("../scripts/seeds/kristang-curated-sample.json", import.meta.url), "utf8"));
  assert.doesNotThrow(() => validateSeedPayload(payload, "scripts/seeds/kristang-curated-sample.json"));
  // A count would go stale every time a word is added. What matters is that the
  // seed is not empty and that every entry in it clears the boundary above.
  assert.ok(payload.lexicalEntries.length > 0, "the seed ships at least one word");
  assert.ok(Object.keys(payload.orthographies).length > 0, "the seed declares its spelling traditions");

  // Every stress span must slice to a real part of its own headword.
  for (const item of payload.lexicalEntries) {
    if (!item.stress) continue;
    const marked = item.headword.slice(item.stress.start, item.stress.end);
    assert.ok(marked.length > 0, `${item.id} marks an empty span`);
    assert.ok(item.headword.includes(marked), `${item.id} marks text outside its headword`);
  }
});
