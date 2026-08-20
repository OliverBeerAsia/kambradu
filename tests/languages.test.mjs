import assert from "node:assert/strict";
import { test } from "node:test";
import { kristang } from "../src/data/languages/kristang.ts";
import { malay } from "../src/data/languages/malay.ts";

const languages = [kristang, malay];

test("entry ids do not collide across languages", () => {
  // A learner's reviews and memories are keyed by entry id. If two languages
  // ever used the same id, one language's practice would overwrite the other's.
  const seen = new Map();
  const clashes = [];
  for (const language of languages) {
    for (const entry of language.entries) {
      if (seen.has(entry.id)) clashes.push(`${entry.id}: ${seen.get(entry.id)} and ${language.id}`);
      else seen.set(entry.id, language.id);
    }
  }
  assert.deepEqual(clashes, [], "entry ids must be unique across every language");
});

test("every language declares what it is and where its words came from", () => {
  for (const language of languages) {
    assert.ok(language.id && language.name, "a language needs an id and a name");
    assert.ok(language.tag, `${language.id} needs a language tag`);
    assert.ok(language.attribution?.license, `${language.id} needs a licence`);
    assert.ok(language.evidenceNote, `${language.id} needs an honest evidence note`);
    assert.ok(["endangered", "widely-spoken"].includes(language.vitality), `${language.id} needs a vitality`);
    assert.ok(Object.keys(language.orthographies).length > 0, `${language.id} needs a spelling tradition`);
  }
});

test("every entry names a spelling tradition its own language declares", () => {
  for (const language of languages) {
    const known = new Set(Object.keys(language.orthographies));
    for (const entry of language.entries) {
      assert.ok(known.has(entry.orthography), `${language.id}/${entry.id} names an undeclared spelling`);
      for (const variant of entry.variants) {
        assert.ok(known.has(variant.orthography), `${language.id}/${entry.id} variant names an undeclared spelling`);
      }
    }
  }
});

test("an evidence claim is never stronger than the source supports", () => {
  for (const language of languages) {
    for (const entry of language.entries) {
      if (entry.evidence.source_checked) {
        assert.ok(
          entry.source.checkedBy && entry.source.checkedAt,
          `${language.id}/${entry.id} claims it was checked but names nobody who checked it`
        );
      }
      // Nothing is ever claimed as speaker-attested or partner-reviewed yet.
      assert.equal(entry.evidence.speaker_attested, false, `${language.id}/${entry.id}`);
      assert.equal(entry.evidence.partner_reviewed, false, `${language.id}/${entry.id}`);
      assert.equal(entry.hasAudio, false, `${language.id}/${entry.id}`);
    }
  }
});

test("every entry cites a locator, and a page or an entry address", () => {
  for (const language of languages) {
    for (const entry of language.entries) {
      assert.ok(entry.source.locator, `${language.id}/${entry.id} has no locator`);
      const hasPlace = Number.isInteger(entry.source.page) || Boolean(entry.source.entryUrl);
      assert.ok(hasPlace, `${language.id}/${entry.id} cites no page and no entry address`);
    }
  }
});
