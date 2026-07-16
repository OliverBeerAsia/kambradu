import { AccessState } from "@/components/ui/Workbench";
import { LexiconSearch } from "@/components/lexicon/LexiconSearch";
import type { LexicalEntry } from "@/types/kambradu";

export function LocalLexiconBrowser({ entries }: { entries: LexicalEntry[] }) {
  return (
    <div className="local-lexicon-stack">
      <AccessState
        state="local"
        label="Dictionary-listed entries"
        detail="Only traced reference forms appear here. Community review and audio are not yet available."
      />
      <LexiconSearch entries={entries} />
    </div>
  );
}
