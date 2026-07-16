import type { JournalEntry, PersonalLexiconEntry, SavedWord } from "@/types/kambradu";

export type MemoryFeedItem = {
  id: string;
  kind: "saved-word" | "note" | "personal-word";
  label: string;
  title: string;
  detail: string;
  sortAt?: string;
};

export function buildMemoryFeed({
  journalEntries,
  personalLexiconEntries,
  savedWords
}: {
  journalEntries: JournalEntry[];
  personalLexiconEntries: PersonalLexiconEntry[];
  savedWords: SavedWord[];
}) {
  const items: MemoryFeedItem[] = [
    ...savedWords.map((word) => ({
      id: word.id,
      kind: "saved-word" as const,
      label: "Saved word",
      title: word.headword,
      detail: word.englishGloss,
      sortAt: word.savedAt
    })),
    ...journalEntries.map((entry) => ({
      id: entry.id,
      kind: "note" as const,
      label: "Private note",
      title: entry.title,
      detail: shorten(entry.body),
      sortAt: entry.updatedAt ?? entry.createdAt
    })),
    ...personalLexiconEntries.map((entry) => ({
      id: entry.id,
      kind: "personal-word" as const,
      label: "My word",
      title: entry.headword,
      detail: entry.englishGloss,
      sortAt: entry.createdAt
    }))
  ];

  return items.sort((a, b) => toTime(b.sortAt) - toTime(a.sortAt));
}

function shorten(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > 92 ? `${clean.slice(0, 89)}...` : clean;
}

function toTime(value?: string) {
  const time = value ? Date.parse(value) : Number.NaN;
  return Number.isNaN(time) ? 0 : time;
}
