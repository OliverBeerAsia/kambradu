"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  type Auth
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  getFirestore,
  type Firestore
} from "firebase/firestore";
import { connectStorageEmulator, getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig, isFirebaseConfigured, useFirebaseEmulators } from "@/lib/firebase/config";

let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let storageInstance: FirebaseStorage | null = null;
let persistenceStarted = false;
let emulatorsConnected = false;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    return null;
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  if (!authInstance) {
    authInstance = getAuth(app);
    maybeConnectEmulators();
  }

  return authInstance;
}

export function getGoogleProvider() {
  return new GoogleAuthProvider();
}

export function getFirestoreClient(): Firestore | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  if (!dbInstance) {
    dbInstance = getFirestore(app);
    maybeConnectEmulators();

    if (typeof window !== "undefined" && !persistenceStarted) {
      persistenceStarted = true;
      enableIndexedDbPersistence(dbInstance).catch(() => undefined);
    }
  }

  return dbInstance;
}

export function getStorageClient(): FirebaseStorage | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  if (!storageInstance) {
    storageInstance = getStorage(app);
    maybeConnectEmulators();
  }

  return storageInstance;
}

function maybeConnectEmulators() {
  if (!useFirebaseEmulators || emulatorsConnected || typeof window === "undefined") {
    return;
  }

  emulatorsConnected = true;

  const auth = authInstance;
  const db = dbInstance;
  const storage = storageInstance;

  if (auth) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  }

  if (db) {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }

  if (storage) {
    connectStorageEmulator(storage, "127.0.0.1", 9199);
  }
}
