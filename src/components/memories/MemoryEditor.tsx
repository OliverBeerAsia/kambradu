"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useKambraduData } from "@/lib/hooks/use-kambradu-data";

export function MemoryEditor({ memoryId }: { memoryId: string }) {
  const { sortedMemories, isHydrated, updateMemory, deleteMemory, saveStatus } = useKambraduData();
  const memory = sortedMemories.find((item) => item.id === memoryId);
  const [title, setTitle] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const [context, setContext] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!isHydrated) return <div className="page form-page"><p role="status">Opening memory.</p></div>;
  if (deleted) return <div className="page completion-page"><h1>Memory deleted.</h1><Link className="primary-action" href="/memories">Back to Memories</Link></div>;
  if (!memory) return <div className="page completion-page"><h1>Memory not found.</h1><Link className="primary-action" href="/memories">Back to Memories</Link></div>;

  const currentTitle = title ?? memory.title;
  const currentDetail = detail ?? memory.detail;
  const currentContext = context ?? memory.context;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateMemory({ ...memory!, title: currentTitle.trim(), detail: currentDetail.trim(), context: currentContext.trim(), updatedAt: new Date().toISOString() });
  }

  return (
    <div className="page form-page">
      <Link className="back-link" href="/memories"><ArrowLeft size={18} aria-hidden="true" />Memories</Link>
      <header className="page-heading">
        <h1>Edit memory.</h1>
      </header>
      <form className="memory-form" onSubmit={submit}>
        <label><span>{memory.kind === "word" ? "Word or phrase" : "Title"}</span><input required value={currentTitle} onChange={(event) => setTitle(event.target.value)} /></label>
        <label><span>{memory.kind === "word" ? "Meaning" : "Memory"}</span><textarea required rows={4} value={currentDetail} onChange={(event) => setDetail(event.target.value)} /></label>
        <label><span>Personal context</span><textarea rows={3} value={currentContext} onChange={(event) => setContext(event.target.value)} /></label>
        <button className="primary-action" type="submit">Save changes</button>
      </form>
      {saveStatus ? <p className={saveStatus.kind === "error" ? "error-notice" : "save-notice"} role="status">{saveStatus.message}</p> : null}
      {memory.linkedEntryId ? <Link className="secondary-action" href={`/practice?lesson=${memory.linkedEntryId === "janela" ? "home-objects" : "shop-visit"}`}>Practise this word</Link> : null}
      {!confirmDelete ? <button className="delete-link" type="button" onClick={() => setConfirmDelete(true)}><Trash2 size={18} aria-hidden="true" />Delete memory</button> : (
        <div className="delete-confirm"><p>Delete this memory from this browser?</p><button className="danger-button" type="button" onClick={() => { deleteMemory(memory.id); setDeleted(true); }}>Yes, delete</button><button type="button" onClick={() => setConfirmDelete(false)}>Cancel</button></div>
      )}
    </div>
  );
}
