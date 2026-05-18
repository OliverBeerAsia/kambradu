"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, Eye, EyeOff, FileText, Mic, Play, ShieldCheck, Users, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AccessPill } from "@/components/ui/AccessPill";
import { LedgerStrip, WorkbenchHeader, cycleLedgerItems } from "@/components/ui/Workbench";
import { Waveform } from "@/components/ui/Waveform";
import { practicePrompts } from "@/data/kristang";
import { useLearningCycles } from "@/lib/hooks/use-learning-cycles";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage-state";
import { formatReviewDate, scheduleNextPracticeReview } from "@/lib/practice-scheduler";
import type { AccessLevel, PracticeReview, ReviewConfidence, SpeakerCheck } from "@/types/kambradu";

type PracticeStep = "listen" | "recall" | "use" | "speaker" | "done";
type PracticeConfidence = Exclude<ReviewConfidence, "new">;
type SpeakerCheckDraft = Pick<SpeakerCheck, "speakerDisplayName" | "relationship" | "question" | "consentStatus">;

const steps: Array<{ id: PracticeStep; label: string }> = [
  { id: "listen", label: "Listen" },
  { id: "recall", label: "Recall" },
  { id: "use", label: "Use it" },
  { id: "speaker", label: "Speaker check" },
  { id: "done", label: "Done" }
];

const confidenceChoices: Array<{ id: PracticeConfidence; label: string; detail: string }> = [
  { id: "again", label: "Need this again", detail: "Review tomorrow" },
  { id: "almost", label: "Almost had it", detail: "Review in 2 days" },
  { id: "steady", label: "I heard it", detail: "Stretch interval" }
];

const initialReflections: Record<string, string> = {};
const initialSpeakerDraft: SpeakerCheckDraft = {
  speakerDisplayName: "",
  relationship: "",
  question: "",
  consentStatus: "not-asked"
};
const initialReviews: PracticeReview[] = [];
const initialSpeakerChecks: SpeakerCheck[] = [];

function accessForConsent(status: SpeakerCheckDraft["consentStatus"]): AccessLevel {
  if (status === "publish-approved") {
    return "open";
  }

  if (status === "community-review") {
    return "community";
  }

  return "restricted";
}

function statusForConsent(status: SpeakerCheckDraft["consentStatus"]): SpeakerCheck["status"] {
  return status === "community-review" || status === "publish-approved" ? "ready-for-review" : "private-draft";
}

export function PracticeSession() {
  const { activeCycle, attachPracticeReview, attachSpeakerCheck } = useLearningCycles();
  const [activePromptId, setActivePromptId] = useLocalStorageState("kambradu-practice-active-prompt-v1", practicePrompts[0]?.id ?? "");
  const [activeStep, setActiveStep] = useLocalStorageState<PracticeStep>("kambradu-practice-step-v1", "listen");
  const [reviews, setReviews] = useLocalStorageState<PracticeReview[]>("kambradu-practice-reviews-v1", initialReviews);
  const [speakerChecks, setSpeakerChecks] = useLocalStorageState<SpeakerCheck[]>("kambradu-speaker-checks-v1", initialSpeakerChecks);
  const [reflections, setReflections] = useLocalStorageState<Record<string, string>>("kambradu-practice-reflections-v1", initialReflections);
  const [speakerDraft, setSpeakerDraft] = useLocalStorageState<SpeakerCheckDraft>("kambradu-speaker-check-draft-v1", initialSpeakerDraft);
  const [confidence, setConfidence] = useLocalStorageState<PracticeConfidence>("kambradu-practice-confidence-v1", "almost");
  const [showText, setShowText] = useState(false);
  const [message, setMessage] = useState("");
  const activePrompts = useMemo(() => {
    const cyclePrompts = practicePrompts.filter((prompt) => activeCycle.practicePromptIds.includes(prompt.id));
    return cyclePrompts.length ? cyclePrompts : practicePrompts;
  }, [activeCycle.practicePromptIds]);
  const activePrompt = activePrompts.find((prompt) => prompt.id === activePromptId) ?? activePrompts[0] ?? practicePrompts[0];
  const reflection = reflections[activePrompt.id] ?? "";
  const previousReview = useMemo(
    () => [...reviews].reverse().find((review) => review.promptId === activePrompt.id),
    [activePrompt.id, reviews]
  );
  const consentAccess = accessForConsent(speakerDraft.consentStatus);
  const readyForContribution = speakerDraft.consentStatus === "community-review" || speakerDraft.consentStatus === "publish-approved";
  const currentPromptChecks = speakerChecks.filter((check) => check.linkedEntryId === activePrompt.lexicalEntryId);

  useEffect(() => {
    if (!activePrompts.some((prompt) => prompt.id === activePromptId)) {
      setActivePromptId(activePrompts[0]?.id ?? practicePrompts[0]?.id ?? "");
      setActiveStep("listen");
      setShowText(false);
    }
  }, [activePromptId, activePrompts, setActivePromptId, setActiveStep]);

  function updateReflection(value: string) {
    setReflections((current) => ({ ...current, [activePrompt.id]: value }));
  }

  function updateSpeakerDraft<K extends keyof SpeakerCheckDraft>(key: K, value: SpeakerCheckDraft[K]) {
    setSpeakerDraft((current) => ({ ...current, [key]: value }));
  }

  function saveReview() {
    const schedule = scheduleNextPracticeReview(confidence, previousReview?.intervalDays ?? 0);
    const nextReview: PracticeReview = {
      id: `users/demo/practiceReviews/practice-${activePrompt.id}-${Date.now()}`,
      userId: "demo",
      communityId: activePrompt.communityId,
      promptId: activePrompt.id,
      lexicalEntryId: activePrompt.lexicalEntryId,
      lessonId: activePrompt.lessonId,
      promptKind: activePrompt.promptKind,
      confidence,
      reflection,
      ...schedule
    };

    setReviews((current) => [nextReview, ...current]);
    attachPracticeReview(nextReview.id);
    setActiveStep("done");
    setMessage(`Saved on this device. Next review: ${formatReviewDate(schedule.nextReviewAt)}.`);
  }

  function saveSpeakerCheck() {
    const question = speakerDraft.question.trim() || activePrompt.speakerQuestion;
    const check: SpeakerCheck = {
      id: `users/demo/speakerChecks/speaker-check-${activePrompt.id}-${Date.now()}`,
      userId: "demo",
      communityId: activePrompt.communityId,
      linkedEntryId: activePrompt.lexicalEntryId,
      speakerDisplayName: speakerDraft.speakerDisplayName.trim() || "Private speaker",
      relationship: (speakerDraft.relationship ?? "").trim(),
      question,
      consentStatus: speakerDraft.consentStatus,
      access: consentAccess,
      status: statusForConsent(speakerDraft.consentStatus),
      createdAt: new Date().toISOString()
    };

    setSpeakerChecks((current) => [check, ...current]);
    attachSpeakerCheck(check.id);
    setMessage(
      readyForContribution
        ? "Speaker check saved as review-ready. Prepare the contribution only after the speaker confirms consent."
        : "Speaker check saved privately. Keep it restricted until consent is clear."
    );
  }

  return (
    <section className="practice-workbench" aria-label="Audio-first daily practice">
      <article className="practice-panel practice-main-panel">
        <WorkbenchHeader
          title={`${activeCycle.title}: practice`}
          description="Prompts are filtered to the active learning cycle, so practice feeds the same local review packet."
          cycle={activeCycle}
        />
        <LedgerStrip items={cycleLedgerItems(activeCycle)} />

        <div className="rail-title compact-title">
          <h2>Today&apos;s 10-minute practice</h2>
          <Volume2 size={18} aria-hidden="true" />
        </div>

        <div className="practice-prompt-switcher" aria-label="Practice prompts">
          {activePrompts.map((prompt) => (
            <button
              aria-pressed={activePrompt.id === prompt.id}
              className={activePrompt.id === prompt.id ? "active" : ""}
              key={prompt.id}
              onClick={() => {
                setActivePromptId(prompt.id);
                setActiveStep("listen");
                setShowText(false);
                setMessage("");
                setSpeakerDraft((current) => ({
                  ...current,
                  question: prompt.speakerQuestion
                }));
              }}
              type="button"
            >
              {prompt.title}
            </button>
          ))}
        </div>

        <div className="practice-stepper" aria-label="Practice steps">
          {steps.map((step, index) => (
            <button
              aria-pressed={activeStep === step.id}
              className={activeStep === step.id ? "active" : ""}
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              type="button"
            >
              <span>{index + 1}</span>
              {step.label}
            </button>
          ))}
        </div>

        <div className="practice-audio-card">
          <button className="practice-play-button" type="button" onClick={() => setActiveStep("listen")} aria-label="Play practice prompt">
            <Play size={26} aria-hidden="true" />
          </button>
          <div>
            <strong>{activePrompt.listenCue}</strong>
            <Waveform active={activeStep === "listen"} />
            <small>{activePrompt.hasAudio ? "Speaker audio ready" : "Needs speaker audio before publication"}</small>
          </div>
          <span className={activePrompt.hasAudio ? "audio-state ready" : "audio-state needed"}>
            {activePrompt.hasAudio ? "Audio" : "Private check"}
          </span>
        </div>

        <div className="practice-reveal">
          <div>
            <span className="practice-kicker">Hidden prompt</span>
            <h3>{showText ? activePrompt.headword : "Listen before reading"}</h3>
            <p>{showText ? activePrompt.englishGloss : "Reveal the word only after you have tried to recall it."}</p>
          </div>
          <button className="secondary-action inline-action" onClick={() => setShowText((current) => !current)} type="button">
            {showText ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            {showText ? "Hide text" : "Show text"}
          </button>
        </div>

        {showText && activePrompt.example ? (
          <blockquote className="practice-example">
            <span>{activePrompt.example}</span>
            <small>{activePrompt.exampleTranslation}</small>
          </blockquote>
        ) : null}

        <div className="recall-grid" aria-label="Recall confidence">
          {confidenceChoices.map((choice) => (
            <button
              aria-pressed={confidence === choice.id}
              className={confidence === choice.id ? "selected" : ""}
              key={choice.id}
              onClick={() => {
                setConfidence(choice.id);
                setActiveStep("recall");
              }}
              type="button"
            >
              <strong>{choice.label}</strong>
              <small>{choice.detail}</small>
            </button>
          ))}
        </div>

        <label className="reflection-box">
          Private use note
          <textarea
            rows={4}
            value={reflection}
            onChange={(event) => updateReflection(event.target.value)}
            onFocus={() => setActiveStep("use")}
            placeholder="Where would you say this in your family, kitchen, street, school, or community?"
          />
        </label>

        <div className="practice-actions">
          <button className="primary-action" type="button" onClick={saveReview}>
            <CheckCircle2 size={18} aria-hidden="true" />
            Save review locally
          </button>
          <Link className="secondary-action inline-action" href="/saved" prefetch={false}>
            <BookOpen size={17} aria-hidden="true" />
            Review saved words
          </Link>
        </div>

        {message ? <p className="form-message">{message}</p> : null}
      </article>

      <aside className="practice-side-panel">
        <section className="practice-panel hegel-practice-panel">
          <img src="/hegel.png" alt="" width={58} height={58} aria-hidden="true" />
          <div>
            <h2>Hegel says: private first</h2>
            <p>Speaker checks stay restricted until consent and access are explicit.</p>
          </div>
        </section>

        <section className="practice-panel speaker-check-panel">
          <div className="rail-title compact-title">
            <h2>Speaker check</h2>
            <Users size={18} aria-hidden="true" />
          </div>

          <label>
            Speaker name
            <input
              value={speakerDraft.speakerDisplayName}
              onChange={(event) => updateSpeakerDraft("speakerDisplayName", event.target.value)}
              placeholder="Aunty, parent, elder, teacher"
            />
          </label>

          <label>
            Relationship
            <input
              value={speakerDraft.relationship ?? ""}
              onChange={(event) => updateSpeakerDraft("relationship", event.target.value)}
              placeholder="Family, community speaker, steward"
            />
          </label>

          <label>
            Question for speaker
            <textarea
              rows={4}
              value={speakerDraft.question || activePrompt.speakerQuestion}
              onChange={(event) => updateSpeakerDraft("question", event.target.value)}
              onFocus={() => setActiveStep("speaker")}
            />
          </label>

          <label>
            Consent status
            <select
              value={speakerDraft.consentStatus}
              onChange={(event) => updateSpeakerDraft("consentStatus", event.target.value as SpeakerCheckDraft["consentStatus"])}
            >
              <option value="not-asked">Not asked yet</option>
              <option value="storage-only">Storage only</option>
              <option value="community-review">Community review allowed</option>
              <option value="publish-approved">Publication approved</option>
            </select>
          </label>

          <div className="speaker-access-row">
            <AccessPill level={consentAccess} />
            <span>{readyForContribution ? "Can be prepared for steward review" : "Private on this device"}</span>
          </div>

          <button className="secondary-action" type="button" onClick={saveSpeakerCheck}>
            <ShieldCheck size={17} aria-hidden="true" />
            Save speaker check
          </button>

          {readyForContribution ? (
            <Link className="primary-action" href="/contribute" prefetch={false}>
              <Mic size={17} aria-hidden="true" />
              Prepare contribution
            </Link>
          ) : (
            <span className="blocked-action">
              <ShieldCheck size={16} aria-hidden="true" />
              Contribution locked until consent is clearer
            </span>
          )}
        </section>

        <section className="practice-panel review-history-panel">
          <div className="rail-title compact-title">
            <h2>Local review state</h2>
            <FileText size={18} aria-hidden="true" />
          </div>

          <div className="review-history-list">
            {reviews.slice(0, 3).map((review) => (
              <article key={review.id}>
                <strong>{practicePrompts.find((prompt) => prompt.id === review.promptId)?.headword ?? "Practice item"}</strong>
                <span>{review.confidence}</span>
                <small>Next: {formatReviewDate(review.nextReviewAt)}</small>
              </article>
            ))}
            {reviews.length === 0 ? <p>No local practice reviews yet.</p> : null}
          </div>

          <div className="speaker-check-count">
            <span>{currentPromptChecks.length}</span>
            speaker checks for this prompt
            <ChevronRight size={16} aria-hidden="true" />
          </div>
        </section>
      </aside>
    </section>
  );
}
