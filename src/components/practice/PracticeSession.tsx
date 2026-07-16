"use client";

import Link from "next/link";
import { Check, ChevronLeft, LockKeyhole, MessageCircleQuestion, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { practicePrompts } from "@/data/kristang";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import { useMemoriesData } from "@/lib/hooks/use-memories-data";
import { formatReviewDate, scheduleNextPracticeReview } from "@/lib/practice-scheduler";
import type { PracticeReview, SpeakerCheck } from "@/types/kambradu";

type PracticeStep = "hear" | "try" | "use" | "keep" | "done";

const stepOrder: PracticeStep[] = ["hear", "try", "use", "keep", "done"];
const stepLabels: Record<PracticeStep, string> = {
  hear: "Meet",
  try: "Try",
  use: "Connect",
  keep: "Keep",
  done: "Done"
};
const initialReflections: Record<string, string> = {};
const initialReviews: PracticeReview[] = [];
const initialSpeakerChecks: SpeakerCheck[] = [];
const contextChoices = ["At home", "With someone I know", "Just for me"];

export function PracticeSession() {
  const { activeCycle, attachPracticeReview, attachSpeakerCheck, isHydrated: cyclesReady } = useLearningCycles();
  const { keepSavedWord, savedWords, isHydrated: memoriesReady } = useMemoriesData();
  const [activeStep, setActiveStep, stepReady] = useLocalStorageState<PracticeStep>("kambradu-practice-step-v2", "hear");
  const [reviews, setReviews, reviewsReady] = useLocalStorageState<PracticeReview[]>("kambradu-practice-reviews-v1", initialReviews);
  const [, setSpeakerChecks, speakerChecksReady] = useLocalStorageState<SpeakerCheck[]>("kambradu-speaker-checks-v1", initialSpeakerChecks);
  const [reflections, setReflections, reflectionsReady] = useLocalStorageState<Record<string, string>>("kambradu-practice-reflections-v1", initialReflections);
  const [askSomeone, setAskSomeone] = useState(false);
  const [message, setMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const didMount = useRef(false);
  const activePrompt = useMemo(() => {
    const cyclePrompt = practicePrompts.find((prompt) => activeCycle.practicePromptIds.includes(prompt.id));
    return cyclePrompt ?? practicePrompts[0];
  }, [activeCycle.practicePromptIds]);
  const reflection = reflections[activePrompt.id] ?? "";
  const currentIndex = stepOrder.indexOf(activeStep);
  const hasPlayableAudio = Boolean(activePrompt.audioPath);
  const isDictionaryListed = activePrompt.source.label === "Baxter and de Silva Kristang dictionary";
  const isReady = cyclesReady && memoriesReady && stepReady && reviewsReady && speakerChecksReady && reflectionsReady;

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    headingRef.current?.focus();
  }, [activeStep, askSomeone]);

  function goTo(step: PracticeStep) {
    setMessage("");
    setAskSomeone(false);
    setActiveStep(step);
  }

  function goBack() {
    const previous = stepOrder[Math.max(0, currentIndex - 1)];
    goTo(previous);
  }

  function chooseContext(value: string) {
    setReflections((current) => ({ ...current, [activePrompt.id]: value }));
  }

  function saveReview() {
    const previousReview = [...reviews].reverse().find((review) => review.promptId === activePrompt.id);
    const schedule = scheduleNextPracticeReview("almost", previousReview?.intervalDays ?? 0);
    const reviewedAt = new Date().toISOString();
    const nextReview: PracticeReview = {
      id: `users/demo/practiceReviews/practice-${activePrompt.id}-${Date.now()}`,
      userId: "demo",
      communityId: activePrompt.communityId,
      promptId: activePrompt.id,
      lexicalEntryId: activePrompt.lexicalEntryId,
      lessonId: activePrompt.lessonId,
      promptKind: activePrompt.promptKind,
      confidence: "almost",
      reflection,
      ...schedule
    };
    const existingWord = savedWords.find((word) => word.lexicalEntryId === activePrompt.lexicalEntryId);

    setReviews((current) => [nextReview, ...current]);
    attachPracticeReview(nextReview.id);
    keepSavedWord({
      id: existingWord?.id ?? `saved-${activePrompt.lexicalEntryId ?? activePrompt.id}`,
      userId: "demo",
      lexicalEntryId: activePrompt.lexicalEntryId ?? activePrompt.id,
      headword: activePrompt.headword,
      englishGloss: activePrompt.englishGloss,
      nextReviewAt: formatReviewDate(schedule.nextReviewAt),
      confidence: "learning",
      lastReviewedAt: reviewedAt,
      reviewCount: (existingWord?.reviewCount ?? 0) + 1,
      hasAudio: hasPlayableAudio,
      savedAt: existingWord?.savedAt ?? reviewedAt
    });
    setMessage("Saved on this device. Other people using this browser profile may be able to see it.");
    setAskSomeone(false);
    setActiveStep("done");
  }

  function finishWithoutSaving() {
    setMessage("Nothing was saved.");
    setAskSomeone(false);
    setActiveStep("done");
  }

  function keepQuestion() {
    const check: SpeakerCheck = {
      id: `users/demo/speakerChecks/speaker-check-${activePrompt.id}-${Date.now()}`,
      userId: "demo",
      communityId: activePrompt.communityId,
      linkedEntryId: activePrompt.lexicalEntryId,
      question: activePrompt.speakerQuestion,
      speakerDisplayName: "Someone I trust",
      relationship: "",
      consentStatus: "not-asked",
      access: "restricted",
      status: "private-draft",
      createdAt: new Date().toISOString()
    };

    setSpeakerChecks((current) => [check, ...current]);
    attachSpeakerCheck(check.id);
    setMessage("Question saved on this device.");
    setAskSomeone(false);
  }

  const progress = (
    <div className="gentle-progress" aria-hidden="true">
      {stepOrder.map((step, index) => <span className={index <= currentIndex ? "filled" : ""} key={step} />)}
    </div>
  );

  if (!isReady) {
    return <section className="gentle-practice practice-loading" aria-label="Practice"><p role="status">Preparing practice...</p></section>;
  }

  return (
    <section className="gentle-practice" aria-labelledby="practice-step-heading">
      <div className="practice-progress-row">
        <span>Step {currentIndex + 1} of {stepOrder.length}</span>
        {progress}
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Step {currentIndex + 1} of {stepOrder.length}: {stepLabels[activeStep]}
      </p>

      {currentIndex > 0 && activeStep !== "done" ? (
        <button className="practice-back" type="button" onClick={goBack}>
          <ChevronLeft size={18} aria-hidden="true" />
          Back
        </button>
      ) : null}

      {activeStep === "hear" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-step-heading" ref={headingRef} tabIndex={-1}>
              {hasPlayableAudio ? "Hear" : "Meet"} <span lang="mcm">{activePrompt.headword}</span>.
            </h1>
            <p>
              {hasPlayableAudio
                ? "Listen when you are ready. Replay as often as you like."
                : isDictionaryListed
                  ? "Dictionary-listed. No reviewed audio is available."
                  : "This learning note has not been checked."}
            </p>
          </header>

          <div className="practice-word-card">
            <span lang="mcm">{activePrompt.headword}</span>
            <strong>{activePrompt.englishGloss}</strong>
            <small>{hasPlayableAudio ? "Checked audio available" : "Read for now"}</small>
          </div>

          {hasPlayableAudio ? (
            <audio className="practice-audio" controls preload="metadata" src={activePrompt.audioPath} aria-label={`Listen to ${activePrompt.headword}`} />
          ) : (
            <p className="practice-honesty-note"><Volume2 size={18} aria-hidden="true" />A reviewed recording has not been added.</p>
          )}

          <button className="primary-action practice-primary" type="button" onClick={() => goTo("try")}>Next</button>
        </div>
      ) : null}

      {activeStep === "try" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-step-heading" ref={headingRef} tabIndex={-1}>Try <span lang="mcm">{activePrompt.headword}</span>.</h1>
            <p>Say it quietly, read it, or continue without speaking.</p>
          </header>
          <div className="try-bubble" lang="mcm">{activePrompt.headword}</div>
          <button className="primary-action practice-primary" type="button" onClick={() => goTo("use")}>Continue</button>
          <button className="quiet-action" type="button" onClick={() => goTo("use")}>Skip speaking</button>
        </div>
      ) : null}

      {activeStep === "use" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-step-heading" ref={headingRef} tabIndex={-1}>Where might <span lang="mcm">{activePrompt.headword}</span> fit?</h1>
            <p>Choose a context that fits, or skip.</p>
          </header>
          <div className="context-choice-grid" role="group" aria-label={`Where ${activePrompt.headword} might fit`}>
            {contextChoices.map((choice) => (
              <button aria-pressed={reflection === choice} className={reflection === choice ? "selected" : ""} key={choice} type="button" onClick={() => chooseContext(choice)}>{choice}</button>
            ))}
          </div>
          <button className="primary-action practice-primary" type="button" onClick={() => goTo("keep")} disabled={!reflection}>Next</button>
          <button className="quiet-action" type="button" onClick={() => goTo("keep")}>Skip this</button>
        </div>
      ) : null}

      {activeStep === "keep" ? (
        <div className="practice-stage">
          <header>
            <h1 id="practice-step-heading" ref={headingRef} tabIndex={-1}>Keep this on your device?</h1>
            <p>Other people using this browser profile may be able to see it.</p>
          </header>
          <div className="keep-preview">
            <span lang="mcm">{activePrompt.headword}</span>
            <strong>{activePrompt.englishGloss}</strong>
            {reflection ? <small>{reflection}</small> : null}
          </div>
          <button className="primary-action practice-primary" type="button" onClick={saveReview}>
            <LockKeyhole size={18} aria-hidden="true" />
            Save on this device
          </button>
          <button className="quiet-action" type="button" onClick={finishWithoutSaving}>Not today</button>
        </div>
      ) : null}

      {activeStep === "done" && askSomeone ? (
        <div className="practice-stage practice-finish">
          <span className="finish-icon question" aria-hidden="true"><MessageCircleQuestion size={31} /></span>
          <header>
            <h1 id="practice-step-heading" ref={headingRef} tabIndex={-1}>Save a question for later?</h1>
            <p>Keep this if you would like to ask a Kristang speaker later.</p>
          </header>
          <blockquote className="ask-question">{activePrompt.speakerQuestion}</blockquote>
          <button className="primary-action practice-primary" type="button" onClick={keepQuestion}>Keep this question</button>
          <button className="quiet-action" type="button" onClick={() => setAskSomeone(false)}>Not now</button>
        </div>
      ) : null}

      {activeStep === "done" && !askSomeone ? (
        <div className="practice-stage practice-finish">
          <span className="finish-icon" aria-hidden="true"><Check size={31} /></span>
          <header>
            <h1 id="practice-step-heading" ref={headingRef} tabIndex={-1}>Practice complete.</h1>
            <p>You can return to this word from Memories.</p>
          </header>
          {message ? <p className="practice-message" role="status" aria-live="polite">{message}</p> : null}
          <Link className="primary-action practice-primary" href="/">Finish</Link>
          <button className="quiet-action" type="button" onClick={() => setAskSomeone(true)}>Save a question</button>
        </div>
      ) : null}
    </section>
  );
}
