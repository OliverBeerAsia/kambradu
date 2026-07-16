"use client";

import { ArrowRight, Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import type { LessonUnit } from "@/types/kambradu";

export function LessonCatalog({ lessons }: { lessons: LessonUnit[] }) {
  const router = useRouter();
  const { startOrResumeLesson } = useLearningCycles();

  function begin(lessonId: string) {
    startOrResumeLesson(lessonId);
    router.push("/practice");
  }

  return (
    <section className="simple-lesson-catalog" aria-label="Kristang practice choices">
      <div className="lesson-grid">
        {lessons.map((lesson) => (
          <article className="lesson-card" key={lesson.id}>
            <span className="lesson-icon" aria-hidden="true">
              <Languages size={25} />
            </span>
            <div className="lesson-card-heading">
              <h2>{lesson.title}</h2>
              <span>{lesson.estimatedMinutes} min</span>
            </div>
            <p>{lesson.summary}</p>
            <small>Dictionary source: {lesson.source.authors}</small>
            <button type="button" onClick={() => begin(lesson.id)}>
              Start practice
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
      <p className="practice-honesty-note">These entries are dictionary-listed. Reviewed community audio is not yet available.</p>
    </section>
  );
}
