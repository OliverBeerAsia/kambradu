import { readFile } from "node:fs/promises";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const seedPath = process.argv[2] || "scripts/seeds/kristang-curated-sample.json";
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "kambradu";

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

if (!payload.community?.id) {
  throw new Error("Seed file must include community.id");
}

batch.set(
  db.collection("communities").doc(payload.community.id),
  {
    ...payload.community,
    updatedAt: now
  },
  { merge: true }
);

for (const entry of payload.lexicalEntries ?? []) {
  if (!entry.id) {
    throw new Error("Every lexical entry needs an id");
  }

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

for (const story of payload.stories ?? []) {
  if (!story.id) {
    throw new Error("Every story needs an id");
  }

  batch.set(
    db.collection("stories").doc(story.id),
    {
      ...story,
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
