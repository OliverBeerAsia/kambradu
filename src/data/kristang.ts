import type {
  AccessLevel,
  Attribution,
  ContributionDraft,
  Goal,
  JournalEntry,
  LearningTask,
  LessonUnit,
  LexicalEntry,
  PersonalLexiconEntry,
  PracticePrompt,
  SavedWord,
  Story
} from "@/types/kambradu";

export const kristangCommunity = {
  id: "kristang-melaka",
  name: "Kristang",
  languageName: "Kristang",
  region: "Melaka, Malaysia",
  publicDescription:
    "An independent prototype for learning Kristang and keeping personal language memories. Community partnership and review are still to be established.",
  defaultAccess: "restricted" as AccessLevel
};

export const dictionaryAttribution: Attribution = {
  label: "Baxter and de Silva Kristang dictionary",
  authors: "Alan N. Baxter and Patrick de Silva",
  publisher: "Pacific Linguistics, The Australian National University",
  year: "2005; online edition 2015",
  doi: "10.15144/PL-564.cover",
  url: "https://doi.org/10.15144/PL-564.cover",
  license: "CC BY-SA 4.0",
  locator: "Dictionary entry for the headword"
};

const sourceCheckedEvidence = {
  source_transcribed: true,
  source_checked: true,
  speaker_attested: false,
  partner_reviewed: false,
  public_use_allowed: true
} as const;

export const publicLexiconEntries: LexicalEntry[] = [
  {
    id: "sabang",
    communityId: kristangCommunity.id,
    headword: "sabang",
    normalizedHeadword: "sabang",
    englishGlosses: ["soap"],
    partOfSpeech: "noun",
    alternateSpellings: [],
    source: dictionaryAttribution,
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["daily life", "dictionary-listed"]
  },
  {
    id: "janela",
    communityId: kristangCommunity.id,
    headword: "janela",
    normalizedHeadword: "janela",
    englishGlosses: ["window"],
    partOfSpeech: "noun",
    alternateSpellings: [],
    source: dictionaryAttribution,
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["home", "dictionary-listed"]
  }
];

export const publicStories: Story[] = [];

export const starterSavedWords: SavedWord[] = [];

export const starterJournalEntries: JournalEntry[] = [];

export const starterGoals: Goal[] = [
  {
    id: "daily-review",
    userId: "demo",
    communityId: kristangCommunity.id,
    label: "Review saved words",
    targetCount: 8,
    completedCount: 5,
    cadence: "daily"
  },
  {
    id: "weekly-recording",
    userId: "demo",
    communityId: kristangCommunity.id,
    label: "Keep a Kristang note",
    targetCount: 2,
    completedCount: 1,
    cadence: "weekly"
  }
];

export const starterBuilderEntries: PersonalLexiconEntry[] = [];

export const starterLearningTasks: LearningTask[] = [
  {
    id: "listen-shop-phrase",
    title: "Meet a shop word",
    track: "listen",
    minutes: 5,
    detail: "Read sabang and keep one place it might fit.",
    completed: false
  },
  {
    id: "review-saved",
    title: "Review saved words",
    track: "review",
    minutes: 8,
    detail: "Review sabang and janela.",
    completed: true
  },
  {
    id: "journal-family-context",
    title: "Keep a memory",
    track: "journal",
    minutes: 10,
    detail: "Write down one word, person, place, or moment you want to remember.",
    completed: false
  },
  {
    id: "record-speaker-check",
    title: "Keep a question for later",
    track: "record",
    minutes: 7,
    detail: "Save one question you may choose to ask someone.",
    completed: false
  },
  {
    id: "culture-note",
    title: "Add some context",
    track: "culture",
    minutes: 6,
    detail: "Connect a word to a person, place, situation, source, or practice.",
    completed: false
  }
];

export const practicePrompts: PracticePrompt[] = [
  {
    id: "read-sabang",
    communityId: kristangCommunity.id,
    lexicalEntryId: "sabang",
    lessonId: "shop-visit",
    title: "Keep a shop word",
    headword: "sabang",
    englishGloss: "soap",
    promptKind: "meaning-recall",
    listenCue: "This word is listed in the reference dictionary.",
    hasAudio: false,
    access: "open",
    source: dictionaryAttribution,
    focus: ["sabang"],
    speakerQuestion: "How is sabang used today?"
  },
  {
    id: "meaning-janela",
    communityId: kristangCommunity.id,
    lexicalEntryId: "janela",
    lessonId: "home-objects",
    title: "Recall a home object",
    headword: "janela",
    englishGloss: "window",
    promptKind: "meaning-recall",
    listenCue: "Look at the English meaning, then recall the Kristang word before revealing it.",
    hasAudio: false,
    access: "open",
    source: dictionaryAttribution,
    focus: ["home", "objects"],
    speakerQuestion: "How is janela used today?"
  }
];

export const lessonUnits: LessonUnit[] = [
  {
    id: "shop-visit",
    title: "Meet sabang",
    kind: "word",
    level: "starter",
    summary: "Meet a dictionary-listed Kristang word and decide what you want to remember.",
    focus: ["sabang"],
    estimatedMinutes: 3,
    source: dictionaryAttribution,
    access: "open"
  },
  {
    id: "home-objects",
    title: "Meet janela",
    kind: "word",
    level: "starter",
    summary: "Meet a dictionary-listed home word and keep your own context note.",
    focus: ["janela"],
    estimatedMinutes: 3,
    source: dictionaryAttribution,
    access: "open"
  }
];

export const reviewQueueSeed: ContributionDraft[] = [];
