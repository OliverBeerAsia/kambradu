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
const { kristangCommunity, orthographyProfiles, publicLexiconEntries } = await import(path.join(root, "src/data/kristang.ts"));

const payload = {
  community: {
    id: kristangCommunity.id,
    name: kristangCommunity.name,
    languageName: kristangCommunity.languageName,
    region: kristangCommunity.region,
    defaultAccess: kristangCommunity.defaultAccess
  },
  // The spelling traditions this community recognises. Entries name one of
  // these; the seed guard checks against this list rather than a fixed name.
  orthographies: orthographyProfiles,
  lexicalEntries: publicLexiconEntries,
  stories: []
};

const target = path.join(root, "scripts/seeds/kristang-curated-sample.json");
fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${publicLexiconEntries.length} entries to ${path.relative(root, target)}.`);
