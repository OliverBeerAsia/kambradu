"use client";

import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { HegelCompanion } from "@/components/ui/HegelCompanion";
import { lessonUnits, practicePrompts } from "@/data/kristang";
import { useKambraduData } from "@/lib/hooks/use-kambradu-data";
import { findLatestReview, type LocalPracticeSession, type LocalReview } from "@/lib/local-data";
import { scheduleNextPracticeReview } from "@/lib/practice-scheduler";

type Step = LocalPracticeSession["step"] | "done";
type Confidence = LocalReview["confidence"];

const steps: Array<Exclude<Step, "done">> = ["meet", "meaning", "recall", "connect", "keep"];
const contexts = ["At home", "With someone I know", "Somewhere in Melaka"];

export function PracticeSession({ requestedLessonId }: { requestedLessonId?: string }) {
  const validLessonId = lessonUnits.some((lesson) => lesson.id === requestedLessonId) ? requestedLessonId as string : lessonUnits[0].id;
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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const initialized = useRef(false);

  const meaningOptions = useMemo(
    () => prompt.lexicalEntryId === "sabang" ? ["window", "soap", "table"] : ["soap", "door", "window"],
    [prompt.lexicalEntryId]
  );
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
    const previous = findLatestReview(data.reviews, validLessonId);
    const schedule = scheduleNextPracticeReview(confidence, previous?.intervalDays ?? 0);
    const review: LocalReview = {
      id: `review-${validLessonId}-${Date.now()}`,
      lessonId: validLessonId,
      promptId: prompt.id,
      lexicalEntryId: prompt.lexicalEntryId ?? prompt.id,
      confidence,
      reflection: context,
      ...schedule
    };
    const entry = keep ? { id: prompt.lexicalEntryId ?? prompt.id, headword: prompt.headword, gloss: prompt.englishGloss } : undefined;
    if (completeReview(review, entry, context)) {
      setSaved(keep);
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
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}><span lang="mcm">{prompt.headword}</span></h1>
            <p>{prompt.englishGloss}</p>
          </header>
          <details className="source-note"><summary>Source</summary><p>Checked against the Baxter and de Silva dictionary. No reviewed audio is available.</p></details>
          <button className="primary-action" type="button" onClick={() => goTo("meaning")}>Continue</button>
        </div>
      ) : null}

      {step === "meaning" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>What does <span lang="mcm">{prompt.headword}</span> mean?</h1>
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
          <label className="recall-field"><span>Your answer</span><input lang="mcm" autoComplete="off" value={recall} onChange={(event) => { const value = event.target.value; setRecall(value); setRecallChecked(false); setConfidence(null); saveDraft({ recall: value, recallChecked: false, confidence: undefined }); }} /></label>
          {!recallChecked ? <button className="primary-action" type="button" disabled={!recall.trim()} onClick={() => { setRecallChecked(true); saveDraft({ recallChecked: true }); }}>Check</button> : (
            <>
              <p className={`plain-feedback ${recallCorrect ? "correct" : ""}`} role="status">{recallCorrect ? "That matches the dictionary form." : `The dictionary form is ${prompt.headword}.`}</p>
              <fieldset className="confidence-choices">
                <legend>How did that feel?</legend>
                {(["again", "almost", "got-it"] as Confidence[]).map((value) => <button aria-pressed={confidence === value} key={value} type="button" onClick={() => { setConfidence(value); saveDraft({ confidence: value }); }}>{value === "got-it" ? "Got it" : value[0].toUpperCase() + value.slice(1)}</button>)}
              </fieldset>
              <button className="primary-action" type="button" disabled={!confidence} onClick={() => goTo("connect")}>Continue</button>
            </>
          )}
        </div>
      ) : null}

      {step === "connect" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>Where could <span lang="mcm">{prompt.headword}</span> fit in your life?</h1>
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
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>Keep <span lang="mcm">{prompt.headword}</span> in Memories?</h1>
            <p>You can edit, export or delete it later.</p>
          </header>
          <div className="keep-card"><strong lang="mcm">{prompt.headword}</strong><span>{prompt.englishGloss}</span>{context ? <small>{context}</small> : null}</div>
          <button className="primary-action" type="button" onClick={() => complete(true)}>Keep in Memories</button>
          <button className="quiet-action" type="button" onClick={() => complete(false)}>Finish without saving</button>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="practice-stage completion-stage">
          <HegelCompanion compact>
            <h1 id="practice-heading" ref={headingRef} tabIndex={-1}>You reviewed <span lang="mcm">{prompt.headword}</span>.</h1>
            <p>{saved ? "The word is also saved in this browser." : "Nothing was added to Memories."}</p>
          </HegelCompanion>
          <Link className="primary-action" href="/"><Check size={18} aria-hidden="true" />Done</Link>
          <button className="quiet-action" type="button" onClick={restart}>Practise again</button>
        </div>
      ) : null}
    </section>
  );
}
