"use client";

import * as React from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth, googleProvider, isFirebaseConfigured } from "@/firebase/config";

interface AuthContextValue {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

/** Calls the session API so the ID token becomes a secure httpOnly cookie
 * the server can verify on every request (see app/api/auth/session). */
async function syncSessionCookie(firebaseUser: FirebaseUser) {
  const idToken = await firebaseUser.getIdToken();
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    throw new Error("Could not start a session. Please try again.");
  }
}

function createDemoUser(): FirebaseUser {
  return {
    uid: "demo-admin",
    email: "admin@local.test",
    displayName: "Demo Admin",
    getIdToken: async () => "demo-token",
  } as unknown as FirebaseUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const useDemoAuth =
    process.env.NEXT_PUBLIC_USE_FAKE_AUTH === "true" || !isFirebaseConfigured;

  React.useEffect(() => {
    if (useDemoAuth) {
      setUser(createDemoUser());
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [useDemoAuth]);

  const value: AuthContextValue = {
    user,
    loading,
    async signInWithEmail(email, password) {
      if (useDemoAuth) {
        const demoUser = createDemoUser();
        setUser(demoUser);
        await syncSessionCookie(demoUser);
        return;
      }

      if (!auth) {
        throw new Error("Authentication is not configured.");
      }

      const credential = await signInWithEmailAndPassword(auth, email, password);
      await syncSessionCookie(credential.user);
    },
    async signUpWithEmail(name, email, password) {
      if (useDemoAuth) {
        const demoUser = createDemoUser();
        setUser(demoUser);
        await syncSessionCookie(demoUser);
        return;
      }

      if (!auth) {
        throw new Error("Authentication is not configured.");
      }

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
      await syncSessionCookie(credential.user);
    },
    async signInWithGoogle() {
      if (useDemoAuth) {
        const demoUser = createDemoUser();
        setUser(demoUser);
        await syncSessionCookie(demoUser);
        return;
      }

      if (!auth) {
        throw new Error("Authentication is not configured.");
      }

      const credential = await signInWithPopup(auth, googleProvider);
      await syncSessionCookie(credential.user);
    },
    async signOutUser() {
      if (useDemoAuth) {
        setUser(null);
        await fetch("/api/auth/session", { method: "DELETE" });
        return;
      }

      await fetch("/api/auth/session", { method: "DELETE" });
      if (auth) {
        await firebaseSignOut(auth);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
