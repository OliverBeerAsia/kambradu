"use client";

import Link from "next/link";
import { ArrowRight, HardDrive } from "lucide-react";
import { HegelCompanion } from "@/components/ui/HegelCompanion";
import { defaultLanguage, languageForLesson, lessonsFor } from "@/data/languages";
import { useKambraduData } from "@/lib/hooks/use-kambradu-data";
import { findOneDueReview } from "@/lib/local-data";

export function TodayHome() {
  const { data, isHydrated } = useKambraduData();
  const due = findOneDueReview(data.reviews);
  const active = data.activeSession;
  const language = languageForLesson(data.activeSession?.lessonId ?? findOneDueReview(data.reviews)?.lessonId) ?? defaultLanguage;
  const lessonUnits = lessonsFor(language);
  const reviewedLessonIds = new Set(data.reviews.map((review) => review.lessonId));
  const nextLesson = lessonUnits.find((lesson) => !reviewedLessonIds.has(lesson.id)) ?? lessonUnits[0];
  const lessonId = active?.lessonId ?? due?.lessonId ?? nextLesson.id;
  const lessonWord = lessonUnits.find((lesson) => lesson.id === lessonId)?.focus[0] ?? language.name;

  const state = active ? "continue" : due ? "review" : "new";
  const heading = state === "continue" ? "Ready to carry on?" : state === "review" ? `Time to review ${lessonWord}.` : data.reviews.length ? `Learn another ${language.name} word.` : `Learn your first ${language.name} word.`;
  const support = state === "continue" ? `You were learning ${lessonWord}.` : state === "review" ? "A quick check to help it stick." : "One word, one quick check and a place to keep it.";
  const label = state === "continue" ? "Continue" : state === "review" ? "Review" : "Start";

  return (
    <div className="page today-page">
      <section className="today-card" aria-labelledby="today-heading">
        <HegelCompanion>
          <h1 id="today-heading">{isHydrated ? heading : "Kambradu"}</h1>
          <p>{isHydrated ? support : "Loading your next step."}</p>
        </HegelCompanion>
        <Link className="primary-action" href={`/practice?lesson=${lessonId}`} aria-disabled={!isHydrated}>
          {label}
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <p className="browser-note"><HardDrive size={17} aria-hidden="true" />Saved in this browser</p>
      </section>
    </div>
  );
}
