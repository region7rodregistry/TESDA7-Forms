"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";
import { getAuthClient } from "@/lib/firebase";
import { roleFor, provinceFor, type Role } from "@/lib/roles";

interface AuthState {
  user: User | null;
  email: string | null;
  role: Role | null;
  /** Province the user is scoped to; null = all provinces (region7 admin). */
  province: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuthClient(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const email = user?.email ?? null;
  const value: AuthState = {
    user,
    email,
    role: roleFor(email),
    province: provinceFor(email),
    loading,
    signOut: () => fbSignOut(getAuthClient()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
