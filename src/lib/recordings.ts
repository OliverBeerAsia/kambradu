/**
 * Storage for a learner's own practice recordings.
 *
 * These are the learner's voice, kept in their own browser. They are never
 * uploaded, never scored, never compared against a speaker, and never shown to
 * anyone else. Community and speaker audio is a different thing entirely and
 * stays behind the partnership gate in docs/roadmap.md.
 *
 * Audio lives in IndexedDB rather than localStorage because blobs do not belong
 * in a string store and would exhaust the quota that holds the learner's notes.
 */

const DATABASE_NAME = "kambradu-recordings";
const DATABASE_VERSION = 1;
const STORE = "recordings";

export type StoredRecording = {
  /** The lexical entry the attempt belongs to. One kept attempt per word. */
  entryId: string;
  blob: Blob;
  mimeType: string;
  durationMs: number;
  createdAt: string;
};

export function recordingsSupported(): boolean {
  return typeof indexedDB !== "undefined" && typeof MediaRecorder !== "undefined";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE, { keyPath: "entryId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open recording storage."));
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(STORE, mode);
      const request = run(transaction.objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("Recording storage failed."));
    });
  } finally {
    database.close();
  }
}

export async function saveRecording(recording: StoredRecording): Promise<void> {
  await withStore("readwrite", (store) => store.put(recording) as IDBRequest<IDBValidKey>);
}

export async function getRecording(entryId: string): Promise<StoredRecording | undefined> {
  return withStore("readonly", (store) => store.get(entryId) as IDBRequest<StoredRecording | undefined>);
}

export async function deleteRecording(entryId: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(entryId) as IDBRequest<undefined>);
}

export async function listRecordings(): Promise<StoredRecording[]> {
  return withStore("readonly", (store) => store.getAll() as IDBRequest<StoredRecording[]>);
}

export async function clearRecordings(): Promise<void> {
  await withStore("readwrite", (store) => store.clear() as IDBRequest<undefined>);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error ?? new Error("Could not read a recording."));
    reader.readAsDataURL(blob);
  });
}

export type ExportedRecording = Omit<StoredRecording, "blob"> & { base64: string };

/** Recordings travel with a backup so a learner does not lose their voice on restore. */
export async function exportRecordings(): Promise<ExportedRecording[]> {
  if (!recordingsSupported()) return [];
  const stored = await listRecordings();
  return Promise.all(
    stored.map(async ({ blob, ...rest }) => ({ ...rest, base64: await blobToBase64(blob) }))
  );
}

export async function importRecordings(exported: unknown): Promise<number> {
  if (!recordingsSupported() || !Array.isArray(exported)) return 0;
  let restored = 0;
  for (const item of exported) {
    if (!item || typeof item !== "object") continue;
    const { entryId, base64, mimeType, durationMs, createdAt } = item as ExportedRecording;
    if (typeof entryId !== "string" || typeof base64 !== "string" || typeof mimeType !== "string") continue;
    const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    await saveRecording({
      entryId,
      blob: new Blob([bytes], { type: mimeType }),
      mimeType,
      durationMs: typeof durationMs === "number" ? durationMs : 0,
      createdAt: typeof createdAt === "string" ? createdAt : new Date().toISOString()
    });
    restored += 1;
  }
  return restored;
}
