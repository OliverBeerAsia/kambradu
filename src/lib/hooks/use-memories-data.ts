"use client";

import { useCallback } from "react";
import { starterBuilderEntries, starterJournalEntries, starterSavedWords } from "@/data/kristang";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import type { JournalEntry, PersonalLexiconEntry, SavedWord } from "@/types/kambradu";

export const MEMORY_STORAGE_KEYS = {
  journal: "kambradu-journal-entries-v1",
  personalLexicon: "kambradu-personal-lexicon-v1",
  savedWords: "kambradu-saved-words-v1"
} as const;

export function useMemoriesData() {
  const [journalEntries, setJournalEntries, journalReady] = useLocalStorageState<JournalEntry[]>(
    MEMORY_STORAGE_KEYS.journal,
    starterJournalEntries
  );
  const [personalLexiconEntries, setPersonalLexiconEntries, personalLexiconReady] =
    useLocalStorageState<PersonalLexiconEntry[]>(MEMORY_STORAGE_KEYS.personalLexicon, starterBuilderEntries);
  const [savedWords, setSavedWords, savedWordsReady] = useLocalStorageState<SavedWord[]>(
    MEMORY_STORAGE_KEYS.savedWords,
    starterSavedWords
  );

  const addJournalEntry = useCallback(
    (entry: JournalEntry) => setJournalEntries((current) => [entry, ...current]),
    [setJournalEntries]
  );
  const addPersonalLexiconEntry = useCallback(
    (entry: PersonalLexiconEntry) => setPersonalLexiconEntries((current) => [entry, ...current]),
    [setPersonalLexiconEntries]
  );
  const keepSavedWord = useCallback(
    (word: SavedWord) => {
      setSavedWords((current) => {
        const existing = current.find((item) => item.lexicalEntryId === word.lexicalEntryId);

        if (!existing) {
          return [word, ...current];
        }

        return current.map((item) => (item.lexicalEntryId === word.lexicalEntryId ? { ...item, ...word, id: item.id } : item));
      });
    },
    [setSavedWords]
  );

  return {
    journalEntries,
    personalLexiconEntries,
    savedWords,
    isHydrated: journalReady && personalLexiconReady && savedWordsReady,
    addJournalEntry,
    addPersonalLexiconEntry,
    keepSavedWord,
    setJournalEntries,
    setPersonalLexiconEntries,
    setSavedWords
  };
}
