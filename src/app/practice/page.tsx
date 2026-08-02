import { AppShell } from "@/components/layout/AppShell";
import { PracticeSession } from "@/components/practice/PracticeSession";

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ lesson?: string }> }) {
  const { lesson } = await searchParams;
  return (
    <AppShell activePath="/learn" immersive>
      <div className="page practice-page">
        <PracticeSession requestedLessonId={lesson} />
      </div>
    </AppShell>
  );
}
