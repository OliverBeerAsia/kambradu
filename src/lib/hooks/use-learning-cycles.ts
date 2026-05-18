"use client";

import { useCallback, useMemo } from "react";
import {
  ACTIVE_LEARNING_CYCLE_STORAGE_KEY,
  LEARNING_CYCLES_STORAGE_KEY,
  attachUniqueId,
  buildContributionDraftFromCycle,
  findCycleForLesson,
  seedLearningCycles,
  startCycle
} from "@/lib/learning-cycles";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import type { ContributionDraft, LearningCycle } from "@/types/kambradu";

export function useLearningCycles() {
  const [cycles, setCycles] = useLocalStorageState<LearningCycle[]>(LEARNING_CYCLES_STORAGE_KEY, seedLearningCycles);
  const [activeCycleId, setActiveCycleId] = useLocalStorageState(ACTIVE_LEARNING_CYCLE_STORAGE_KEY, seedLearningCycles[0].id);
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) ?? cycles[0] ?? seedLearningCycles[0];

  const updateCycle = useCallback(
    (cycleId: string, updater: (cycle: LearningCycle) => LearningCycle) => {
      setCycles((current) => current.map((cycle) => (cycle.id === cycleId ? updater(cycle) : cycle)));
    },
    [setCycles]
  );

  const startOrResumeLesson = useCallback(
    (lessonId: string) => {
      const nextCycle = cycles.find((cycle) => cycle.lessonId === lessonId);

      if (!nextCycle) {
        return;
      }

      setActiveCycleId(nextCycle.id);
      setCycles((current) =>
        current.map((cycle) => {
          return cycle.lessonId === lessonId ? startCycle(cycle) : cycle;
        })
      );
    },
    [cycles, setActiveCycleId, setCycles]
  );

  const setActiveCycle = useCallback(
    (cycleId: string) => {
      setActiveCycleId(cycleId);
      updateCycle(cycleId, startCycle);
    },
    [setActiveCycleId, updateCycle]
  );

  const attachPracticeReview = useCallback(
    (reviewId: string, cycleId = activeCycle.id) => {
      updateCycle(cycleId, (cycle) => attachUniqueId(cycle, "practiceReviewIds", reviewId));
    },
    [activeCycle.id, updateCycle]
  );

  const attachJournalEntry = useCallback(
    (entryId: string, cycleId = activeCycle.id) => {
      updateCycle(cycleId, (cycle) => attachUniqueId(cycle, "journalEntryIds", entryId));
    },
    [activeCycle.id, updateCycle]
  );

  const attachPersonalLexiconEntry = useCallback(
    (entryId: string, cycleId = activeCycle.id) => {
      updateCycle(cycleId, (cycle) => attachUniqueId(cycle, "personalLexiconEntryIds", entryId));
    },
    [activeCycle.id, updateCycle]
  );

  const attachSpeakerCheck = useCallback(
    (checkId: string, cycleId = activeCycle.id) => {
      updateCycle(cycleId, (cycle) => attachUniqueId(cycle, "speakerCheckIds", checkId));
    },
    [activeCycle.id, updateCycle]
  );

  const activeContributionDraft = useMemo<ContributionDraft>(() => buildContributionDraftFromCycle(activeCycle), [activeCycle]);

  return {
    cycles,
    activeCycle,
    activeCycleId,
    activeContributionDraft,
    setCycles,
    setActiveCycle,
    setActiveCycleId,
    updateCycle,
    startOrResumeLesson,
    attachPracticeReview,
    attachJournalEntry,
    attachPersonalLexiconEntry,
    attachSpeakerCheck,
    findCycleForLesson: (lessonId: string) => findCycleForLesson(cycles, lessonId)
  };
}
