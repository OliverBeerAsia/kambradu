export const LOCAL_DATA_VERSION = 2 as const;
export const LOCAL_DATA_KEY = "kambradu-local-data-v2";

export type MemoryKind = "word" | "note";

export type LocalMemory = {
  id: string;
  kind: MemoryKind;
  title: string;
  detail: string;
  context: string;
  linkedEntryId?: string;
  createdAt: string;
  updatedAt: string;
};

export type LocalReview = {
  id: string;
  lessonId: string;
  promptId: string;
  lexicalEntryId: string;
  confidence: "again" | "almost" | "got-it";
  reflection: string;
  reviewedAt: string;
  nextReviewAt: string;
  intervalDays: number;
};

export type LocalPracticeSession = {
  lessonId: string;
  step: "meet" | "meaning" | "recall" | "connect" | "keep";
  startedAt: string;
  meaningChoice?: string;
  recall?: string;
  recallChecked?: boolean;
  confidence?: LocalReview["confidence"];
  context?: string;
};

export type LocalData = {
  version: typeof LOCAL_DATA_VERSION;
  memories: LocalMemory[];
  reviews: LocalReview[];
  activeSession: LocalPracticeSession | null;
  updatedAt: string;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type LocalDataLoadResult = {
  data: LocalData;
  corruptRaw: string | null;
  migratedCount: number;
};

const legacyKeys = {
  journal: "kambradu-journal-entries-v1",
  personalLexicon: "kambradu-personal-lexicon-v1",
  savedWords: "kambradu-saved-words-v1"
} as const;

export function createEmptyLocalData(now = new Date().toISOString()): LocalData {
  return {
    version: LOCAL_DATA_VERSION,
    memories: [],
    reviews: [],
    activeSession: null,
    updatedAt: now
  };
}

export function isLocalData(value: unknown): value is LocalData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LocalData>;
  return candidate.version === LOCAL_DATA_VERSION && Array.isArray(candidate.memories) &&
    candidate.memories.every(isLocalMemory) && Array.isArray(candidate.reviews) &&
    candidate.reviews.every(isLocalReview) && (candidate.activeSession === null || isLocalPracticeSession(candidate.activeSession)) &&
    typeof candidate.updatedAt === "string" && isIsoDate(candidate.updatedAt);
}

export function loadLocalData(storage: StorageLike, now = new Date().toISOString()): LocalDataLoadResult {
  const raw = storage.getItem(LOCAL_DATA_KEY);

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!isLocalData(parsed)) {
        return { data: createEmptyLocalData(now), corruptRaw: raw, migratedCount: 0 };
      }
      return { data: parsed, corruptRaw: null, migratedCount: 0 };
    } catch {
      return { data: createEmptyLocalData(now), corruptRaw: raw, migratedCount: 0 };
    }
  }

  const migrated = migrateLegacyMemories(storage, now);
  return {
    data: { ...createEmptyLocalData(now), memories: migrated },
    corruptRaw: null,
    migratedCount: migrated.length
  };
}

export function parseImportedLocalData(raw: string): LocalData {
  const parsed = JSON.parse(raw) as unknown;
  if (!isLocalData(parsed)) throw new Error("This is not a valid Kambradu backup.");
  return parsed;
}

export function findLatestReview(reviews: LocalReview[], lessonId: string) {
  return reviews
    .filter((review) => review.lessonId === lessonId)
    .sort((a, b) => Date.parse(b.reviewedAt) - Date.parse(a.reviewedAt))[0];
}

export function findOneDueReview(reviews: LocalReview[], now = new Date()) {
  const latestByLesson = new Map<string, LocalReview>();
  for (const review of reviews) {
    const latest = latestByLesson.get(review.lessonId);
    if (!latest || Date.parse(review.reviewedAt) > Date.parse(latest.reviewedAt)) {
      latestByLesson.set(review.lessonId, review);
    }
  }

  return [...latestByLesson.values()]
    .filter((review) => Date.parse(review.nextReviewAt) <= now.getTime())
    .sort((a, b) => Date.parse(a.nextReviewAt) - Date.parse(b.nextReviewAt))[0];
}

function migrateLegacyMemories(storage: StorageLike, now: string): LocalMemory[] {
  const memories: LocalMemory[] = [];
  const savedWords = readLegacyArray(storage, legacyKeys.savedWords);
  const journal = readLegacyArray(storage, legacyKeys.journal);
  const personalLexicon = readLegacyArray(storage, legacyKeys.personalLexicon);

  for (const item of savedWords) {
    if (isExactDemoSavedWord(item) || !isRecord(item)) continue;
    const title = stringValue(item.headword);
    const detail = stringValue(item.englishGloss);
    if (!title || !detail) continue;
    memories.push({
      id: `migrated-${stringValue(item.id) || stableId(title)}`,
      kind: "word",
      title,
      detail,
      context: "",
      linkedEntryId: stringValue(item.lexicalEntryId) || undefined,
      createdAt: isoOr(item.savedAt, now),
      updatedAt: isoOr(item.lastReviewedAt, isoOr(item.savedAt, now))
    });
  }

  for (const item of journal) {
    if (isExactDemoJournal(item) || !isRecord(item)) continue;
    const title = stringValue(item.title);
    const body = stringValue(item.body);
    if (!title || !body) continue;
    memories.push({
      id: `migrated-${stringValue(item.id) || stableId(title)}`,
      kind: "note",
      title,
      detail: body,
      context: "",
      createdAt: isoOr(item.createdAt, now),
      updatedAt: isoOr(item.updatedAt, isoOr(item.createdAt, now))
    });
  }

  for (const item of personalLexicon) {
    if (isExactDemoPersonalWord(item) || !isRecord(item)) continue;
    const title = stringValue(item.headword);
    const detail = stringValue(item.englishGloss);
    if (!title || !detail) continue;
    memories.push({
      id: `migrated-${stringValue(item.id) || stableId(title)}`,
      kind: "word",
      title,
      detail,
      context: stringValue(item.example) || stringValue(item.sourceNote),
      createdAt: isoOr(item.createdAt, now),
      updatedAt: isoOr(item.createdAt, now)
    });
  }

  return uniqueById(memories).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

function isLocalMemory(value: unknown): value is LocalMemory {
  if (!isRecord(value)) return false;
  return (value.kind === "word" || value.kind === "note") && typeof value.id === "string" &&
    typeof value.title === "string" && typeof value.detail === "string" && typeof value.context === "string" &&
    isIsoDate(value.createdAt) && isIsoDate(value.updatedAt);
}

function isLocalReview(value: unknown): value is LocalReview {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && typeof value.lessonId === "string" && typeof value.promptId === "string" &&
    typeof value.lexicalEntryId === "string" && ["again", "almost", "got-it"].includes(String(value.confidence)) &&
    typeof value.reflection === "string" && isIsoDate(value.reviewedAt) && isIsoDate(value.nextReviewAt) &&
    typeof value.intervalDays === "number";
}

function isLocalPracticeSession(value: unknown): value is LocalPracticeSession {
  if (!isRecord(value)) return false;
  return typeof value.lessonId === "string" && ["meet", "meaning", "recall", "connect", "keep"].includes(String(value.step)) &&
    isIsoDate(value.startedAt) && (value.meaningChoice === undefined || typeof value.meaningChoice === "string") &&
    (value.recall === undefined || typeof value.recall === "string") &&
    (value.recallChecked === undefined || typeof value.recallChecked === "boolean") &&
    (value.confidence === undefined || ["again", "almost", "got-it"].includes(String(value.confidence))) &&
    (value.context === undefined || typeof value.context === "string");
}

function readLegacyArray(storage: StorageLike, key: string): unknown[] {
  const raw = storage.getItem(key);
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function isExactDemoSavedWord(value: unknown) {
  if (!isRecord(value)) return false;
  return (value.id === "saved-sabang" && value.headword === "sabang" && value.englishGloss === "soap" && value.savedAt === "2026-05-19T00:00:00.000Z") ||
    (value.id === "saved-janela" && value.headword === "janela" && value.englishGloss === "window" && value.savedAt === "2026-05-18T00:00:00.000Z");
}

function isExactDemoJournal(value: unknown) {
  return isRecord(value) && value.id === "users/demo/journalEntries/shop-visit-starter" && value.title === "Words from the shop" &&
    value.body === "A place on this device to remember a word, where it came from, and what you want to check.";
}

function isExactDemoPersonalWord(value: unknown) {
  return isRecord(value) && value.id === "personal-sabang" && value.headword === "sabang" && value.englishGloss === "soap" &&
    value.sourceNote === "Dictionary-listed word. No reviewed audio or usage note is attached.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) && value.includes("T");
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isoOr(value: unknown, fallback: string) {
  return isIsoDate(value) ? value : fallback;
}

function stableId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "memory";
}

function uniqueById(items: LocalMemory[]) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}
