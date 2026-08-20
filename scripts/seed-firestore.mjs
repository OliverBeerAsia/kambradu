import { readFile } from "node:fs/promises";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { validateSeedPayload } from "./validate-seed.mjs";

const seedPath = process.argv[2] || "scripts/seeds/kristang-curated-sample.json";
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "kambradu";

// Fail before credentials are loaded or the file is even read.
if (seedPath.includes("quarantine")) {
  throw new Error("Quarantined seed files must never be deployed.");
}

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  return applicationDefault();
}

const app = initializeApp({
  credential: getCredential(),
  projectId
});

const db = getFirestore(app);
const payload = JSON.parse(await readFile(seedPath, "utf8"));
const now = FieldValue.serverTimestamp();
const batch = db.batch();

validateSeedPayload(payload, seedPath);

batch.set(
  db.collection("communities").doc(payload.community.id),
  {
    ...payload.community,
    updatedAt: now
  },
  { merge: true }
);

for (const entry of payload.lexicalEntries ?? []) {
  batch.set(
    db.collection("lexicalEntries").doc(entry.id),
    {
      ...entry,
      seededAt: now,
      updatedAt: now
    },
    { merge: true }
  );
}

await batch.commit();

console.log(
  `Seeded ${payload.lexicalEntries?.length ?? 0} lexical entries and ${payload.stories?.length ?? 0} stories into ${projectId}.`
);
