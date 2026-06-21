"use client";

import { useCallback, useEffect, useState } from "react";
import type { Application } from "@/types/application";
import { getApplicationByTicket } from "@/lib/applications-db";

/** Load a single application by ticketNumber. */
export function useApplication(ticketNumber: string | undefined) {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    if (!ticketNumber) {
      setLoading(false);
      setError("No ticket number provided.");
      return;
    }
    setLoading(true);
    setError(null);
    getApplicationByTicket(ticketNumber)
      .then((app) => {
        if (!active) return;
        if (!app) setError(`No application found for ${ticketNumber}.`);
        setApplication(app);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [ticketNumber, reloadKey]);

  return { application, setApplication, loading, error, reload };
}
