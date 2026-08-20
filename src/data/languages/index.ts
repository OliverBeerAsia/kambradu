import type { LessonUnit, Language, PracticePrompt } from "@/types/kambradu";
import { kristang } from "@/data/languages/kristang";
import { malay } from "@/data/languages/malay";

/**
 * Every language a learner can choose.
 *
 * Adding one means adding a file beside this one. Nothing in the interface, the
 * scheduler or the content guards names a language, so none of them changes.
 */
export const languages: Language[] = [kristang, malay];

/** Where a learner lands when they have not chosen a language. */
export const defaultLanguage = kristang;

export function getLanguage(id: string | undefined): Language | undefined {
  return languages.find((language) => language.id === id);
}

/**
 * Lessons and prompts are derived from the lexicon so that adding a word does
 * not mean hand-writing a lesson, a prompt and a route for it.
 * The lesson id is the entry id.
 */
export function promptsFor(language: Language): PracticePrompt[] {
  return language.entries.map((entry) => ({
    id: entry.id,
    communityId: entry.communityId,
    lexicalEntryId: entry.id,
    lessonId: entry.id,
    title: `Meet ${entry.headword}`,
    headword: entry.headword,
    englishGloss: entry.glosses[0],
    promptKind: "meaning-recall",
    listenCue: "This word is listed in the reference dictionary.",
    hasAudio: false,
    access: entry.access,
    source: entry.source,
    focus: [entry.id],
    speakerQuestion: `How is ${entry.headword} used today?`
  }));
}

export function lessonsFor(language: Language): LessonUnit[] {
  return language.entries.map((entry) => ({
    id: entry.id,
    title: `Meet ${entry.headword}`,
    kind: "word",
    level: "starter",
    summary: `Meet a ${language.name} word and decide what you want to remember.`,
    focus: [entry.id],
    estimatedMinutes: 3,
    source: entry.source,
    access: entry.access
  }));
}

/**
 * The first two lessons shipped under different ids. Keep them resolvable so
 * saved reviews and any shared links still work.
 */
export const legacyLessonIds: Record<string, string> = {
  "shop-visit": "sabang",
  "home-objects": "janela"
};

export function resolveLessonId(language: Language, requested?: string): string | undefined {
  if (!requested) return undefined;
  const mapped = legacyLessonIds[requested] ?? requested;
  return language.entries.some((entry) => entry.id === mapped) ? mapped : undefined;
}

/**
 * Which language a lesson id belongs to. Ids are unique inside a language but
 * not across languages, so an id given without a language resolves to whichever
 * language actually has it, and falls back to the default rather than guessing.
 */
export function languageForLesson(id: string | undefined): Language {
  if (!id) return defaultLanguage;
  return languages.find((language) => resolveLessonId(language, id)) ?? defaultLanguage;
}
