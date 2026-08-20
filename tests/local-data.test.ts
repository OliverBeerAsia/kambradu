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
import { DEFAULT_EASE, gradeFromAnswer, scheduleNextPracticeReview } from "../src/lib/practice-scheduler.ts";

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
  assert.equal(first.intervalDays, 1);
  assert.equal(first.reviewedAt, "2026-08-02T03:00:00.000Z");
  // Due at the start of the next local day, not at the same clock time.
  const due = new Date(first.nextReviewAt);
  assert.equal(due.getHours(), 0);
  assert.equal(due.getMinutes(), 0);
  assert.equal(due.getDate(), new Date(start.getTime() + 86400000).getDate());

  const reviews: LocalReview[] = [
    { id: "old", lessonId: "sabang", promptId: "sabang", lexicalEntryId: "sabang", confidence: "almost", reflection: "", reviewedAt: "2026-07-01T00:00:00.000Z", nextReviewAt: "2026-07-03T00:00:00.000Z", intervalDays: 2 },
    { id: "new", lessonId: "sabang", promptId: "sabang", lexicalEntryId: "sabang", confidence: "got-it", reflection: "home", reviewedAt: "2026-08-01T00:00:00.000Z", nextReviewAt: "2026-08-05T00:00:00.000Z", intervalDays: 4 },
    { id: "other", lessonId: "janela", promptId: "janela", lexicalEntryId: "janela", confidence: "again", reflection: "", reviewedAt: "2026-08-01T02:00:00.000Z", nextReviewAt: "2026-08-02T02:00:00.000Z", intervalDays: 1 }
  ];

  assert.equal(findLatestReview(reviews, "sabang")?.id, "new");
  assert.equal(findOneDueReview(reviews, new Date("2026-08-02T03:00:00.000Z"))?.id, "other");
});

test("legacy reviews keyed only by lesson id still match", () => {
  const reviews: LocalReview[] = [
    { id: "legacy", lessonId: "shop-visit", promptId: "read-sabang", lexicalEntryId: "sabang", confidence: "got-it", reflection: "", reviewedAt: "2026-08-01T00:00:00.000Z", nextReviewAt: "2026-08-05T00:00:00.000Z", intervalDays: 4 }
  ];
  assert.equal(findLatestReview(reviews, "sabang")?.id, "legacy");
  assert.equal(findLatestReview(reviews, "shop-visit")?.id, "legacy");
});

test("both failure grades bring an item back quickly", () => {
  const now = new Date("2026-08-02T03:00:00.000Z");
  assert.equal(scheduleNextPracticeReview("again", { intervalDays: 30 }, now).intervalDays, 1);
  // "almost" keeps some of what a mature item earned instead of dropping to a constant.
  assert.equal(scheduleNextPracticeReview("almost", { intervalDays: 30 }, now).intervalDays, 7);
  assert.equal(scheduleNextPracticeReview("almost", { intervalDays: 2 }, now).intervalDays, 2);
});

test("a well-known word graduates past the old fourteen day ceiling", () => {
  const now = new Date("2026-08-02T03:00:00.000Z");
  let state = { intervalDays: 0, ease: DEFAULT_EASE, reps: 0, lapses: 0 };
  const ladder: number[] = [];
  for (let round = 0; round < 6; round += 1) {
    const next = scheduleNextPracticeReview("got-it", state, now);
    ladder.push(next.intervalDays);
    state = { intervalDays: next.intervalDays, ease: next.ease, reps: next.reps, lapses: next.lapses };
  }
  assert.deepEqual(ladder.slice(0, 3), [1, 4, 10]);
  assert.ok(ladder.at(-1)! > 14, `expected graduation past 14 days, got ${ladder.at(-1)}`);
  // Intervals only ever grow while the answer stays correct.
  for (let i = 1; i < ladder.length; i += 1) assert.ok(ladder[i] > ladder[i - 1]);
});

test("lapses and ease persist, and ease has a floor", () => {
  const now = new Date("2026-08-02T03:00:00.000Z");
  let state = { intervalDays: 20, ease: DEFAULT_EASE, reps: 5, lapses: 1 };
  for (let round = 0; round < 8; round += 1) {
    const next = scheduleNextPracticeReview("again", state, now);
    state = { intervalDays: next.intervalDays, ease: next.ease, reps: next.reps, lapses: next.lapses };
  }
  assert.equal(state.lapses, 9, "every lapse is counted");
  assert.equal(state.reps, 13, "every review is counted");
  assert.ok(state.ease >= 1.3, `ease floor held, got ${state.ease}`);
});

test("a wrong typed answer cannot be self-rated into a long interval", () => {
  assert.equal(gradeFromAnswer("got-it", false), "almost");
  assert.equal(gradeFromAnswer("got-it", true), "got-it");
  assert.equal(gradeFromAnswer("again", false), "again");

  const now = new Date("2026-08-02T03:00:00.000Z");
  const honest = scheduleNextPracticeReview(gradeFromAnswer("got-it", true), { intervalDays: 10 }, now);
  const bluffed = scheduleNextPracticeReview(gradeFromAnswer("got-it", false), { intervalDays: 10 }, now);
  assert.ok(bluffed.intervalDays < honest.intervalDays);
});
