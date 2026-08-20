/**
 * Regenerate scripts/seeds/kristang-curated-sample.json from the app's own
 * lexicon, so the seed and the shipped data cannot drift apart.
 *
 * Run with:
 *   node --experimental-strip-types scripts/build-seed.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { kristang } = await import(path.join(root, "src/data/languages/kristang.ts"));

// Only Kristang is seeded. Malay is transcribed but not yet checked by a
// person, so the content guard rejects it, which is the guard working.
const language = kristang;

const payload = {
  community: {
    id: language.community.id,
    name: language.community.name,
    languageName: language.community.languageName,
    region: language.community.region,
    defaultAccess: language.community.defaultAccess
  },
  // The spelling traditions this community recognises. Entries name one of
  // these; the seed guard checks against this list rather than a fixed name.
  orthographies: language.orthographies,
  lexicalEntries: language.entries,
  stories: []
};

const target = path.join(root, "scripts/seeds/kristang-curated-sample.json");
fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${language.entries.length} entries to ${path.relative(root, target)}.`);
