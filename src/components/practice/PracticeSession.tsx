"use client";

import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { HegelCompanion } from "@/components/ui/HegelCompanion";
import { TryRecorder } from "@/components/practice/TryRecorder";
import { Headword, stressHint } from "@/components/ui/Headword";
import { VariantNote } from "@/components/ui/VariantNote";
import { languageForLesson, lessonsFor, promptsFor, resolveLessonId } from "@/data/languages";
import type { LexicalEntry } from "@/types/kambradu";
import { useKambraduData } from "@/lib/hooks/use-kambradu-data";
import { findLatestReview, type LocalPracticeSession, type LocalReview } from "@/lib/local-data";
import { formatReviewDate, gradeFromAnswer, scheduleNextPracticeReview } from "@/lib/practice-scheduler";

type Step = LocalPracticeSession["step"] | "done";
type Confidence = LocalReview["confidence"];

const steps: Array<Exclude<Step, "done">> = ["meet", "meaning", "recall", "try", "connect", "keep"];
const contexts = ["At home", "With someone I know", "Somewhere in Melaka"];

/** Small stable hash so option order varies by word without needing randomness. */
function seedFrom(value: string): number {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) % 100000;
  return hash;
}

function buildMeaningOptions(entries: LexicalEntry[], entryId: string, correctGloss: string): string[] {
  const entry = entries.find((item) => item.id === entryId);
  const candidates = entries
    .filter((item) => item.id !== entryId && item.glosses[0] !== correctGloss)
    .sort((a, b) => {
      const samePos = (item: typeof a) => (item.partOfSpeech === entry?.partOfSpeech ? 0 : 1);
      return samePos(a) - samePos(b) || a.id.localeCompare(b.id);
    });

  const seed = seedFrom(entryId);
  const distractors = [candidates[seed % candidates.length], candidates[(seed * 7 + 3) % candidates.length]]
    .filter(Boolean)
    .map((item) => item.glosses[0]);

  const unique = [...new Set(distractors)];
  // Guarantee two distractors even if the pair collided.
  for (const item of candidates) {
    if (unique.length >= 2) break;
    if (!unique.includes(item.glosses[0])) unique.push(item.glosses[0]);
  }

  const options = [correctGloss, ...unique.slice(0, 2)];
  // Rotate so the answer is not always first.
  const offset = seed % options.length;
  return [...options.slice(offset), ...options.slice(0, offset)];
}

export function PracticeSession({ requestedLessonId }: { requestedLessonId?: string }) {
  // A lesson id belongs to exactly one language, so the language follows from
  // the word rather than needing to be carried through the url separately.
  const language = languageForLesson(requestedLessonId);
  const lessonUnits = lessonsFor(language);
  const practicePrompts = promptsFor(language);
  const validLessonId = resolveLessonId(language, requestedLessonId) ?? lessonUnits[0].id;
  const prompt = practicePrompts.find((item) => item.lessonId === validLessonId) ?? practicePrompts[0];
  const { data, isHydrated, completeReview, setActiveSession, saveStatus } = useKambraduData();
  const [step, setStep] = useState<Step>("meet");
  const [meaningChoice, setMeaningChoice] = useState("");
  const [recall, setRecall] = useState("");
  const [recallChecked, setRecallChecked] = useState(false);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [context, setContext] = useState("");
  const [writeOwnContext, setWriteOwnContext] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nextDue, setNextDue] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const initialized = useRef(false);

  // Distractors come from other entries, preferring the same part of speech, and
  // their order is derived from the entry id so it is stable per word but not
  // always the same position.
  const entryId = prompt.lexicalEntryId ?? prompt.id;
  const entry = language.entries.find((item) => item.id === entryId);
  const meaningOptions = useMemo(() => buildMeaningOptions(language.entries, entryId, prompt.englishGloss), [language, entryId, prompt.englishGloss]);
  const meaningCorrect = meaningChoice === prompt.englishGloss;
  const recallCorrect = recall.trim().toLowerCase() === prompt.headword.toLowerCase();
  const currentIndex = step === "done" ? steps.length : steps.indexOf(step);

  useEffect(() => {
    if (!isHydrated || initialized.current) return;
    initialized.current = true;
    const existing = data.activeSession?.lessonId === validLessonId ? data.activeSession : null;
    if (existing) {
      setStep(existing.step);
      setMeaningChoice(existing.meaningChoice ?? "");
      setRecall(existing.recall ?? "");
      setRecallChecked(existing.recallChecked ?? false);
      setConfidence(existing.confidence ?? null);
      setContext(existing.context ?? "");
      setWriteOwnContext(Boolean(existing.context && !contexts.includes(existing.context)));
    } else {
      setActiveSession({ lessonId: validLessonId, step: "meet", startedAt: new Date().toISOString() });
    }
  }, [data.activeSession, isHydrated, setActiveSession, validLessonId]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function goTo(next: Exclude<Step, "done">) {
    setStep(next);
    setActiveSession({
      lessonId: validLessonId,
      step: next,
      startedAt: data.activeSession?.lessonId === validLessonId ? data.activeSession.startedAt : new Date().toISOString(),
      meaningChoice,
      recall,
      recallChecked,
      confidence: confidence ?? undefined,
      context
    });
  }

  function saveDraft(values: Partial<LocalPracticeSession>) {
    if (step === "done") return;
    setActiveSession({
      lessonId: validLessonId,
      step,
      startedAt: data.activeSession?.lessonId === validLessonId ? data.activeSession.startedAt : new Date().toISOString(),
      meaningChoice,
      recall,
      recallChecked,
      confidence: confidence ?? undefined,
      context,
      ...values
    });
  }

  function goBack() {
    const previous = steps[Math.max(0, currentIndex - 1)];
    goTo(previous);
  }

  function complete(keep: boolean) {
    if (!confidence) return;
    const previous = findLatestReview(data.reviews, entryId);
    // A typed answer that did not match caps the grade, so the self-rating
    // cannot outrun what the learner actually recalled.
    const grade = gradeFromAnswer(confidence, recallCorrect);
    const schedule = scheduleNextPracticeReview(
      grade,
      { intervalDays: previous?.intervalDays, ease: previous?.ease, reps: previous?.reps, lapses: previous?.lapses },
      new Date(),
      entryId
    );
    const review: LocalReview = {
      id: `review-${entryId}-${Date.now()}`,
      lessonId: validLessonId,
      promptId: prompt.id,
      lexicalEntryId: entryId,
      confidence: grade,
      reflection: context,
      ...schedule
    };
    const kept = keep ? { id: entryId, headword: prompt.headword, gloss: prompt.englishGloss } : undefined;
    if (completeReview(review, kept, context)) {
      setSaved(keep);
      setNextDue(schedule.nextReviewAt);
      setStep("done");
    }
  }

  function restart() {
    setMeaningChoice("");
    setRecall("");
    setRecallChecked(false);
    setConfidence(null);
    setContext("");
    setWriteOwnContext(false);
    setSaved(false);
    setNextDue(null);
    goTo("meet");
  }

  if (!isHydrated) {
    return <section className="practice-card" aria-label="Practice"><p role="status">Preparing your word.</p></section>;
  }

  return (
    <section className="practice-card" aria-labelledby="practice-heading">
      {step !== "done" ? (
        <div className="practice-progress" aria-label={`Step ${currentIndex + 1} of ${steps.length}`}>
          <span>Step {currentIndex + 1} of {steps.length}</span>
          <progress max={steps.length} value={currentIndex + 1}>{currentIndex + 1} of {steps.length}</progress>
        </div>
      ) : null}

      {currentIndex > 0 && step !== "done" ? <button className="back-button" type="button" onClick={goBack}><ChevronLeft size={18} aria-hidden="true" />Back</button> : null}
      {saveStatus?.kind === "error" ? <p className="error-notice" role="alert">{saveStatus.message}</p> : null}

      {step === "meet" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}><Headword form={prompt.headword} stress={entry?.stress} lang={language.tag} /></h1>
            <p>{prompt.englishGloss}</p>
            {stressHint(prompt.headword, entry?.stress) ? (
              <p className="stress-hint">{stressHint(prompt.headword, entry?.stress)}</p>
            ) : null}
            <VariantNote variants={entry?.variants ?? []} lang={language.tag} />
          </header>
          {entry?.collocations.length ? (
            <dl className="attested-list">
              {entry.collocations.map((item) => (
                <div key={item.form}>
                  <dt lang={language.tag}>{item.form}</dt>
                  <dd>{item.gloss}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {entry?.examples.length ? (
            <blockquote className="attested-example">
              <p lang={language.tag}>{entry.examples[0].text}</p>
              <p>{entry.examples[0].translation}</p>
            </blockquote>
          ) : null}
          <details className="source-note">
            <summary>Source</summary>
            <p>Checked against the Baxter and de Silva dictionary, page {entry?.source.page}. No reviewed audio is available.</p>
          </details>
          <button className="primary-action" type="button" onClick={() => goTo("meaning")}>Continue</button>
        </div>
      ) : null}

      {step === "meaning" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>What does <span lang={language.tag}>{prompt.headword}</span> mean?</h1>
          </header>
          <div className="answer-grid" role="group" aria-label="Meaning choices">
            {meaningOptions.map((option) => <button aria-pressed={meaningChoice === option} key={option} type="button" onClick={() => { setMeaningChoice(option); saveDraft({ meaningChoice: option }); }}>{option}</button>)}
          </div>
          {meaningChoice ? <p className={`plain-feedback ${meaningCorrect ? "correct" : ""}`} role="status">{meaningCorrect ? `Yes. It means ${prompt.englishGloss}.` : `${prompt.headword} means ${prompt.englishGloss}.`}</p> : null}
          <button className="primary-action" type="button" disabled={!meaningChoice} onClick={() => goTo("recall")}>Continue</button>
        </div>
      ) : null}

      {step === "recall" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>What is the Kristang word for {prompt.englishGloss}?</h1>
          </header>
          <label className="recall-field"><span>Your answer</span><input lang={language.tag} autoComplete="off" value={recall} onChange={(event) => { const value = event.target.value; setRecall(value); setRecallChecked(false); setConfidence(null); saveDraft({ recall: value, recallChecked: false, confidence: undefined }); }} /></label>
          {!recallChecked ? <button className="primary-action" type="button" disabled={!recall.trim()} onClick={() => { setRecallChecked(true); saveDraft({ recallChecked: true }); }}>Check</button> : (
            <>
              <p className={`plain-feedback ${recallCorrect ? "correct" : ""}`} role="status">{recallCorrect ? "That matches the dictionary form." : `The dictionary form is ${prompt.headword}.`}</p>
              <fieldset className="confidence-choices">
                <legend>How did that feel?</legend>
                {(["again", "almost", "got-it"] as Confidence[]).map((value) => <button aria-pressed={confidence === value} key={value} type="button" onClick={() => { setConfidence(value); saveDraft({ confidence: value }); }}>{value === "got-it" ? "Got it" : value[0].toUpperCase() + value.slice(1)}</button>)}
              </fieldset>
              <button className="primary-action" type="button" disabled={!confidence} onClick={() => goTo("try")}>Continue</button>
            </>
          )}
        </div>
      ) : null}

      {step === "try" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>Say <Headword form={prompt.headword} stress={entry?.stress} lang={language.tag} /> out loud.</h1>
            <p>Record it if you want to hear yourself. This stays in your browser.</p>
            {stressHint(prompt.headword, entry?.stress) ? (
              <p className="stress-hint">{stressHint(prompt.headword, entry?.stress)}</p>
            ) : null}
          </header>
          <TryRecorder entryId={entryId} headword={prompt.headword} />
          <button className="primary-action" type="button" onClick={() => goTo("connect")}>Continue</button>
        </div>
      ) : null}

      {step === "connect" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>Where could <span lang={language.tag}>{prompt.headword}</span> fit in your life?</h1>
            <p>Choose a place or write your own.</p>
          </header>
          <div className="context-choices" role="group" aria-label="Personal context">
            {contexts.map((value) => <button aria-pressed={!writeOwnContext && context === value} key={value} type="button" onClick={() => { setWriteOwnContext(false); setContext(value); saveDraft({ context: value }); }}>{value}</button>)}
            <button aria-pressed={writeOwnContext} type="button" onClick={() => { setWriteOwnContext(true); setContext(""); saveDraft({ context: "" }); }}>Write my own</button>
          </div>
          {writeOwnContext ? <label className="context-field"><span>Short note</span><textarea rows={3} value={context} onChange={(event) => { const value = event.target.value; setContext(value); saveDraft({ context: value }); }} /></label> : null}
          <button className="primary-action" type="button" disabled={!context.trim()} onClick={() => goTo("keep")}>Continue</button>
          <button className="quiet-action" type="button" onClick={() => goTo("keep")}>Skip this</button>
        </div>
      ) : null}

      {step === "keep" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>Keep <span lang={language.tag}>{prompt.headword}</span> in Memories?</h1>
            <p>You can edit, export or delete it later.</p>
          </header>
          <div className="keep-card"><strong lang={language.tag}>{prompt.headword}</strong><span>{prompt.englishGloss}</span>{context ? <small>{context}</small> : null}</div>
          <button className="primary-action" type="button" onClick={() => complete(true)}>Keep in Memories</button>
          <button className="quiet-action" type="button" onClick={() => complete(false)}>Finish without saving</button>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="practice-stage completion-stage">
          <HegelCompanion compact>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>You reviewed <span lang={language.tag}>{prompt.headword}</span>.</h1>
            <p>{saved ? "The word is also saved in this browser." : "Nothing was added to Memories."}</p>
            {nextDue ? <p>Next review {formatReviewDate(nextDue)}.</p> : null}
          </HegelCompanion>
          <Link className="primary-action" href="/"><Check size={18} aria-hidden="true" />Done</Link>
          <button className="quiet-action" type="button" onClick={restart}>Practise again</button>
        </div>
      ) : null}
    </section>
  );
}
