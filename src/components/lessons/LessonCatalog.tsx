"use client";

import { BookOpen, CheckCircle2, FileText, Languages, Mic, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AccessPill } from "@/components/ui/AccessPill";
import { LedgerStrip, RouteToolbar, WorkbenchHeader, cycleLedgerItems } from "@/components/ui/Workbench";
import { cycleReviewLabels } from "@/lib/learning-cycles";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import type { LessonUnit } from "@/types/kambradu";

const filters = ["all", "word", "phrase", "story", "culture"] as const;
type Filter = (typeof filters)[number];

const kindIcons = {
  word: Languages,
  phrase: BookOpen,
  story: FileText,
  culture: Users
} satisfies Record<LessonUnit["kind"], typeof BookOpen>;

export function LessonCatalog({ lessons }: { lessons: LessonUnit[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { activeCycle, findCycleForLesson, startOrResumeLesson } = useLearningCycles();
  const filteredLessons = useMemo(
    () => (filter === "all" ? lessons : lessons.filter((lesson) => lesson.kind === filter)),
    [filter, lessons]
  );

  return (
    <section className="lesson-workbench" aria-label="Lessons and resources">
      <WorkbenchHeader
        title="Cycle-ready lessons"
        description="Each lesson can become a local learning cycle with practice, private artifacts, speaker check, contribution, and steward review."
        cycle={activeCycle}
      />
      <LedgerStrip items={cycleLedgerItems(activeCycle)} />

      <RouteToolbar label="Lesson filters">
        <div className="lesson-filter" role="tablist" aria-label="Lesson filters">
          {filters.map((item) => (
            <button
              aria-selected={filter === item}
              className={filter === item ? "active" : ""}
              key={item}
              onClick={() => setFilter(item)}
              role="tab"
              type="button"
            >
              {item === "all" ? "All" : item}
            </button>
          ))}
        </div>
      </RouteToolbar>

      <div className="lesson-grid">
        {filteredLessons.map((lesson) => {
          const Icon = kindIcons[lesson.kind];
          const cycle = findCycleForLesson(lesson.id);
          const isActive = activeCycle.lessonId === lesson.id;

          return (
            <article className={`lesson-card ${isActive ? "active-cycle-card" : ""}`} key={lesson.id}>
              <span className="lesson-icon">
                <Icon size={25} aria-hidden="true" />
              </span>
              <div className="lesson-card-heading">
                <h2>{lesson.title}</h2>
                <AccessPill level={lesson.access} />
              </div>
              <p>{lesson.summary}</p>
              <div className="lesson-meta">
                <span>{lesson.level}</span>
                <span>{lesson.estimatedMinutes} min</span>
                <span>{lesson.kind}</span>
              </div>
              <div className="lesson-focus">
                {lesson.focus.map((focus) => (
                  <span key={focus}>{focus}</span>
                ))}
              </div>
              <small>
                Source: {lesson.source.label}. {lesson.source.license}
              </small>
              <div className="entry-status-row">
                <span>{cycle ? cycleReviewLabels[cycle.reviewStatus] : "No cycle"}</span>
                {isActive ? <span>Active cycle</span> : null}
              </div>
              <div className="lesson-card-actions">
                <button type="button" onClick={() => startOrResumeLesson(lesson.id)}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {cycle ? "Resume cycle" : "Start cycle"}
                </button>
                <Link href="/builder" prefetch={false}>
                  <Plus size={16} aria-hidden="true" />
                  Save words
                </Link>
                <Link href="/contribute" prefetch={false}>
                  <Mic size={16} aria-hidden="true" />
                  Record related phrase
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="lesson-actions">
        <Link href="/learn" prefetch={false}>
          Open practice plan
        </Link>
        <Link href="/builder" prefetch={false}>
          Add to my lexicon
        </Link>
      </div>
    </section>
  );
}
