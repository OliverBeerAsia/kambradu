import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LearnHome } from "@/components/learn/LearnHome";
import { getLanguage, languages } from "@/data/languages";

export function generateStaticParams() {
  return languages.map((language) => ({ language: language.id }));
}

export default async function LearnLanguagePage({ params }: { params: Promise<{ language: string }> }) {
  const language = getLanguage((await params).language);
  if (!language) notFound();

  return (
    <AppShell activePath="/learn">
      <LearnHome language={language} />
    </AppShell>
  );
}
