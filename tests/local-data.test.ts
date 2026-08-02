import assert from "node:assert/strict";
import test from "node:test";
import {
  LOCAL_DATA_KEY,
  createEmptyLocalData,
  findLatestReview,
  findOneDueReview,
  loadLocalData,
  parseImportedLocalData,
  type LocalReview,
  type StorageLike
} from "../src/lib/local-data.ts";
import { scheduleNextPracticeReview } from "../src/lib/practice-scheduler.ts";

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { values: Map<string, string> } {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); }
  };
}

test("a fresh browser starts with no personal memories", () => {
  const result = loadLocalData(memoryStorage(), "2026-08-02T00:00:00.000Z");
  assert.deepEqual(result.data.memories, []);
  assert.deepEqual(result.data.reviews, []);
  assert.equal(result.corruptRaw, null);
});

test("known demo fixtures are removed but edited records migrate", () => {
  const demo = {
    id: "saved-sabang",
    headword: "sabang",
    englishGloss: "soap",
    savedAt: "2026-05-19T00:00:00.000Z"
  };
  const edited = { ...demo, englishGloss: "soap, from my own note", lastReviewedAt: "2026-08-01T00:00:00.000Z" };
  const storage = memoryStorage({
    "kambradu-saved-words-v1": JSON.stringify([demo, edited])
  });
  const result = loadLocalData(storage, "2026-08-02T00:00:00.000Z");
  assert.equal(result.data.memories.length, 1);
  assert.equal(result.data.memories[0].detail, "soap, from my own note");
});

test("malformed current data is preserved and never silently replaced", () => {
  const raw = "{not valid json";
  const storage = memoryStorage({ [LOCAL_DATA_KEY]: raw });
  const result = loadLocalData(storage, "2026-08-02T00:00:00.000Z");
  assert.equal(result.corruptRaw, raw);
  assert.equal(storage.getItem(LOCAL_DATA_KEY), raw);
  assert.deepEqual(result.data.memories, []);
});

test("restore accepts only the versioned validated format", () => {
  const valid = createEmptyLocalData("2026-08-02T00:00:00.000Z");
  assert.deepEqual(parseImportedLocalData(JSON.stringify(valid)), valid);
  assert.throws(() => parseImportedLocalData(JSON.stringify({ version: 1, memories: [] })), /valid Kambradu backup/);
});

test("review scheduling uses ISO dates and the latest matching review", () => {
  const start = new Date("2026-08-02T03:00:00.000Z");
  const first = scheduleNextPracticeReview("got-it", 0, start);
  assert.equal(first.intervalDays, 4);
  assert.equal(first.reviewedAt, "2026-08-02T03:00:00.000Z");
  assert.equal(first.nextReviewAt, "2026-08-06T03:00:00.000Z");

  const reviews: LocalReview[] = [
    { id: "old", lessonId: "shop-visit", promptId: "read-sabang", lexicalEntryId: "sabang", confidence: "almost", reflection: "", reviewedAt: "2026-07-01T00:00:00.000Z", nextReviewAt: "2026-07-03T00:00:00.000Z", intervalDays: 2 },
    { id: "new", lessonId: "shop-visit", promptId: "read-sabang", lexicalEntryId: "sabang", confidence: "got-it", reflection: "home", reviewedAt: "2026-08-01T00:00:00.000Z", nextReviewAt: "2026-08-05T00:00:00.000Z", intervalDays: 4 },
    { id: "other", lessonId: "home-objects", promptId: "meaning-janela", lexicalEntryId: "janela", confidence: "again", reflection: "", reviewedAt: "2026-08-01T02:00:00.000Z", nextReviewAt: "2026-08-02T02:00:00.000Z", intervalDays: 1 }
  ];

  assert.equal(findLatestReview(reviews, "shop-visit")?.id, "new");
  assert.equal(findOneDueReview(reviews, new Date("2026-08-02T03:00:00.000Z"))?.id, "other");
});
