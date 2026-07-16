import {
  kristangCommunity,
  lessonUnits,
  practicePrompts
} from "@/data/kristang";
import type {
  AccessLevel,
  ContentType,
  ContributionDraft,
  LearningCycle,
  LearningCycleFeedback,
  LearningCycleReviewStatus
} from "@/types/kambradu";

export const LEARNING_CYCLES_STORAGE_KEY = "kambradu-learning-cycles-v2";
export const ACTIVE_LEARNING_CYCLE_STORAGE_KEY = "kambradu-active-learning-cycle-v2";

const seedDate = "2026-05-17T00:00:00.000Z";

export const seedLearningCycles: LearningCycle[] = [
  {
    id: "cycles/kristang-melaka/demo/shop-visit",
    userId: "demo",
    communityId: kristangCommunity.id,
    title: "Shop visit",
    shortTitle: "Shop",
    lessonId: "shop-visit",
    practicePromptIds: ["read-sabang"],
    practiceReviewIds: [],
    journalEntryIds: [],
    personalLexiconEntryIds: [],
    speakerCheckIds: [],
    reviewStatus: "not-started",
    feedback: [],
    publicEntryIds: [],
    focus: ["sabang"],
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "cycles/kristang-melaka/demo/home-objects",
    userId: "demo",
    communityId: kristangCommunity.id,
    title: "Home objects",
    shortTitle: "Home",
    lessonId: "home-objects",
    practicePromptIds: ["meaning-janela"],
    practiceReviewIds: [],
    journalEntryIds: [],
    personalLexiconEntryIds: [],
    speakerCheckIds: [],
    reviewStatus: "not-started",
    feedback: [],
    publicEntryIds: [],
    focus: ["janela"],
    createdAt: seedDate,
    updatedAt: seedDate
  }
];

export const cycleReviewLabels: Record<LearningCycleReviewStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  submitted: "Submitted",
  "changes-requested": "Changes requested",
  approved: "Approved"
};

export function findCycleForLesson(cycles: LearningCycle[], lessonId: string) {
  return cycles.find((cycle) => cycle.lessonId === lessonId);
}

export function getCycleProgress(cycle: LearningCycle) {
  const checks = [
    Boolean(cycle.lessonId),
    cycle.practiceReviewIds.length > 0,
    cycle.journalEntryIds.length > 0,
    cycle.personalLexiconEntryIds.length > 0,
    cycle.speakerCheckIds.length > 0,
    Boolean(cycle.contributionId),
    cycle.reviewStatus === "changes-requested" || cycle.reviewStatus === "approved",
    cycle.reviewStatus === "approved"
  ];
  const completed = checks.filter(Boolean).length;

  return {
    completed,
    total: checks.length,
    percent: Math.round((completed / checks.length) * 100)
  };
}

export function getNextCycleAction(cycle: LearningCycle) {
  if (cycle.reviewStatus === "approved") {
    return { label: "Locally reviewed", detail: "This draft stays on this device until community governance is in place.", href: "/builder" };
  }

  if (cycle.reviewStatus === "changes-requested") {
    return { label: "Revise with feedback", detail: "Resolve steward notes before resubmitting.", href: "/builder" };
  }

  if (!cycle.practiceReviewIds.length) {
    return { label: "Complete practice", detail: "Open the prompt linked to this lesson.", href: "/practice" };
  }

  if (!cycle.journalEntryIds.length) {
    return { label: "Add a note", detail: "Keep the context you want to remember.", href: "/journal" };
  }

  if (!cycle.personalLexiconEntryIds.length) {
    return { label: "Build entry", detail: "Attach one private mini-dictionary entry.", href: "/builder" };
  }

  if (!cycle.speakerCheckIds.length) {
    return { label: "Speaker check", detail: "Ask the consent and pronunciation question.", href: "/practice" };
  }

  if (!cycle.contributionId) {
    return { label: "Submit packet", detail: "Prepare the steward-review packet from cycle data.", href: "/contribute" };
  }

  return { label: "Steward review", detail: "Submitted locally and waiting for a steward decision.", href: "/steward" };
}

export function startCycle(cycle: LearningCycle) {
  return touchCycle({
    ...cycle,
    reviewStatus: cycle.reviewStatus === "not-started" ? "in-progress" : cycle.reviewStatus
  });
}

export function attachUniqueId(cycle: LearningCycle, key: keyof Pick<
  LearningCycle,
  "practiceReviewIds" | "journalEntryIds" | "personalLexiconEntryIds" | "speakerCheckIds"
>, id: string) {
  if (cycle[key].includes(id)) {
    return cycle;
  }

  return touchCycle({
    ...cycle,
    [key]: [id, ...cycle[key]],
    reviewStatus: cycle.reviewStatus === "not-started" ? "in-progress" : cycle.reviewStatus
  });
}

export function submitCycle(cycle: LearningCycle, draft: ContributionDraft) {
  const contributionId = cycle.contributionId ?? `contributions/${stableSlug(draft.title || cycle.title)}-${Date.now()}`;

  return touchCycle({
    ...cycle,
    contributionId,
    reviewStatus: "submitted",
    submission: {
      contentType: draft.contentType,
      title: draft.title.trim() || cycle.title,
      body: draft.body.trim(),
      englishGloss: draft.englishGloss?.trim(),
      provenance: draft.provenance.trim(),
      consent: draft.consent.trim(),
      access: draft.access,
      attributionName: draft.attributionName.trim() || "Local learner",
      submittedAt: new Date().toISOString()
    }
  });
}

export function requestCycleChanges(cycle: LearningCycle, message: string) {
  const feedback: LearningCycleFeedback = {
    id: `feedback/${stableSlug(cycle.title)}/${Date.now()}`,
    stewardName: "Local steward",
    message: message.trim() || "Please add one clearer source, consent, or usage note before approval.",
    createdAt: new Date().toISOString()
  };

  return touchCycle({
    ...cycle,
    reviewStatus: "changes-requested",
    feedback: [feedback, ...cycle.feedback]
  });
}

export function markCycleRevised(cycle: LearningCycle) {
  if (cycle.reviewStatus !== "changes-requested") {
    return cycle;
  }

  return touchCycle({
    ...cycle,
    reviewStatus: "submitted",
    feedback: cycle.feedback.map((item, index) => (index === 0 && !item.resolvedAt ? { ...item, resolvedAt: new Date().toISOString() } : item)),
    submission: cycle.submission ? { ...cycle.submission, revisedAt: new Date().toISOString() } : cycle.submission
  });
}

export function approveCycle(cycle: LearningCycle) {
  return touchCycle({
    ...cycle,
    reviewStatus: "approved",
    publicEntryIds: [],
    feedback: cycle.feedback.map((item) => (item.resolvedAt ? item : { ...item, resolvedAt: new Date().toISOString() }))
  });
}

export function buildContributionDraftFromCycle(cycle: LearningCycle): ContributionDraft {
  const lesson = lessonUnits.find((item) => item.id === cycle.lessonId);
  const prompt = practicePrompts.find((item) => cycle.practicePromptIds.includes(item.id));
  const contentType: ContentType = lesson?.kind === "culture" ? "note" : lesson?.kind ?? "phrase";
  const access: AccessLevel = lesson?.access ?? "restricted";

  return {
    id: cycle.contributionId,
    communityId: cycle.communityId,
    contentType,
    title: cycle.submission?.title ?? prompt?.headword ?? cycle.focus[0] ?? cycle.title,
    body: cycle.submission?.body ?? prompt?.example ?? `Local learning-cycle packet for ${cycle.title}.`,
    englishGloss: cycle.submission?.englishGloss ?? prompt?.englishGloss,
    provenance:
      cycle.submission?.provenance ??
      `Built from lesson ${cycle.lessonId}, practice prompts ${cycle.practicePromptIds.join(", ")}, private notes, personal lexicon entries, and speaker checks on this device.`,
    consent:
      cycle.submission?.consent ??
      "Local prototype packet. Confirm speaker consent before publishing beyond this browser.",
    access,
    attributionName: cycle.submission?.attributionName ?? "Local learner",
    reviewStatus: cycle.reviewStatus === "submitted" || cycle.reviewStatus === "approved" ? "submitted" : "draft",
    submittedBy: cycle.userId,
    createdAt: cycle.createdAt,
    updatedAt: cycle.updatedAt
  };
}

function touchCycle(cycle: LearningCycle): LearningCycle {
  return {
    ...cycle,
    updatedAt: new Date().toISOString()
  };
}

function stableSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
