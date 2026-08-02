"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  LOCAL_DATA_KEY,
  createEmptyLocalData,
  loadLocalData,
  parseImportedLocalData,
  type LocalData,
  type LocalMemory,
  type LocalPracticeSession,
  type LocalReview
} from "@/lib/local-data";

type SaveStatus = { kind: "ok" | "error"; message: string } | null;

export function useKambraduData() {
  const [data, setData] = useState<LocalData>(() => createEmptyLocalData());
  const dataRef = useRef(data);
  const [isHydrated, setIsHydrated] = useState(false);
  const [corruptRaw, setCorruptRaw] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);

  useLayoutEffect(() => {
    const loaded = loadLocalData(window.localStorage);
    dataRef.current = loaded.data;
    setData(loaded.data);
    setCorruptRaw(loaded.corruptRaw);
    setIsHydrated(true);

    if (!loaded.corruptRaw) {
      try {
        window.localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(loaded.data));
      } catch {
        setSaveStatus({ kind: "error", message: "This browser could not save your data. Export a backup before leaving." });
      }
    }
  }, []);

  const commit = useCallback((update: (current: LocalData) => LocalData) => {
    const next = { ...update(dataRef.current), updatedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(next));
      dataRef.current = next;
      setData(next);
      setSaveStatus({ kind: "ok", message: "Saved in this browser." });
      setCorruptRaw(null);
      return true;
    } catch {
      setSaveStatus({ kind: "error", message: "This browser could not save your change. Your current entry is still on screen." });
      return false;
    }
  }, []);

  const addMemory = useCallback((memory: LocalMemory) => {
    return commit((current) => ({ ...current, memories: [memory, ...current.memories] }));
  }, [commit]);

  const updateMemory = useCallback((memory: LocalMemory) => {
    return commit((current) => ({ ...current, memories: current.memories.map((item) => item.id === memory.id ? memory : item) }));
  }, [commit]);

  const deleteMemory = useCallback((id: string) => {
    return commit((current) => ({ ...current, memories: current.memories.filter((item) => item.id !== id) }));
  }, [commit]);

  const addReview = useCallback((review: LocalReview) => {
    return commit((current) => ({ ...current, reviews: [review, ...current.reviews], activeSession: null }));
  }, [commit]);

  const setActiveSession = useCallback((session: LocalPracticeSession | null) => {
    commit((current) => ({ ...current, activeSession: session }));
  }, [commit]);

  const keepDictionaryWord = useCallback((entry: { id: string; headword: string; gloss: string }, context: string) => {
    const now = new Date().toISOString();
    commit((current) => {
      const existing = current.memories.find((item) => item.kind === "word" && item.linkedEntryId === entry.id);
      const memory: LocalMemory = {
        id: existing?.id ?? `memory-${entry.id}-${Date.now()}`,
        kind: "word",
        title: entry.headword,
        detail: entry.gloss,
        context,
        linkedEntryId: entry.id,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now
      };
      return {
        ...current,
        memories: existing ? current.memories.map((item) => item.id === existing.id ? memory : item) : [memory, ...current.memories]
      };
    });
  }, [commit]);

  const completeReview = useCallback((review: LocalReview, entry?: { id: string; headword: string; gloss: string }, context = "") => {
    const now = new Date().toISOString();
    return commit((current) => {
      let memories = current.memories;
      if (entry) {
        const existing = current.memories.find((item) => item.kind === "word" && item.linkedEntryId === entry.id);
        const memory: LocalMemory = {
          id: existing?.id ?? `memory-${entry.id}-${Date.now()}`,
          kind: "word",
          title: entry.headword,
          detail: entry.gloss,
          context,
          linkedEntryId: entry.id,
          createdAt: existing?.createdAt ?? now,
          updatedAt: now
        };
        memories = existing ? current.memories.map((item) => item.id === existing.id ? memory : item) : [memory, ...current.memories];
      }
      return { ...current, memories, reviews: [review, ...current.reviews], activeSession: null };
    });
  }, [commit]);

  const clearAll = useCallback(() => {
    const empty = createEmptyLocalData();
    try {
      window.localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(empty));
      dataRef.current = empty;
      setData(empty);
      setCorruptRaw(null);
      setSaveStatus({ kind: "ok", message: "All Kambradu data was cleared from this browser." });
    } catch {
      setSaveStatus({ kind: "error", message: "This browser could not clear the stored data." });
    }
  }, []);

  const restore = useCallback((raw: string) => {
    const restored = { ...parseImportedLocalData(raw), updatedAt: new Date().toISOString() };
    window.localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(restored));
    dataRef.current = restored;
    setData(restored);
    setCorruptRaw(null);
    setSaveStatus({ kind: "ok", message: "Backup restored in this browser." });
  }, []);

  const discardCorruptData = useCallback(() => {
    const empty = createEmptyLocalData();
    window.localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(empty));
    dataRef.current = empty;
    setData(empty);
    setCorruptRaw(null);
    setSaveStatus({ kind: "ok", message: "Unreadable data was replaced after you chose to start fresh." });
  }, []);

  const sortedMemories = useMemo(
    () => [...data.memories].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)),
    [data.memories]
  );

  return {
    data,
    sortedMemories,
    isHydrated,
    corruptRaw,
    saveStatus,
    addMemory,
    updateMemory,
    deleteMemory,
    addReview,
    setActiveSession,
    keepDictionaryWord,
    completeReview,
    clearAll,
    restore,
    discardCorruptData
  };
}
