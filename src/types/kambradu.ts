export type AccessLevel = "open" | "community" | "restricted";

export type ReviewStatus = "draft" | "submitted" | "changes-requested" | "approved" | "rejected" | "archived";

export type CommunityRole = "learner" | "contributor" | "steward" | "admin";

export type ContentType = "word" | "phrase" | "story" | "note";

export type Community = {
  id: string;
  name: string;
  languageName: string;
  region: string;
  publicDescription: string;
  defaultAccess: AccessLevel;
  createdAt?: string;
  updatedAt?: string;
};

export type Membership = {
  id: string;
  userId: string;
  communityId: string;
  role: CommunityRole;
  displayName: string;
  joinedAt?: string;
};

export type Attribution = {
  label: string;
  authors?: string;
  publisher?: string;
  year?: string;
  doi?: string;
  url?: string;
  license: string;
  locator?: string;
  /**
   * Printed page in the cited source. Sources that have pages must give one;
   * a source that has no pages, such as an online entry, gives `entryUrl`
   * instead. One of the two is always required by docs/content-policy.md.
   */
  page?: number;
  /** Stable address of the entry in a source that has no printed pages. */
  entryUrl?: string;
  /** Who transcribed and checked this against the source, and when. */
  checkedBy?: string;
  checkedAt?: string;
};

/**
 * Kristang has competing spelling systems. Baxter and de Silva use a Malay-based
 * orthography after Hancock (1973) and Marbeck (1995); other community materials
 * differ, most visibly over the final -h that marks final-syllable stress.
 * Entries name the system they are written in so variants can sit side by side
 * without one being presented as the correct form.
 */
/**
 * An id into a community's own set of spelling traditions.
 *
 * Deliberately a plain string, not a union of the Kristang profiles. Every
 * language Kambradu takes on brings its own traditions, and a union would have
 * to be edited to admit each one. The valid values are whatever that community
 * declares, which is checked against its registry rather than against this type.
 */
export type OrthographyProfileId = string;

export type OrthographyProfile = {
  id: OrthographyProfileId;
  label: string;
  description: string;
  basedOn: string;
};

/**
 * How a variant differs from the headword.
 *
 * Pinchah Kristang draws this line deliberately: spellings that sound the same
 * can be treated as one word, but forms that sound different are tied to who is
 * speaking and must not be merged away (Morgado da Costa 2020, section 4.4).
 */
export type VariantKind =
  /** Same word, same sound, different spelling tradition. */
  | "spelling"
  /** A different form of the word, not merely a different spelling. */
  | "form";

export type FormVariant = {
  form: string;
  orthography: OrthographyProfileId;
  kind: VariantKind;
  note?: string;
  source?: Attribution;
};

/** A multi-word form attested under a headword, e.g. `agu di sabang` "soap suds". */
export type Collocation = {
  form: string;
  gloss: string;
};

/** An example sentence copied from the source. Never composed. */
export type SourceExample = {
  /** The sentence in the language being learned. */
  text: string;
  /** The sentence in the language the learner already reads. */
  translation: string;
  /** Headword the sentence appears under, when not the entry's own. */
  headword?: string;
  page: number;
};

export type EvidenceState = {
  source_transcribed: boolean;
  source_checked: boolean;
  speaker_attested: boolean;
  partner_reviewed: boolean;
  public_use_allowed: boolean;
};

/**
 * Which characters of a headword carry the main stress.
 *
 * Baxter and de Silva underline the stressed *syllable* in each main entry
 * (Introduction, section 4), and mark stress on a final vowel with an
 * unpronounced final h. Underlining does not survive plain text, so the span is
 * carried here as character offsets into the headword. It is a transcription of
 * what the page shows, not an analysis of it: monosyllables are unmarked in the
 * source and stay unmarked here.
 */
export type StressMark = {
  /** Index of the first underlined character. */
  start: number;
  /** Index just past the last underlined character. */
  end: number;
};

/**
 * Everything that is specific to one language a learner can study.
 *
 * Bundling it here is what allows a second language to be added as data rather
 * than as a change to shared code. Nothing outside this record should name a
 * language, a spelling tradition or a language tag.
 */
export type Language = {
  /** Stable url-safe id, e.g. "kristang". */
  id: string;
  /** What the language calls itself, shown to the learner. */
  name: string;
  /** BCP 47 or ISO 639-3 tag used for `lang` attributes, e.g. "mcm". */
  tag: string;
  /** Tag for the language the meanings are written in, e.g. "en". */
  glossTag: string;
  /**
   * Whether this language is endangered.
   *
   * Kambradu exists for languages that lack speakers and resources. A widely
   * spoken language may be offered as a bridge or because a learner asked for
   * it, but the interface should not imply it carries the same urgency.
   */
  vitality: "endangered" | "widely-spoken";
  /** One plain sentence for the chooser. */
  summary: string;
  community: Community;
  /** The spelling traditions this language recognises. */
  orthographies: Record<OrthographyProfileId, OrthographyProfile>;
  /** The main source the words come from. Shown to the learner. */
  attribution: Attribution;
  /**
   * What the evidence actually amounts to, in the learner's words. Written per
   * language because "checked against the dictionary" is a claim that has to be
   * true of the language it is shown beside.
   */
  evidenceNote: string;
  entries: LexicalEntry[];
};

export type LexicalEntry = {
  id: string;
  communityId: string;
  headword: string;
  normalizedHeadword: string;
  /**
   * The meaning, in whatever language this course is taught in. Named `glosses`
   * rather than `englishGlosses` because a learner in Malaysia may be reading
   * Malay. The language they are written in is on the Language record.
   */
  glosses: string[];
  partOfSpeech?: string;
  pronunciation?: string;
  alternateSpellings: string[];
  example?: string;
  exampleTranslation?: string;
  /** Spelling system this headword is written in. */
  orthography: OrthographyProfileId;
  /** Where the main stress falls. Absent when the source leaves it unmarked. */
  stress?: StressMark;
  /** Same word in other spelling systems. Never a correction. */
  variants: FormVariant[];
  collocations: Collocation[];
  examples: SourceExample[];
  source: Attribution;
  access: AccessLevel;
  evidence: EvidenceState;
  hasAudio: boolean;
  audioPath?: string;
  tags: string[];
};

export type Story = {
  id: string;
  communityId: string;
  title: string;
  summary: string;
  kind: "phrase" | "story";
  body: string;
  translation?: string;
  contributor: string;
  access: AccessLevel;
  reviewStatus: ReviewStatus;
  source?: Attribution;
  tags: string[];
};

export type RecordingMetadata = {
  id: string;
  communityId: string;
  ownerId: string;
  storagePath: string;
  contentType: ContentType;
  consentProfileId: string;
  access: AccessLevel;
  reviewStatus: ReviewStatus;
  durationSeconds?: number;
  createdAt?: string;
};

export type ConsentProfile = {
  id: string;
  ownerId: string;
  displayName: string;
  attributionName: string;
  mayPublish: boolean;
  mayReuseForLearning: boolean;
  notes?: string;
};

export type ContributionDraft = {
  id?: string;
  communityId: string;
  contentType: ContentType;
  title: string;
  body: string;
  englishGloss?: string;
  provenance: string;
  consent: string;
  access: AccessLevel;
  attributionName: string;
  reviewStatus: ReviewStatus;
  submittedBy?: string;
  storagePath?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JournalEntry = {
  id: string;
  userId: string;
  communityId: string;
  title: string;
  body: string;
  tags: string[];
  linkedEntryIds: string[];
  isPrivate: true;
  createdAt?: string;
  updatedAt?: string;
};

export type SavedWord = {
  id: string;
  userId: string;
  lexicalEntryId: string;
  headword: string;
  englishGloss: string;
  nextReviewAt: string;
  confidence: "new" | "learning" | "steady";
  lastReviewedAt?: string;
  reviewCount?: number;
  lapses?: number;
  hasAudio?: boolean;
  savedAt?: string;
};

export type Goal = {
  id: string;
  userId: string;
  communityId: string;
  label: string;
  targetCount: number;
  completedCount: number;
  cadence: "daily" | "weekly";
};

export type ReviewItem = ContributionDraft & {
  id: string;
  submittedByName: string;
  submittedAgo: string;
};

export type ExportRecord = {
  id: string;
  communityId: string;
  requestedBy: string;
  format: "json" | "csv";
  accessScope: AccessLevel;
  createdAt?: string;
};

export type PersonalLexiconEntry = {
  id: string;
  userId: string;
  communityId: string;
  headword: string;
  englishGloss: string;
  alternateSpellings: string;
  example: string;
  sourceNote: string;
  access: AccessLevel;
  status: "private" | "ready" | "submitted";
  createdAt: string;
};

export type LearningTask = {
  id: string;
  title: string;
  track: "listen" | "review" | "journal" | "record" | "culture";
  minutes: number;
  detail: string;
  completed: boolean;
};

export type LearningCycleReviewStatus = "not-started" | "in-progress" | "submitted" | "changes-requested" | "approved";

export type LearningCycleFeedback = {
  id: string;
  stewardName: string;
  message: string;
  createdAt: string;
  resolvedAt?: string;
};

export type LearningCycleSubmission = {
  contentType: ContentType;
  title: string;
  body: string;
  englishGloss?: string;
  provenance: string;
  consent: string;
  access: AccessLevel;
  attributionName: string;
  submittedAt: string;
  revisedAt?: string;
};

export type LearningCycle = {
  id: string;
  userId: string;
  communityId: string;
  title: string;
  shortTitle: string;
  lessonId: string;
  practicePromptIds: string[];
  practiceReviewIds: string[];
  journalEntryIds: string[];
  personalLexiconEntryIds: string[];
  speakerCheckIds: string[];
  contributionId?: string;
  reviewStatus: LearningCycleReviewStatus;
  feedback: LearningCycleFeedback[];
  submission?: LearningCycleSubmission;
  publicEntryIds: string[];
  focus: string[];
  createdAt: string;
  updatedAt: string;
};

export type ReviewConfidence = "new" | "again" | "almost" | "steady";

export type PracticePrompt = {
  id: string;
  communityId: string;
  lexicalEntryId?: string;
  lessonId?: string;
  title: string;
  headword: string;
  englishGloss: string;
  promptKind: "listen-recall" | "meaning-recall" | "speak-repeat";
  listenCue: string;
  example?: string;
  exampleTranslation?: string;
  hasAudio: boolean;
  audioPath?: string;
  access: AccessLevel;
  source: Attribution;
  focus: string[];
  speakerQuestion: string;
};

export type PracticeReview = {
  id: string;
  userId: string;
  communityId: string;
  promptId: string;
  lexicalEntryId?: string;
  lessonId?: string;
  promptKind: PracticePrompt["promptKind"];
  confidence: ReviewConfidence;
  reviewedAt: string;
  nextReviewAt: string;
  intervalDays: number;
  ease: number;
  reflection: string;
};

export type SpeakerCheck = {
  id: string;
  userId: string;
  communityId: string;
  linkedEntryId?: string;
  question: string;
  speakerDisplayName: string;
  relationship?: string;
  consentStatus: "not-asked" | "storage-only" | "community-review" | "publish-approved";
  access: AccessLevel;
  status: "private-draft" | "ready-for-review" | "submitted";
  createdAt?: string;
};

export type LessonUnit = {
  id: string;
  title: string;
  kind: "word" | "phrase" | "story" | "culture";
  level: "starter" | "building" | "community";
  summary: string;
  focus: string[];
  estimatedMinutes: number;
  source: Attribution;
  access: AccessLevel;
};
