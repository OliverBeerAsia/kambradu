export type AccessLevel = "open" | "community" | "restricted";

export type ReviewStatus = "draft" | "submitted" | "approved" | "rejected" | "archived";

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
};

export type LexicalEntry = {
  id: string;
  communityId: string;
  headword: string;
  normalizedHeadword: string;
  englishGlosses: string[];
  partOfSpeech?: string;
  pronunciation?: string;
  alternateSpellings: string[];
  example?: string;
  exampleTranslation?: string;
  source: Attribution;
  access: AccessLevel;
  reviewStatus: ReviewStatus;
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
