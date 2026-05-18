import type { ReviewConfidence } from "@/types/kambradu";

type ReviewSchedule = {
  reviewedAt: string;
  nextReviewAt: string;
  intervalDays: number;
  ease: number;
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function scheduleNextPracticeReview(
  confidence: Exclude<ReviewConfidence, "new">,
  previousIntervalDays = 0,
  fromDate = new Date()
): ReviewSchedule {
  const intervalDays =
    confidence === "again" ? 1 : confidence === "almost" ? 2 : previousIntervalDays >= 7 ? 14 : previousIntervalDays >= 4 ? 7 : 4;
  const ease = confidence === "again" ? 1.7 : confidence === "almost" ? 2 : 2.4;
  const reviewedAt = fromDate.toISOString();
  const nextReviewAt = addDays(fromDate, intervalDays).toISOString();

  return {
    reviewedAt,
    nextReviewAt,
    intervalDays,
    ease
  };
}

export function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}
