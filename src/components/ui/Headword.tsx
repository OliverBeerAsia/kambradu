import type { StressMark } from "@/types/kambradu";
import { LANGUAGE_TAG } from "@/lib/language";

/**
 * A Kristang headword, showing where the main stress falls.
 *
 * The printed dictionary underlines the stressed syllable, so that is what is
 * drawn here. Words the source leaves unmarked, including every monosyllable,
 * are shown plain rather than guessed at.
 */
export function Headword({ form, stress }: { form: string; stress?: StressMark }) {
  if (!stress || stress.start >= stress.end || stress.end > form.length) {
    return <span lang={LANGUAGE_TAG}>{form}</span>;
  }

  const before = form.slice(0, stress.start);
  const stressed = form.slice(stress.start, stress.end);
  const after = form.slice(stress.end);

  return (
    <span lang={LANGUAGE_TAG}>
      {before}
      <b className="stressed-syllable">{stressed}</b>
      {after}
    </span>
  );
}

/** The same information as words, for a screen reader or a caption. */
export function stressHint(form: string, stress?: StressMark): string | null {
  if (!stress || stress.start >= stress.end || stress.end > form.length) return null;
  return `Say it with the weight on ${form.slice(stress.start, stress.end)}.`;
}
