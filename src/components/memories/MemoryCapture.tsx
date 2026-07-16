"use client";

import Link from "next/link";
import { ArrowLeft, BookOpenText, Box, Check, MessageCircle, NotebookPen } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { kristangCommunity } from "@/data/kristang";
import { useMemoriesData } from "@/lib/hooks/use-memories-data";
import type { JournalEntry, PersonalLexiconEntry } from "@/types/kambradu";

type MemoryKind = "heard" | "word" | "note" | "object";
type CaptureStage = "choose" | "detail" | "context" | "saved";

const choices: Array<{ id: MemoryKind; label: string; detail: string; icon: typeof MessageCircle }> = [
  { id: "heard", label: "Something someone said", detail: "Keep the words, not a recording", icon: MessageCircle },
  { id: "word", label: "A word or phrase", detail: "Add it to your own word list", icon: BookOpenText },
  { id: "note", label: "A story or note", detail: "Write down what matters", icon: NotebookPen },
  { id: "object", label: "An object or keepsake", detail: "Keep a note about it", icon: Box }
];

export function MemoryCapture() {
  const { addJournalEntry, addPersonalLexiconEntry, isHydrated } = useMemoriesData();
  const [kind, setKind] = useState<MemoryKind | null>(null);
  const [stage, setStage] = useState<CaptureStage>("choose");
  const [detail, setDetail] = useState("");
  const [context, setContext] = useState("");
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const detailRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (stage !== "choose") {
      headingRef.current?.focus();
    }
  }, [stage]);

  function choose(nextKind: MemoryKind) {
    setKind(nextKind);
    setDetail("");
    setContext("");
    setError("");
    setStage("detail");
  }

  function submitDetail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!detail.trim()) {
      setError(kind === "word" ? "Add a word or phrase first." : "Enter a note to continue.");
      detailRef.current?.focus();
      return;
    }

    setError("");
    if (kind === "word" || kind === "heard") {
      setStage("context");
      return;
    }

    saveMemory();
  }

  function saveMemory(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const now = new Date().toISOString();

    if (kind === "word") {
      const entry: PersonalLexiconEntry = {
        id: `users/demo/personalLexicon/memory-${slugify(detail)}-${Date.now()}`,
        userId: "demo",
        communityId: kristangCommunity.id,
        headword: detail.trim(),
        englishGloss: context.trim() || "Meaning to add later",
        alternateSpellings: "",
        example: "",
        sourceNote: "Saved on this device from My memories. This note has not been checked.",
        access: "restricted",
        status: "private",
        createdAt: now
      };
      addPersonalLexiconEntry(entry);
    } else if (kind) {
      const label = kind === "heard" ? "Something I heard" : kind === "object" ? "Object memory" : "Note";
      const sourceLine = context.trim() ? `\n\nWhere I encountered it: ${context.trim()}` : "";
      const entry: JournalEntry = {
        id: `users/demo/journalEntries/memory-${slugify(detail)}-${Date.now()}`,
        userId: "demo",
        communityId: kristangCommunity.id,
        title: label,
        body: `${detail.trim()}${sourceLine}`,
        tags: ["memory", kind],
        linkedEntryIds: [],
        isPrivate: true,
        createdAt: now
      };
      addJournalEntry(entry);
    }

    setStage("saved");
  }

  function goBack() {
    setError("");
    if (stage === "context") {
      setStage("detail");
    } else {
      setStage("choose");
      setKind(null);
    }
  }

  if (stage === "saved") {
    return (
      <section className="memory-capture memory-capture-finish" aria-labelledby="capture-heading">
        <span className="memory-finish-mark" aria-hidden="true"><Check size={30} /></span>
        <h1 id="capture-heading" ref={headingRef} tabIndex={-1}>Saved on this device</h1>
        <p>Saved in this browser profile.</p>
        <Link className="primary-action" href="/saved" prefetch={false}>Done</Link>
        <button className="quiet-action" type="button" onClick={() => {
          setKind(null);
          setDetail("");
          setContext("");
          setStage("choose");
        }}>Add another</button>
      </section>
    );
  }

  if (stage === "choose") {
    return (
      <section className="memory-capture" aria-labelledby="capture-heading">
        <Link className="memory-back-link" href="/saved" prefetch={false}><ArrowLeft size={18} aria-hidden="true" />My memories</Link>
        <header className="capture-heading">
          <h1 id="capture-heading">What would you like to keep?</h1>
        </header>
        <div className="memory-kind-grid" role="group" aria-label="Memory type">
          {choices.map((choice) => {
            const Icon = choice.icon;
            return (
              <button key={choice.id} type="button" onClick={() => choose(choice.id)}>
                <span aria-hidden="true"><Icon size={24} /></span>
                <strong>{choice.label}</strong>
                <small>{choice.detail}</small>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  const isWord = kind === "word";
  const isHeard = kind === "heard";
  const question = isWord
    ? "What word or phrase?"
    : isHeard
      ? "What did you hear?"
      : kind === "object"
        ? "What do you want to remember about it?"
        : "What would you like to remember?";

  if (stage === "detail") {
    return (
      <section className="memory-capture" aria-labelledby="capture-heading">
        <button className="memory-back-link" type="button" onClick={goBack}><ArrowLeft size={18} aria-hidden="true" />Back</button>
        <form className="capture-form" onSubmit={submitDetail}>
          <header className="capture-heading">
            <h1 id="capture-heading" ref={headingRef} tabIndex={-1}>{question}</h1>
            <p>Other people using this browser profile may be able to see it.</p>
          </header>
          <label>
            <span className="sr-only">{question}</span>
            {isWord ? (
              <input ref={detailRef as React.RefObject<HTMLInputElement>} aria-invalid={Boolean(error)} aria-describedby={error ? "capture-error" : undefined} required value={detail} onChange={(event) => setDetail(event.target.value)} />
            ) : (
              <textarea ref={detailRef as React.RefObject<HTMLTextAreaElement>} aria-invalid={Boolean(error)} aria-describedby={error ? "capture-error" : undefined} required rows={5} value={detail} onChange={(event) => setDetail(event.target.value)} />
            )}
          </label>
          {error ? <p className="capture-error" id="capture-error" role="alert">{error}</p> : null}
          <button className="primary-action" type="submit" disabled={!isHydrated}>{isWord || isHeard ? "Next" : "Save on this device"}</button>
        </form>
      </section>
    );
  }

  const contextQuestion = isWord ? "What meaning or context would you like to note?" : "Where did you hear or encounter it?";

  return (
    <section className="memory-capture" aria-labelledby="capture-heading">
      <button className="memory-back-link" type="button" onClick={goBack}><ArrowLeft size={18} aria-hidden="true" />Back</button>
      <form className="capture-form" onSubmit={saveMemory}>
        <header className="capture-heading">
          <h1 id="capture-heading" ref={headingRef} tabIndex={-1}>{contextQuestion}</h1>
          <p>This part is optional.</p>
        </header>
        <label>
          <span className="sr-only">{contextQuestion}</span>
          <textarea rows={4} value={context} onChange={(event) => setContext(event.target.value)} />
        </label>
        <button className="primary-action" type="submit" disabled={!isHydrated}>Save on this device</button>
      </form>
    </section>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42) || "item";
}
