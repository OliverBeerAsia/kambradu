import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const projectId = `kambradu-rules-${Date.now()}`;
let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8")
    }
  });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "communities/kristang-melaka"), {
      name: "Kristang / Melaka",
      defaultAccess: "community"
    });
    await setDoc(doc(db, "communities/kristang-melaka/memberships/learner"), {
      role: "learner"
    });
    await setDoc(doc(db, "communities/kristang-melaka/memberships/steward"), {
      role: "steward"
    });
    await setDoc(doc(db, "lexicalEntries/open-entry"), {
      communityId: "kristang-melaka",
      reviewStatus: "approved",
      access: "open",
      headword: "loja"
    });
    await setDoc(doc(db, "lexicalEntries/community-entry"), {
      communityId: "kristang-melaka",
      reviewStatus: "approved",
      access: "community",
      headword: "kalderada"
    });
    await setDoc(doc(db, "users/learner/journalEntries/private-note"), {
      userId: "learner",
      title: "Private note"
    });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test("public users can read approved open content only", async () => {
  const db = testEnv.unauthenticatedContext().firestore();

  await assertSucceeds(getDoc(doc(db, "lexicalEntries/open-entry")));
  await assertFails(getDoc(doc(db, "lexicalEntries/community-entry")));
});

test("journal entries are owner-private", async () => {
  const ownerDb = testEnv.authenticatedContext("learner").firestore();
  const otherDb = testEnv.authenticatedContext("other").firestore();

  await assertSucceeds(getDoc(doc(ownerDb, "users/learner/journalEntries/private-note")));
  await assertFails(getDoc(doc(otherDb, "users/learner/journalEntries/private-note")));
});

test("contributors can submit drafts with required fields", async () => {
  const db = testEnv.authenticatedContext("learner").firestore();

  await assertSucceeds(
    setDoc(doc(db, "contributions/new-word"), {
      communityId: "kristang-melaka",
      contentType: "word",
      title: "papiá",
      body: "Suggested entry",
      provenance: "Family note",
      consent: "Permission granted for community review",
      access: "community",
      attributionName: "Learner",
      reviewStatus: "submitted",
      submittedBy: "learner"
    })
  );
});

test("only stewards can approve submitted contributions", async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "contributions/pending"), {
      communityId: "kristang-melaka",
      contentType: "word",
      title: "janela",
      body: "Pronunciation note",
      provenance: "Learner note",
      consent: "Text contribution",
      access: "open",
      attributionName: "Learner",
      reviewStatus: "submitted",
      submittedBy: "learner"
    });
  });

  const learnerDb = testEnv.authenticatedContext("learner").firestore();
  const stewardDb = testEnv.authenticatedContext("steward").firestore();

  await assertFails(updateDoc(doc(learnerDb, "contributions/pending"), { reviewStatus: "approved" }));
  await assertSucceeds(updateDoc(doc(stewardDb, "contributions/pending"), { reviewStatus: "approved" }));

  const approved = await getDoc(doc(stewardDb, "contributions/pending"));
  assert.equal(approved.data()?.reviewStatus, "approved");
});

test("practice reviews are private to the learner and require scheduler fields", async () => {
  const learnerDb = testEnv.authenticatedContext("learner").firestore();
  const otherDb = testEnv.authenticatedContext("other").firestore();
  const reviewRef = doc(learnerDb, "users/learner/practiceReviews/listen-loja");

  await assertSucceeds(
    setDoc(reviewRef, {
      userId: "learner",
      communityId: "kristang-melaka",
      promptId: "listen-loja",
      promptKind: "listen-recall",
      confidence: "almost",
      reviewedAt: "2026-05-18T00:00:00.000Z",
      nextReviewAt: "2026-05-20T00:00:00.000Z",
      intervalDays: 2,
      ease: 2,
      reflection: "Need more listening before text."
    })
  );
  await assertFails(getDoc(doc(otherDb, "users/learner/practiceReviews/listen-loja")));
  await assertFails(
    setDoc(doc(learnerDb, "users/learner/practiceReviews/bad-review"), {
      userId: "learner",
      communityId: "kristang-melaka",
      promptId: "listen-loja",
      confidence: "almost"
    })
  );
});

test("speaker checks stay owner-private with explicit consent state", async () => {
  const learnerDb = testEnv.authenticatedContext("learner").firestore();
  const stewardDb = testEnv.authenticatedContext("steward").firestore();
  const checkRef = doc(learnerDb, "users/learner/speakerChecks/shop-check");

  await assertSucceeds(
    setDoc(checkRef, {
      userId: "learner",
      communityId: "kristang-melaka",
      linkedEntryId: "loja",
      question: "Can you confirm the family pronunciation?",
      speakerDisplayName: "Private speaker",
      relationship: "family",
      consentStatus: "community-review",
      access: "community",
      status: "ready-for-review",
      createdAt: "2026-05-18T00:00:00.000Z"
    })
  );
  await assertFails(getDoc(doc(stewardDb, "users/learner/speakerChecks/shop-check")));
  await assertFails(
    setDoc(doc(learnerDb, "users/learner/speakerChecks/bad-check"), {
      userId: "learner",
      communityId: "kristang-melaka",
      question: "Can this be published?",
      speakerDisplayName: "Private speaker",
      consentStatus: "unknown",
      access: "community",
      status: "ready-for-review"
    })
  );
});
