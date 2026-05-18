import { AppShell } from "@/components/layout/AppShell";
import { LessonCatalog } from "@/components/lessons/LessonCatalog";
import { lessonUnits } from "@/data/kristang";

export default function LessonsPage() {
  return (
    <AppShell activePath="/lessons">
      <div className="route-page">
        <section className="route-heading">
          <h1>Lessons and resources</h1>
          <p>
            Top-down language content stays lightweight: short word, phrase, story, and culture units that can feed review,
            journals, recordings, and personal dictionaries.
          </p>
        </section>
        <LessonCatalog lessons={lessonUnits} />
      </div>
    </AppShell>
  );
}
