export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
);

export const isDemoFirebaseProject = firebaseConfig.projectId?.startsWith("demo-") ?? false;

export const useFirebaseEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" || isDemoFirebaseProject;

export const firebaseEmulatorConfig = {
  host: process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "127.0.0.1",
  authPort: Number(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT || 9099),
  firestorePort: Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || 8080),
  storagePort: Number(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT || 9199)
};
