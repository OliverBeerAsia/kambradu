export const collections = {
  communities: "communities",
  users: "users",
  lexicalEntries: "lexicalEntries",
  stories: "stories",
  lessons: "lessons",
  recordings: "recordings",
  contributions: "contributions",
  consentProfiles: "consentProfiles",
  exports: "exports"
} as const;

export function userJournalPath(userId: string) {
  return `${collections.users}/${userId}/journalEntries`;
}

export function userSavedPath(userId: string) {
  return `${collections.users}/${userId}/savedWords`;
}

export function userGoalsPath(userId: string) {
  return `${collections.users}/${userId}/goals`;
}

export function userPersonalLexiconPath(userId: string) {
  return `${collections.users}/${userId}/personalLexicon`;
}

export function userLearningPlansPath(userId: string) {
  return `${collections.users}/${userId}/learningPlans`;
}

export function communityLessonsPath(communityId: string) {
  return `${collections.communities}/${communityId}/${collections.lessons}`;
}
