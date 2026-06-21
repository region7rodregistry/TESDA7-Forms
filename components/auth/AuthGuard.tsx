"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Role } from "@/lib/roles";

/**
 * Client-side route guard. While auth resolves, shows a spinner (prevents a flash
 * of unguarded content). Unauthenticated → /login. Authenticated-but-unauthorized
 * (not in the province map) → sign out + /login (mirrors the vanilla "alert & redirect").
 * `requiredRole` further restricts (e.g. region7-only pages bounce POs).
 */
export function AuthGuard({
  children,
  requiredRole,
  fallbackPath = "/admindash/onaf",
}: {
  children: React.ReactNode;
  requiredRole?: Role;
  fallbackPath?: string;
}) {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (role === null) {
      // Authenticated but not an authorized account.
      void signOut().finally(() => router.replace("/login"));
      return;
    }
    if (requiredRole && role !== requiredRole) {
      router.replace(fallbackPath);
    }
  }, [user, role, loading, requiredRole, fallbackPath, router, signOut]);

  const authorized = !!user && role !== null && (!requiredRole || role === requiredRole);

  if (loading || !authorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
