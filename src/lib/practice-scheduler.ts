type SchedulableConfidence = "again" | "almost" | "got-it";

export type ReviewSchedule = {
  reviewedAt: string;
  nextReviewAt: string;
  intervalDays: number;
  ease: number;
  reps: number;
  lapses: number;
};

/** What the scheduler knows about an item before this review. */
export type PriorReviewState = {
  intervalDays?: number;
  ease?: number;
  reps?: number;
  lapses?: number;
};

export const DEFAULT_EASE = 2.3;
const MIN_EASE = 1.3;
const MAX_EASE = 2.8;
/** Keeps a long interval from drifting so far that the word is effectively dropped. */
const MAX_INTERVAL_DAYS = 365;
/** Spreads same-day reviews so a big cohort does not all fall due together. */
const FUZZ = 0.1;

const EASE_CHANGE: Record<SchedulableConfidence, number> = {
  again: -0.2,
  almost: -0.05,
  "got-it": 0.1
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Due at the start of the day, so an 11pm session is not due again at 11pm. */
function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

/**
 * Deterministic spread in [-FUZZ, +FUZZ] derived from the item, so the same item
 * always lands on the same day rather than moving on every render.
 */
function fuzzFor(seed: string, intervalDays: number) {
  if (intervalDays < 4) return 0;
  let hash = 0;
  for (const character of seed) hash = (hash * 31 + character.charCodeAt(0)) % 1000;
  return ((hash / 1000) * 2 - 1) * FUZZ;
}

/**
 * An expanding scheduler in the SM-2 family, kept deliberately simple.
 *
 * `again` and `almost` are lapses: the item comes back within a day or two and
 * its ease drops, but the lapse count is remembered so a word that keeps
 * slipping is not treated as if it were new. `got-it` multiplies the previous
 * interval by the item's ease, so well-known words genuinely graduate instead of
 * stopping at a fixed ceiling.
 */
export function scheduleNextPracticeReview(
  confidence: SchedulableConfidence,
  prior: PriorReviewState | number = {},
  fromDate = new Date(),
  seed = ""
): ReviewSchedule {
  // Older callers passed the previous interval as a plain number.
  const previous: PriorReviewState = typeof prior === "number" ? { intervalDays: prior } : prior;
  const previousInterval = previous.intervalDays ?? 0;
  const previousEase = previous.ease ?? DEFAULT_EASE;
  const reps = (previous.reps ?? 0) + 1;

  const ease = clamp(previousEase + EASE_CHANGE[confidence], MIN_EASE, MAX_EASE);
  const lapses = (previous.lapses ?? 0) + (confidence === "got-it" ? 0 : 1);

  let intervalDays: number;
  if (confidence === "again") {
    intervalDays = 1;
  } else if (confidence === "almost") {
    // Hold some of what a mature item had earned rather than dropping to a constant.
    intervalDays = clamp(Math.round(previousInterval * 0.4), 2, 7);
  } else if (previousInterval <= 0) {
    intervalDays = 1;
  } else if (previousInterval === 1) {
    intervalDays = 4;
  } else {
    intervalDays = Math.round(previousInterval * ease);
  }

  intervalDays = clamp(intervalDays, 1, MAX_INTERVAL_DAYS);
  const spread = Math.round(intervalDays * fuzzFor(seed, intervalDays));
  const scheduledDays = clamp(intervalDays + spread, 1, MAX_INTERVAL_DAYS);

  return {
    reviewedAt: fromDate.toISOString(),
    nextReviewAt: startOfDay(addDays(fromDate, scheduledDays)).toISOString(),
    intervalDays,
    ease: Number(ease.toFixed(2)),
    reps,
    lapses
  };
}

/**
 * A typed answer that did not match the dictionary form caps the grade. Seeing
 * the answer and then rating yourself "Got it" should not earn a long interval.
 */
export function gradeFromAnswer(
  selfRating: SchedulableConfidence,
  recallWasCorrect: boolean
): SchedulableConfidence {
  if (recallWasCorrect || selfRating === "again") return selfRating;
  return selfRating === "got-it" ? "almost" : selfRating;
}

export function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}
