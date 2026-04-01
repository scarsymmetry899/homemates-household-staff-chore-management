// Firebase client configuration
// Add your Firebase project config to .env.local:
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_AUTH_DOMAIN=...
//   VITE_FIREBASE_PROJECT_ID=...
//   VITE_FIREBASE_STORAGE_BUCKET=...
//   VITE_FIREBASE_MESSAGING_SENDER_ID=...
//   VITE_FIREBASE_APP_ID=...

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

// Dynamic import so the app works without Firebase keys
let _auth: unknown = null;
let _firestore: unknown = null;

export async function getFirebaseAuth() {
  if (!isFirebaseConfigured) return null;
  if (_auth) return _auth;
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig as Parameters<typeof initializeApp>[0]);
    _auth = getAuth(app);
    return _auth;
  } catch {
    return null;
  }
}

export async function getFirebaseFirestore() {
  if (!isFirebaseConfigured) return null;
  if (_firestore) return _firestore;
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig as Parameters<typeof initializeApp>[0]);
    _firestore = getFirestore(app);
    return _firestore;
  } catch {
    return null;
  }
}

// Sign in with Google popup (dynamic import)
export async function signInWithGoogle(): Promise<{ uid: string; displayName: string | null; email: string | null } | null> {
  const auth = await getFirebaseAuth() as import("firebase/auth").Auth | null;
  if (!auth) return null;
  try {
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { uid: result.user.uid, displayName: result.user.displayName, email: result.user.email };
  } catch {
    return null;
  }
}

// Sign in with email/password
export async function signInWithEmail(email: string, password: string): Promise<{ uid: string; displayName: string | null; email: string | null } | null> {
  const auth = await getFirebaseAuth() as import("firebase/auth").Auth | null;
  if (!auth) return null;
  try {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { uid: result.user.uid, displayName: result.user.displayName, email: result.user.email };
  } catch {
    return null;
  }
}

// Create account with email/password
export async function createAccount(email: string, password: string, name: string): Promise<{ uid: string; displayName: string | null; email: string | null } | null> {
  const auth = await getFirebaseAuth() as import("firebase/auth").Auth | null;
  if (!auth) return null;
  try {
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return { uid: result.user.uid, displayName: name, email: result.user.email };
  } catch {
    return null;
  }
}

// Sign out
export async function signOutFirebase(): Promise<void> {
  const auth = await getFirebaseAuth() as import("firebase/auth").Auth | null;
  if (!auth) return;
  try {
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  } catch {
    // ignore
  }
}

// Listen to auth state changes
export async function onAuthStateChange(callback: (user: { uid: string; displayName: string | null; email: string | null } | null) => void): Promise<() => void> {
  const auth = await getFirebaseAuth() as import("firebase/auth").Auth | null;
  if (!auth) return () => {};
  const { onAuthStateChanged } = await import("firebase/auth");
  return onAuthStateChanged(auth, (user) => {
    if (user) callback({ uid: user.uid, displayName: user.displayName, email: user.email });
    else callback(null);
  });
}
