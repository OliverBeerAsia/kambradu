/**
 * Look up headwords in the Baxter and de Silva dictionary and print the entry
 * text with its printed page number.
 *
 * This is a review aid, not an importer. The OCR layer in the source PDF is
 * imperfect, so every entry must be read by a person before it becomes teaching
 * material. Nothing here writes to src/data.
 *
 * Usage:
 *   pdftotext -layout "kristang dictionary.pdf" tmp/dict-layout.txt
 *   node scripts/lookup-dictionary.mjs tmp/dict-layout.txt sabang janela
 */
import fs from "node:fs";

// The Kristang-English section runs from printed page 1; the PDF adds 22 front pages.
const PDF_TO_PRINTED = 22;
// The finderlist starts here. Headword lookups should stay before it.
const FINDERLIST_FROM = 91;

const [, , textPath, ...words] = process.argv;

if (!textPath || words.length === 0) {
  console.error("Usage: node scripts/lookup-dictionary.mjs <layout.txt> <headword...>");
  process.exit(1);
}

const pages = fs.readFileSync(textPath, "utf8").split("\f");

// Part-of-speech and sense markers, as the OCR renders them (11 for n., V. for v.).
const POS = "\\(|n\\.|11\\.|v\\.|V\\.|adj\\.|ad\\}|adv\\.|num\\.|nUnl|conj\\.|prep\\.|pron\\.|interj|See";

/**
 * A headword sits at the start of its column. Columns are separated by a wide
 * gutter, so "start of column" is either start of line or three or more spaces.
 * The printed page numbers each column independently, so both are searched.
 */
function findHeadword(word) {
  const hits = [];
  const pattern = new RegExp(`(^|\\s{3,})(${word})\\s*\\d?\\s*(${POS})`);
  for (const [index, page] of pages.entries()) {
    const printed = index + 1 - PDF_TO_PRINTED;
    if (printed < 1 || printed >= FINDERLIST_FROM) continue;
    const lines = page.split("\n");
    for (const [row, line] of lines.entries()) {
      const match = pattern.exec(line);
      if (!match) continue;
      // Keep the column the match sits in, so the continuation lines line up.
      const start = match.index + match[1].length;
      const block = lines
        .slice(row, row + 5)
        .map((next) => next.slice(start > 20 ? start - 3 : 0).trimEnd())
        .join("\n");
      hits.push({ printed, block });
    }
  }
  return hits;
}

for (const word of words) {
  const hits = findHeadword(word);
  console.log(`\n=== ${word} ===`);
  if (hits.length === 0) {
    console.log("  NOT FOUND as a headword. Do not add it.");
    continue;
  }
  for (const hit of hits) {
    console.log(`  printed page ${hit.printed}`);
    for (const line of hit.block.split("\n")) console.log(`    ${line.trim()}`);
  }
}
