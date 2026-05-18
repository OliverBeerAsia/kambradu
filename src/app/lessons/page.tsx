import { AppShell } from "@/components/layout/AppShell";
import { LessonCatalog } from "@/components/lessons/LessonCatalog";
import { lessonUnits } from "@/data/kristang";

export default function LessonsPage() {
  return (
    <AppShell activePath="/lessons">
      <div className="route-page">
        <section className="route-heading">
          <h1>Browse</h1>
        </section>
        <LessonCatalog lessons={lessonUnits} />
      </div>
    </AppShell>
  );
}
