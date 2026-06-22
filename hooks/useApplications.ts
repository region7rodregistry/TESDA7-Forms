"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { Application } from "@/types/application";
import { subscribeApplications, markAsSpam, deleteApplications } from "@/lib/applications-db";
import { findDuplicateIds } from "@/lib/duplicates";
import { findExpiredDeletedIds } from "@/lib/retention";
import { normalizeProvince } from "@/lib/roles";

/**
 * Live subscription to the applications collection with automatic duplicate→spam
 * marking (batched). When `province` is set, results are scoped to that province.
 */
export function useApplications(province?: string | null) {
  const [all, setAll] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dupToastShown = useRef(false);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeApplications(
      (apps) => {
        setAll(apps);
        setLoading(false);
        // Auto-mark duplicates as spam (skips already-spam docs to avoid thrashing).
        const dupIds = findDuplicateIds(apps);
        if (dupIds.length > 0) {
          markAsSpam(dupIds).catch((e) => {
            console.error("spam mark failed", e);
            // Surface the failure once so duplicates aren't silently left active.
            if (!dupToastShown.current) {
              dupToastShown.current = true;
              toast.error("Duplicate detection incomplete", {
                description: e instanceof Error ? e.message : "Could not flag duplicate applications.",
              });
            }
          });
        }

        // Auto-purge soft-deleted applications past their 30-day retention window.
        // (Runs whenever the dashboard is open; for a guaranteed schedule use a Cloud Function.)
        const expiredIds = findExpiredDeletedIds(apps);
        if (expiredIds.length > 0) {
          deleteApplications(expiredIds).catch((e) => console.error("auto-purge failed", e));
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Province match is normalized (case/format-insensitive) so free-text entries like
  // "negros oriental" / "NEGROS ORIENTAL" still scope to the right PO — matching how the
  // Issuances tab already filters. Without this, variant spellings are silently hidden.
  const applications = useMemo(
    () =>
      province
        ? all.filter(
            (a) => normalizeProvince(a.manpowerProfile?.province) === normalizeProvince(province)
          )
        : all,
    [all, province]
  );

  return { applications, allApplications: all, loading, error };
}
