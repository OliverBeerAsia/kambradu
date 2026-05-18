import type {
  AccessLevel,
  Attribution,
  ContributionDraft,
  Goal,
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
  name: "Kristang / Melaka",
  languageName: "Kristang",
  region: "Melaka, Malaysia",
  publicDescription:
    "A public-first space for approved Kristang words, phrases, stories, and learner notes, with community review before publication.",
  defaultAccess: "community" as AccessLevel
};

export const dictionaryAttribution: Attribution = {
  label: "Baxter and de Silva Kristang dictionary",
  authors: "Alan N. Baxter and Patrick de Silva",
  publisher: "Pacific Linguistics, The Australian National University",
  year: "2005; online edition 2015",
  doi: "10.15144/PL-564.cover",
  url: "https://doi.org/10.15144/PL-564.cover",
  license: "CC BY-SA 4.0"
};

export const communityAttribution: Attribution = {
  label: "Kambradu community contribution",
  license: "Contributor consent required before publication"
};

export const publicLexiconEntries: LexicalEntry[] = [
  {
    id: "loja",
    communityId: kristangCommunity.id,
    headword: "loja",
    normalizedHeadword: "loja",
    englishGlosses: ["shop", "store"],
    partOfSpeech: "noun",
    pronunciation: "LO-zha",
    alternateSpellings: [],
    example: "Nha mae bai loja kompra sabang.",
    exampleTranslation: "My mother went to the shop to buy soap.",
    source: dictionaryAttribution,
    access: "open",
    reviewStatus: "approved",
    hasAudio: false,
    tags: ["place", "daily life"]
  },
  {
    id: "balcao",
    communityId: kristangCommunity.id,
    headword: "balcao",
    normalizedHeadword: "balcao",
    englishGlosses: ["counter", "shop counter"],
    partOfSpeech: "noun",
    pronunciation: "bal-KAO",
    alternateSpellings: ["balkau"],
    source: dictionaryAttribution,
    access: "open",
    reviewStatus: "approved",
    hasAudio: true,
    tags: ["shop", "objects"]
  },
  {
    id: "kalderada",
    communityId: kristangCommunity.id,
    headword: "kalderada",
    normalizedHeadword: "kalderada",
    englishGlosses: ["fish stew"],
    partOfSpeech: "noun",
    alternateSpellings: ["calderada"],
    source: communityAttribution,
    access: "community",
    reviewStatus: "approved",
    hasAudio: true,
    tags: ["food", "home"]
  },
  {
    id: "rua-direita",
    communityId: kristangCommunity.id,
    headword: "rua Direita",
    normalizedHeadword: "rua direita",
    englishGlosses: ["main street"],
    partOfSpeech: "noun phrase",
    alternateSpellings: [],
    source: communityAttribution,
    access: "open",
    reviewStatus: "approved",
    hasAudio: false,
    tags: ["place", "Melaka"]
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
    reviewStatus: "approved",
    hasAudio: false,
    tags: ["home", "objects"]
  },
  {
    id: "papiá",
    communityId: kristangCommunity.id,
    headword: "papiá",
    normalizedHeadword: "papia",
    englishGlosses: ["speak", "talk"],
    partOfSpeech: "verb",
    alternateSpellings: ["papia"],
    source: dictionaryAttribution,
    access: "open",
    reviewStatus: "approved",
    hasAudio: false,
    tags: ["conversation"]
  }
];

export const publicStories: Story[] = [
  {
    id: "festa-sao-joao",
    communityId: kristangCommunity.id,
    title: "Festa di Sao Joao",
    summary: "A short community story seed for public browsing and future recorded narration.",
    kind: "story",
    body: "A family gathers, prepares food, and remembers the songs attached to the festa.",
    translation: "Draft English summary for learner context.",
    contributor: "Kambradu seed set",
    access: "open",
    reviewStatus: "approved",
    source: communityAttribution,
    tags: ["story", "festival"]
  },
  {
    id: "shop-phrase",
    communityId: kristangCommunity.id,
    title: "At the shop",
    summary: "A phrase card built around everyday buying and greeting language.",
    kind: "phrase",
    body: "Nha mae bai loja kompra sabang.",
    translation: "My mother went to the shop to buy soap.",
    contributor: "Kambradu seed set",
    access: "open",
    reviewStatus: "approved",
    source: dictionaryAttribution,
    tags: ["phrase", "daily life"]
  }
];

export const starterSavedWords: SavedWord[] = [
  {
    id: "saved-loja",
    userId: "demo",
    lexicalEntryId: "loja",
    headword: "loja",
    englishGloss: "shop",
    nextReviewAt: "Today",
    confidence: "learning"
  },
  {
    id: "saved-balcao",
    userId: "demo",
    lexicalEntryId: "balcao",
    headword: "balcao",
    englishGloss: "counter",
    nextReviewAt: "Tomorrow",
    confidence: "new"
  },
  {
    id: "saved-janela",
    userId: "demo",
    lexicalEntryId: "janela",
    headword: "janela",
    englishGloss: "window",
    nextReviewAt: "Friday",
    confidence: "steady"
  }
];

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
    label: "Record a family phrase",
    targetCount: 2,
    completedCount: 1,
    cadence: "weekly"
  }
];

export const starterBuilderEntries: PersonalLexiconEntry[] = [
  {
    id: "personal-teng-bong",
    userId: "demo",
    communityId: kristangCommunity.id,
    headword: "teng bong",
    englishGloss: "good morning",
    alternateSpellings: "teng bom",
    example: "Teng bong, kumé bos?",
    sourceNote: "Family greeting note. Needs speaker audio before public submission.",
    access: "community",
    status: "private",
    createdAt: "2026-05-17"
  },
  {
    id: "personal-sabang",
    userId: "demo",
    communityId: kristangCommunity.id,
    headword: "sabang",
    englishGloss: "soap",
    alternateSpellings: "",
    example: "Nha mae bai loja kompra sabang.",
    sourceNote: "Linked to the shop phrase lesson and dictionary-derived example.",
    access: "open",
    status: "ready",
    createdAt: "2026-05-17"
  }
];

export const starterLearningTasks: LearningTask[] = [
  {
    id: "listen-shop-phrase",
    title: "Listen to the shop phrase",
    track: "listen",
    minutes: 5,
    detail: "Replay the loja example and say it aloud three times.",
    completed: false
  },
  {
    id: "review-saved",
    title: "Review saved words",
    track: "review",
    minutes: 8,
    detail: "Run through loja, balcao, janela, and papia before adding new words.",
    completed: true
  },
  {
    id: "journal-family-context",
    title: "Journal one family context",
    track: "journal",
    minutes: 10,
    detail: "Write where you would naturally use the greeting or phrase.",
    completed: false
  },
  {
    id: "record-speaker-check",
    title: "Record a speaker check",
    track: "record",
    minutes: 7,
    detail: "Ask for one pronunciation or usage note and keep it private until consent is clear.",
    completed: false
  },
  {
    id: "culture-note",
    title: "Add a culture note",
    track: "culture",
    minutes: 6,
    detail: "Connect one word to a dish, place, song, or family practice.",
    completed: false
  }
];

export const practicePrompts: PracticePrompt[] = [
  {
    id: "listen-loja",
    communityId: kristangCommunity.id,
    lexicalEntryId: "loja",
    lessonId: "shop-visit",
    title: "Hear the shop phrase",
    headword: "loja",
    englishGloss: "shop, store",
    promptKind: "listen-recall",
    listenCue: "Play the phrase first. Keep the text hidden until you can say what you heard.",
    example: "Nha mae bai loja kompra sabang.",
    exampleTranslation: "My mother went to the shop to buy soap.",
    hasAudio: false,
    access: "open",
    source: dictionaryAttribution,
    focus: ["loja", "kompra", "sabang"],
    speakerQuestion: "Can you confirm how your family would pronounce loja in this phrase?"
  },
  {
    id: "repeat-teng-bong",
    communityId: kristangCommunity.id,
    lexicalEntryId: "personal-teng-bong",
    lessonId: "family-greeting",
    title: "Repeat a family greeting",
    headword: "teng bong",
    englishGloss: "good morning",
    promptKind: "speak-repeat",
    listenCue: "Say the greeting aloud, then write where it would naturally fit.",
    example: "Teng bong, kumé bos?",
    exampleTranslation: "Good morning, how are you?",
    hasAudio: false,
    access: "community",
    source: communityAttribution,
    focus: ["greeting", "family", "speaker check"],
    speakerQuestion: "Is teng bong the right greeting here, and are there family spellings I should preserve?"
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
    example: "Nha janela sta abertu.",
    exampleTranslation: "My window is open.",
    hasAudio: false,
    access: "open",
    source: dictionaryAttribution,
    focus: ["home", "objects"],
    speakerQuestion: "Would you use janela in this sentence, or is there a more natural family phrase?"
  }
];

export const lessonUnits: LessonUnit[] = [
  {
    id: "shop-visit",
    title: "Shop visit micro-lesson",
    kind: "phrase",
    level: "starter",
    summary: "Learn a short everyday phrase around buying something at the shop.",
    focus: ["loja", "kompra", "sabang"],
    estimatedMinutes: 12,
    source: dictionaryAttribution,
    access: "open"
  },
  {
    id: "home-objects",
    title: "Home objects",
    kind: "word",
    level: "starter",
    summary: "Build a small personal list from common household words and pronunciation checks.",
    focus: ["janela", "sabang", "balcao"],
    estimatedMinutes: 10,
    source: dictionaryAttribution,
    access: "open"
  },
  {
    id: "family-greeting",
    title: "Family greeting practice",
    kind: "phrase",
    level: "building",
    summary: "Turn a greeting into a journal note, audio check, and private mini-dictionary entry.",
    focus: ["teng bong", "kumé bos", "papiá"],
    estimatedMinutes: 15,
    source: communityAttribution,
    access: "community"
  },
  {
    id: "festa-story",
    title: "Festa story seed",
    kind: "story",
    level: "community",
    summary: "Read a story seed and prepare questions for a speaker or steward before publication.",
    focus: ["story", "food", "songs"],
    estimatedMinutes: 18,
    source: communityAttribution,
    access: "community"
  }
];

export const reviewQueueSeed: ContributionDraft[] = [
  {
    id: "recipe-card",
    communityId: kristangCommunity.id,
    contentType: "note",
    title: "karta di receita",
    body: "Photo and transcription notes for a family recipe card.",
    englishGloss: "recipe card",
    provenance: "Submitted by Joana F. from a family notebook.",
    consent: "Contributor confirms permission for community review.",
    access: "community",
    attributionName: "Joana F.",
    reviewStatus: "submitted",
    submittedBy: "demo"
  },
  {
    id: "tio-manuel",
    communityId: kristangCommunity.id,
    contentType: "story",
    title: "Entrevista: Tio Manuel",
    body: "Short oral-history clip awaiting transcription and consent check.",
    provenance: "Recorded interview with speaker consent.",
    consent: "Audio can be stored for review; publication needs final steward approval.",
    access: "restricted",
    attributionName: "Luis P.",
    reviewStatus: "submitted",
    submittedBy: "demo"
  },
  {
    id: "janela-contribution",
    communityId: kristangCommunity.id,
    contentType: "word",
    title: "janela",
    body: "Suggested pronunciation note and example sentence.",
    englishGloss: "window",
    provenance: "Learner note cross-checked against public dictionary source.",
    consent: "Text-only contribution; attribution approved.",
    access: "open",
    attributionName: "Aisha K.",
    reviewStatus: "submitted",
    submittedBy: "demo"
  }
];
