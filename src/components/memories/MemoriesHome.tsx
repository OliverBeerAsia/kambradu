"use client";

import Link from "next/link";
import { BookHeart, Download, FileUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useKambraduData } from "@/lib/hooks/use-kambradu-data";
import { clearRecordings, exportRecordings, importRecordings } from "@/lib/recordings";
import { LANGUAGE_TAG } from "@/lib/language";

export function MemoriesHome() {
  const { data, sortedMemories, isHydrated, corruptRaw, saveStatus, clearAll, restore, discardCorruptData } = useKambraduData();
  const [confirmClear, setConfirmClear] = useState(false);
  const [restoreError, setRestoreError] = useState("");
  const restoreRef = useRef<HTMLInputElement>(null);

  function download(name: string, contents: string) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([contents], { type: "application/json" }));
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function exportBackup() {
    // Recordings live in IndexedDB, so the backup is assembled asynchronously.
    const payload = { ...data, recordings: await exportRecordings() };
    download(`kambradu-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2));
  }

  async function restoreBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      restore(text);
      await importRecordings((JSON.parse(text) as { recordings?: unknown }).recordings);
      setRestoreError("");
    } catch (error) {
      setRestoreError(error instanceof Error ? error.message : "That backup could not be restored.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="page memories-page">
      <header className="page-heading memories-heading">
        <div>
          <h1>Keep what matters.</h1>
          <p>Your words and notes, saved in this browser.</p>
        </div>
        <Link className="primary-action" href="/memories/new"><Plus size={20} aria-hidden="true" />Add a memory</Link>
      </header>

      {corruptRaw ? (
        <section className="recovery-notice" aria-labelledby="recovery-heading">
          <h2 id="recovery-heading">Stored data needs attention.</h2>
          <p>Kambradu left the unreadable data in place. Download it before starting fresh.</p>
          <div className="button-row">
            <button type="button" onClick={() => download("kambradu-unreadable-data.json", corruptRaw)}><Download size={18} aria-hidden="true" />Download unreadable data</button>
            <button className="danger-button" type="button" onClick={discardCorruptData}>Start fresh</button>
          </div>
        </section>
      ) : null}

      {saveStatus ? <p className={saveStatus.kind === "error" ? "error-notice" : "save-notice"} role={saveStatus.kind === "error" ? "alert" : "status"}>{saveStatus.message}</p> : null}

      {!isHydrated ? <p className="empty-state" role="status">Loading your memories.</p> : sortedMemories.length ? (
        <ul className="memory-list">
          {sortedMemories.map((memory) => (
            <li key={memory.id}>
              <Link className="memory-link" href={`/memories/${encodeURIComponent(memory.id)}`}>
                <span>
                  <small>{memory.kind === "word" ? "Word" : "Note"}</small>
                  <strong lang={memory.linkedEntryId ? LANGUAGE_TAG : undefined}>{memory.title}</strong>
                  <span>{memory.detail}</span>
                </span>
                <span>Open</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <section className="empty-state">
          <BookHeart size={36} aria-hidden="true" />
          <h2>No memories yet.</h2>
          <p>Keep a word or note when it means something to you.</p>
        </section>
      )}

      {!corruptRaw ? (
        <details className="data-controls">
          <summary>Backup and browser data</summary>
          <div className="data-control-grid">
            <button type="button" onClick={exportBackup}><Download size={18} aria-hidden="true" />Export backup</button>
            <button type="button" onClick={() => restoreRef.current?.click()}><FileUp size={18} aria-hidden="true" />Restore backup</button>
            <input ref={restoreRef} className="sr-only" type="file" accept="application/json,.json" onChange={restoreBackup} />
            {!confirmClear ? <button className="danger-button" type="button" onClick={() => setConfirmClear(true)}><Trash2 size={18} aria-hidden="true" />Clear all</button> : (
              <div className="clear-confirm">
                <span>Clear every memory, review and recording?</span>
                <button className="danger-button" type="button" onClick={() => { clearAll(); void clearRecordings(); setConfirmClear(false); }}>Yes, clear all</button>
                <button type="button" onClick={() => setConfirmClear(false)}>Cancel</button>
              </div>
            )}
          </div>
          {restoreError ? <p className="error-notice" role="alert">{restoreError}</p> : null}
          <p><RotateCcw size={15} aria-hidden="true" />Backups include memories, reviews, recordings and unfinished practice.</p>
        </details>
      ) : null}
    </div>
  );
}
