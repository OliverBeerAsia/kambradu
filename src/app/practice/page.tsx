"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PracticeSession } from "@/components/practice/PracticeSession";

/**
 * The lesson is read in the browser rather than on a server.
 *
 * Nothing about practice needs a server: the words are bundled and the learner's
 * progress lives in their own browser. Reading the query here is what lets the
 * whole site ship as static files.
 */
function PracticeForRequestedLesson() {
  const lesson = useSearchParams().get("lesson") ?? undefined;
  return <PracticeSession requestedLessonId={lesson} />;
}

export default function PracticePage() {
  return (
    <AppShell activePath="/learn" immersive>
      <div className="page practice-page">
        <Suspense fallback={null}>
          <PracticeForRequestedLesson />
        </Suspense>
      </div>
    </AppShell>
  );
}
