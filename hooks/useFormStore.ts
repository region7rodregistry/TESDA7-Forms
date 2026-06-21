"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Application } from "@/types/application";

interface FormStore {
  /** The in-flight application built on the form page, awaiting submit. */
  draft: Application | null;
  setDraft: (draft: Application) => void;
  clearDraft: () => void;
}

/**
 * Carries the form → /form/preview hand-off. Persisted to sessionStorage because the
 * payload (100+ fields incl. arrays) is too large for a query string and survives
 * the navigation/refresh but clears on tab close. Replaces the legacy query-string
 * + localStorage juggling.
 */
export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: "tesda-form-draft",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : (undefined as unknown as Storage)
      ),
    }
  )
);
