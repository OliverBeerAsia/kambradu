"use client";

import { useMemo } from "react";
import { AccessState } from "@/components/ui/Workbench";
import { LexiconSearch } from "@/components/lexicon/LexiconSearch";
import { approvedCyclesToLexiconEntries } from "@/lib/learning-cycles";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import type { LexicalEntry } from "@/types/kambradu";

export function LocalLexiconBrowser({ entries }: { entries: LexicalEntry[] }) {
  const { cycles } = useLearningCycles();
  const localEntries = useMemo(() => approvedCyclesToLexiconEntries(cycles), [cycles]);
  const allEntries = useMemo(() => [...localEntries, ...entries], [entries, localEntries]);

  return (
    <div className="local-lexicon-stack">
      <AccessState
        state={localEntries.length ? "approved" : "local"}
        label={`${localEntries.length} local approved entries`}
        detail="Steward-approved local cycle content appears here before Firebase publishing is enabled."
      />
      <LexiconSearch entries={allEntries} />
    </div>
  );
}
