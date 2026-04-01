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
  if (_auth) return _auth as import("firebase/auth").Auth;
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig as Parameters<typeof initializeApp>[0]);
    _auth = getAuth(app);
    return _auth as import("firebase/auth").Auth;
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

export type AuthResult = {
  uid: string;
  displayName: string | null;
  email: string | null;
} | null;

export type AuthError = {
  code: string;
  message: string;
};

// Check for pending redirect result on page load
export async function checkRedirectResult(): Promise<{ user: AuthResult; error: AuthError | null }> {
  const auth = await getFirebaseAuth();
  if (!auth) return { user: null, error: null };
  try {
    const { getRedirectResult } = await import("firebase/auth");
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return {
        user: { uid: result.user.uid, displayName: result.user.displayName, email: result.user.email },
        error: null,
      };
    }
    return { user: null, error: null };
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    return { user: null, error: { code: e.code ?? "unknown", message: e.message ?? "Redirect sign-in failed" } };
  }
}

// Sign in with Google — tries popup first, falls back to redirect
export async function signInWithGoogle(): Promise<{ user: AuthResult; error: AuthError | null }> {
  const auth = await getFirebaseAuth();
  if (!auth) return { user: null, error: { code: "not-configured", message: "Firebase is not configured" } };

  try {
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);
    return {
      user: { uid: result.user.uid, displayName: result.user.displayName, email: result.user.email },
      error: null,
    };
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    const code = e.code ?? "";

    // Popup was blocked or closed — fall back to redirect
    if (
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request"
    ) {
      try {
        const { GoogleAuthProvider, signInWithRedirect } = await import("firebase/auth");
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithRedirect(auth, provider);
        // Redirect navigates away; result handled by checkRedirectResult on return
        return { user: null, error: null };
      } catch (redirectErr: unknown) {
        const re = redirectErr as { code?: string; message?: string };
        return { user: null, error: { code: re.code ?? "redirect-failed", message: re.message ?? "Redirect sign-in failed" } };
      }
    }

    // Unauthorized domain — actionable message
    if (code === "auth/unauthorized-domain") {
      return {
        user: null,
        error: {
          code,
          message: `This domain (${window.location.hostname}) is not authorized in Firebase. Add it under Authentication → Settings → Authorized Domains in the Firebase Console.`,
        },
      };
    }

    return { user: null, error: { code, message: e.message ?? "Google sign-in failed" } };
  }
}

// Sign in with email/password
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: AuthResult; error: AuthError | null }> {
  const auth = await getFirebaseAuth();
  if (!auth) return { user: null, error: { code: "not-configured", message: "Firebase is not configured" } };
  try {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: { uid: result.user.uid, displayName: result.user.displayName, email: result.user.email }, error: null };
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    const code = e.code ?? "";
    let message = "Sign-in failed. Please try again.";
    if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
      message = "Incorrect email or password.";
    } else if (code === "auth/too-many-requests") {
      message = "Too many attempts. Please wait a moment and try again.";
    } else if (code === "auth/user-disabled") {
      message = "This account has been disabled.";
    }
    return { user: null, error: { code, message } };
  }
}

// Create account with email/password
export async function createAccount(
  email: string,
  password: string,
  name: string
): Promise<{ user: AuthResult; error: AuthError | null }> {
  const auth = await getFirebaseAuth();
  if (!auth) return { user: null, error: { code: "not-configured", message: "Firebase is not configured" } };
  try {
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return { user: { uid: result.user.uid, displayName: name, email: result.user.email }, error: null };
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    const code = e.code ?? "";
    let message = "Could not create account.";
    if (code === "auth/email-already-in-use") message = "An account with this email already exists.";
    else if (code === "auth/weak-password") message = "Password must be at least 6 characters.";
    else if (code === "auth/invalid-email") message = "Please enter a valid email address.";
    return { user: null, error: { code, message } };
  }
}

// Sign out
export async function signOutFirebase(): Promise<void> {
  const auth = await getFirebaseAuth();
  if (!auth) return;
  try {
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  } catch {
    // ignore
  }
}

// Listen to auth state changes
export async function onAuthStateChange(
  callback: (user: AuthResult) => void
): Promise<() => void> {
  const auth = await getFirebaseAuth();
  if (!auth) return () => {};
  const { onAuthStateChanged } = await import("firebase/auth");
  return onAuthStateChanged(auth, (user) => {
    if (user) callback({ uid: user.uid, displayName: user.displayName, email: user.email });
    else callback(null);
  });
}
