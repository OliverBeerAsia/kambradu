import type {
  AccessLevel,
  Attribution,
  ContributionDraft,
  JournalEntry,
  LessonUnit,
  LexicalEntry,
  OrthographyProfile,
  OrthographyProfileId,
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
    "An independent place to learn Kristang and keep personal language memories. Community partnership and review are still to be established.",
  defaultAccess: "restricted" as AccessLevel
};

export const orthographyProfiles: Record<OrthographyProfileId, OrthographyProfile> = {
  "baxter-2005": {
    id: "baxter-2005",
    label: "Baxter and de Silva spelling",
    description:
      "A Malay-based spelling, and the one the Kodrah Kristang revitalisation initiative works in. The printed dictionary underlines the stressed syllable, and a final h marks stress on the last syllable, as in papiah.",
    basedOn: "Bahasa Melayu, after Hancock (1973), Baxter (1988) and Marbeck (1995)"
  },
  marbeck: {
    id: "marbeck",
    label: "Marbeck spelling",
    description:
      "A Malay-based spelling used in Joan Margaret Marbeck's community materials. It differs from Baxter in places, writing kacoru where Baxter writes kachoru.",
    basedOn: "Joan Margaret Marbeck, community publications"
  }
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

/** Per-entry citation. The page is the printed page, not the PDF page. */
function citation(page: number, headword: string): Attribution {
  return {
    ...dictionaryAttribution,
    locator: `Headword ${headword}, page ${page}`,
    page,
    checkedBy: "Oliver",
    checkedAt: "2026-08-19"
  };
}

const sourceCheckedEvidence = {
  source_transcribed: true,
  source_checked: true,
  speaker_attested: false,
  partner_reviewed: false,
  public_use_allowed: true
} as const;

export const publicLexiconEntries: LexicalEntry[] = [
  {
    id: "agu",
    communityId: kristangCommunity.id,
    headword: "agu",
    normalizedHeadword: "agu",
    englishGlosses: ["water"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 1 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(3, "agu"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["daily life", "dictionary-listed"]
  },
  {
    id: "aros",
    communityId: kristangCommunity.id,
    headword: "aros",
    normalizedHeadword: "aros",
    englishGlosses: ["rice"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 1, end: 4 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(8, "aros"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["food", "dictionary-listed"]
  },
  {
    id: "bong",
    communityId: kristangCommunity.id,
    headword: "bong",
    normalizedHeadword: "bong",
    englishGlosses: ["good", "well"],
    partOfSpeech: "adjective",
    orthography: "baxter-2005",
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "Bong dia!", gloss: "Good day!" },
      { form: "Bong anuti!", gloss: "Good night!" }
    ],
    examples: [],
    source: citation(18, "bong"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["greetings", "dictionary-listed"]
  },
  {
    id: "chua",
    communityId: kristangCommunity.id,
    headword: "chua",
    normalizedHeadword: "chua",
    englishGlosses: ["rain"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 3 },
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "chua finu finu", gloss: "drizzle" }
    ],
    examples: [],
    source: citation(22, "chua"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["weather", "dictionary-listed"]
  },
  {
    id: "fila",
    communityId: kristangCommunity.id,
    headword: "fila",
    normalizedHeadword: "fila",
    englishGlosses: ["daughter"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 2 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(32, "fila"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["family", "dictionary-listed"]
  },
  {
    id: "filu",
    communityId: kristangCommunity.id,
    headword: "filu",
    normalizedHeadword: "filu",
    englishGlosses: ["son"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 2 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(32, "filu"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["family", "dictionary-listed"]
  },
  {
    id: "galinya",
    communityId: kristangCommunity.id,
    headword: "galinya",
    normalizedHeadword: "galinya",
    englishGlosses: ["hen"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 2, end: 4 },
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "galinya choka", gloss: "brooding hen" }
    ],
    examples: [],
    source: citation(35, "galinya"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["food", "animals", "dictionary-listed"]
  },
  {
    id: "gatu",
    communityId: kristangCommunity.id,
    headword: "gatu",
    normalizedHeadword: "gatu",
    englishGlosses: ["cat"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 2 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(36, "gatu"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["animals", "dictionary-listed"]
  },
  {
    id: "irmang",
    communityId: kristangCommunity.id,
    headword: "irmang",
    normalizedHeadword: "irmang",
    englishGlosses: ["sibling"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 2, end: 6 },
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "irmang ku irmang", gloss: "brother and sister" }
    ],
    examples: [],
    source: citation(40, "irmang"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["family", "dictionary-listed"]
  },
  {
    id: "kabesa",
    communityId: kristangCommunity.id,
    headword: "kabesa",
    normalizedHeadword: "kabesa",
    englishGlosses: ["head"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 2, end: 4 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(42, "kabesa"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["body", "dictionary-listed"]
  },
  {
    id: "kadera",
    communityId: kristangCommunity.id,
    headword: "kadera",
    normalizedHeadword: "kadera",
    englishGlosses: ["chair"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 2, end: 4 },
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "kadera ku brasu", gloss: "armchair" }
    ],
    examples: [],
    source: citation(43, "kadera"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["home", "dictionary-listed"]
  },
  {
    id: "kambradu",
    communityId: kristangCommunity.id,
    headword: "kambradu",
    normalizedHeadword: "kambradu",
    englishGlosses: ["friend"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 3, end: 6 },
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "kambradu femi", gloss: "female friend" },
      { form: "kambradu machu", gloss: "male friend" }
    ],
    examples: [],
    source: citation(44, "kambradu"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["people", "dictionary-listed"]
  },
  {
    id: "kandri",
    communityId: kristangCommunity.id,
    headword: "kandri",
    normalizedHeadword: "kandri",
    englishGlosses: ["meat", "flesh"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 3 },
    alternateSpellings: [],
    variants: [
      {
        form: "karni",
        orthography: "baxter-2005",
        kind: "form",
        note: "The dictionary gives karni beside kandri. The consonants are ordered differently, so it is a different form rather than a different spelling."
      }
    ],
    collocations: [],
    examples: [],
    source: citation(44, "kandri"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["food", "dictionary-listed"]
  },
  {
    id: "kaza",
    communityId: kristangCommunity.id,
    headword: "kaza",
    normalizedHeadword: "kaza",
    englishGlosses: ["house", "home"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 2 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(47, "kaza"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["home", "dictionary-listed"]
  },
  {
    id: "krensa",
    communityId: kristangCommunity.id,
    headword: "krensa",
    normalizedHeadword: "krensa",
    englishGlosses: ["baby", "child"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 4 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(51, "krensa"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["family", "dictionary-listed"]
  },
  {
    id: "mai",
    communityId: kristangCommunity.id,
    headword: "mai",
    normalizedHeadword: "mai",
    englishGlosses: ["mother"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(57, "mai"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["family", "dictionary-listed"]
  },
  {
    id: "mang",
    communityId: kristangCommunity.id,
    headword: "mang",
    normalizedHeadword: "mang",
    englishGlosses: ["hand"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "mang dretu", gloss: "right hand" }
    ],
    examples: [],
    source: citation(58, "mang"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["body", "dictionary-listed"]
  },
  {
    id: "meza",
    communityId: kristangCommunity.id,
    headword: "meza",
    normalizedHeadword: "meza",
    englishGlosses: ["table"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 2 },
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "faka di meza", gloss: "table knife" }
    ],
    examples: [],
    source: citation(60, "meza"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["home", "dictionary-listed"]
  },
  {
    id: "pai",
    communityId: kristangCommunity.id,
    headword: "pai",
    normalizedHeadword: "pai",
    englishGlosses: ["father"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(68, "pai"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["family", "dictionary-listed"]
  },
  {
    id: "pang",
    communityId: kristangCommunity.id,
    headword: "pang",
    normalizedHeadword: "pang",
    englishGlosses: ["bread"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "pang duru", gloss: "stale bread" },
      { form: "pang moli", gloss: "fresh bread" }
    ],
    examples: [],
    source: citation(69, "pang"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["food", "dictionary-listed"]
  },
  {
    id: "papiah",
    communityId: kristangCommunity.id,
    headword: "papiah",
    normalizedHeadword: "papiah",
    englishGlosses: ["to speak"],
    partOfSpeech: "verb",
    orthography: "baxter-2005",
    stress: { start: 4, end: 6 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(69, "papiah"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["daily life", "dictionary-listed"]
  },
  {
    id: "pesi",
    communityId: kristangCommunity.id,
    headword: "pesi",
    normalizedHeadword: "pesi",
    englishGlosses: ["fish"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 2 },
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: citation(72, "pesi"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["food", "dictionary-listed"]
  },
  {
    id: "porta",
    communityId: kristangCommunity.id,
    headword: "porta",
    normalizedHeadword: "porta",
    englishGlosses: ["door"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 3 },
    alternateSpellings: [],
    variants: [
      {
        form: "potra",
        orthography: "baxter-2005",
        kind: "form",
        note: "The dictionary gives potra beside porta. The consonants are ordered differently, so it is a different form rather than a different spelling."
      }
    ],
    collocations: [
      { form: "porta frenti", gloss: "front door" },
      { form: "porta tras", gloss: "back door" }
    ],
    examples: [],
    source: citation(74, "porta"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["home", "dictionary-listed"]
  },
  {
    id: "ropa",
    communityId: kristangCommunity.id,
    headword: "ropa",
    normalizedHeadword: "ropa",
    englishGlosses: ["clothing"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 0, end: 2 },
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "ropa suzu", gloss: "soiled clothes" }
    ],
    examples: [],
    source: citation(78, "ropa"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["daily life", "dictionary-listed"]
  },
  {
    id: "sol",
    communityId: kristangCommunity.id,
    headword: "sol",
    normalizedHeadword: "sol",
    englishGlosses: ["sun"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "diseh sol", gloss: "sunset" }
    ],
    examples: [],
    source: citation(83, "sol"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["weather", "dictionary-listed"]
  },
  {
    id: "teng",
    communityId: kristangCommunity.id,
    headword: "teng",
    normalizedHeadword: "teng",
    englishGlosses: ["to be"],
    partOfSpeech: "verb",
    orthography: "baxter-2005",
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [
      { text: "Teng bong?", translation: "How are you? Are you well?", page: 86 }
    ],
    source: citation(86, "teng"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["greetings", "dictionary-listed"]
  },
  {
    id: "sabang",
    communityId: kristangCommunity.id,
    headword: "sabang",
    normalizedHeadword: "sabang",
    englishGlosses: ["soap"],
    partOfSpeech: "noun",
    orthography: "baxter-2005",
    stress: { start: 2, end: 6 },
    alternateSpellings: [],
    variants: [],
    collocations: [
      { form: "agu di sabang", gloss: "soap suds" },
      { form: "bola di sabang", gloss: "soap bubble" }
    ],
    examples: [],
    source: citation(78, "sabang"),
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
    orthography: "baxter-2005",
    stress: { start: 2, end: 4 },
    alternateSpellings: [],
    variants: [],
    collocations: [{ form: "panu janela", gloss: "window curtain" }],
    examples: [
      {
        text: "Fazeh diseh janela!",
        translation: "Lower the window!",
        headword: "diseh",
        page: 26
      }
    ],
    source: citation(41, "janela"),
    access: "open",
    evidence: sourceCheckedEvidence,
    hasAudio: false,
    tags: ["home", "dictionary-listed"]
  }
];

export const publicStories: Story[] = [];

export const starterSavedWords: SavedWord[] = [];

export const starterJournalEntries: JournalEntry[] = [];


export const starterBuilderEntries: PersonalLexiconEntry[] = [];


/**
 * Lessons and prompts are derived from the lexicon so that adding a word does
 * not mean hand-writing a lesson, a prompt and a route for it.
 * The lesson id is the entry id.
 */
export const practicePrompts: PracticePrompt[] = publicLexiconEntries.map((entry) => ({
  id: entry.id,
  communityId: entry.communityId,
  lexicalEntryId: entry.id,
  lessonId: entry.id,
  title: `Meet ${entry.headword}`,
  headword: entry.headword,
  englishGloss: entry.englishGlosses[0],
  promptKind: "meaning-recall",
  listenCue: "This word is listed in the reference dictionary.",
  hasAudio: false,
  access: entry.access,
  source: entry.source,
  focus: [entry.id],
  speakerQuestion: `How is ${entry.headword} used today?`
}));

export const lessonUnits: LessonUnit[] = publicLexiconEntries.map((entry) => ({
  id: entry.id,
  title: `Meet ${entry.headword}`,
  kind: "word",
  level: "starter",
  summary: `Meet a dictionary-listed Kristang word and decide what you want to remember.`,
  focus: [entry.id],
  estimatedMinutes: 3,
  source: entry.source,
  access: entry.access
}));

/**
 * The first two lessons shipped under different ids. Keep them resolvable so
 * saved reviews and any shared links still work.
 */
export const legacyLessonIds: Record<string, string> = {
  "shop-visit": "sabang",
  "home-objects": "janela"
};

export function resolveLessonId(requested?: string): string | undefined {
  if (!requested) return undefined;
  const mapped = legacyLessonIds[requested] ?? requested;
  return lessonUnits.some((lesson) => lesson.id === mapped) ? mapped : undefined;
}

export const reviewQueueSeed: ContributionDraft[] = [];
