"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useKambraduData } from "@/lib/hooks/use-kambradu-data";
import type { LocalMemory, MemoryKind } from "@/lib/local-data";

export function MemoryCapture() {
  const { addMemory, isHydrated, saveStatus } = useKambraduData();
  const [kind, setKind] = useState<MemoryKind>("note");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [context, setContext] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = new Date().toISOString();
    const memory: LocalMemory = {
      id: `memory-${Date.now()}`,
      kind,
      title: title.trim(),
      detail: detail.trim(),
      context: context.trim(),
      createdAt: now,
      updatedAt: now
    };
    if (addMemory(memory)) setSaved(true);
  }

  if (saved) {
    return (
      <div className="page form-page completion-page">
        <Check size={38} aria-hidden="true" />
        <h1>Saved in this browser.</h1>
        <p>You can edit, export or delete it from Memories.</p>
        {saveStatus?.kind === "error" ? <p className="error-notice" role="alert">{saveStatus.message}</p> : null}
        <Link className="primary-action" href="/memories">Done</Link>
      </div>
    );
  }

  return (
    <div className="page form-page">
      <Link className="back-link" href="/memories"><ArrowLeft size={18} aria-hidden="true" />Memories</Link>
      <header className="page-heading">
        <h1>Add a memory.</h1>
      </header>
      <form className="memory-form" onSubmit={submit}>
        <fieldset className="kind-switch">
          <legend>What are you keeping?</legend>
          <button aria-pressed={kind === "note"} type="button" onClick={() => setKind("note")}>A note</button>
          <button aria-pressed={kind === "word"} type="button" onClick={() => setKind("word")}>A word</button>
        </fieldset>
        <label><span>{kind === "word" ? "Word or phrase" : "Short title"}</span><input required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label><span>{kind === "word" ? "Meaning" : "What do you want to remember?"}</span><textarea required rows={4} value={detail} onChange={(event) => setDetail(event.target.value)} /></label>
        <label><span>Personal context <small>optional</small></span><textarea rows={3} value={context} onChange={(event) => setContext(event.target.value)} /></label>
        <button className="primary-action" type="submit" disabled={!isHydrated || !title.trim() || !detail.trim()}>Save in this browser</button>
        {saveStatus?.kind === "error" ? <p className="error-notice" role="alert">{saveStatus.message}</p> : null}
      </form>
    </div>
  );
}
