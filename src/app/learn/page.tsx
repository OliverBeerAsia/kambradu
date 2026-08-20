import { AppShell } from "@/components/layout/AppShell";
import { LanguageChooser } from "@/components/learn/LanguageChooser";
import { languages } from "@/data/languages";

export default function LearnPage() {
  return (
    <AppShell activePath="/learn">
      <LanguageChooser languages={languages} />
    </AppShell>
  );
}
