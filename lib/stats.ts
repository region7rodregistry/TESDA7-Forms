// Aggregations powering the Statistics dashboard.
// Counts genuine applications only — trash (deleted) and auto-flagged duplicates
// (spam) are excluded so the charts reflect real submissions, not noise.
import type { Application } from "@/types/application";
import { statusOf } from "@/lib/filters";
import { sectorLabel } from "@/lib/qualifications";
import { normalizeProvince } from "@/lib/roles";

export interface Slice {
  label: string;
  value: number;
}

export type StatStatusFilter = "all" | "pending" | "completed";

const UNSPECIFIED = "Unspecified";

/**
 * Applications that count toward statistics. Deleted (trash) and spam (duplicates)
 * are always excluded; `filter` further narrows to a single workflow status.
 * "all" therefore means "all genuine applications" = pending + completed.
 */
export function statsApplications(
  apps: Application[],
  filter: StatStatusFilter
): Application[] {
  return apps.filter((a) => {
    const s = statusOf(a);
    if (s === "deleted" || s === "spam") return false;
    if (filter === "all") return true;
    return s === filter;
  });
}

/** Group applications by a key, dropping blanks into "Unspecified", sorted desc by count. */
function tally(apps: Application[], keyFn: (a: Application) => string): Slice[] {
  const map = new Map<string, number>();
  for (const a of apps) {
    const key = keyFn(a).trim() || UNSPECIFIED;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

export const bySector = (apps: Application[]): Slice[] =>
  tally(apps, (a) => sectorLabel(a.nttcApplication?.sector ?? ""));

export const byQualification = (apps: Application[]): Slice[] =>
  tally(apps, (a) => a.nttcApplication?.qualification ?? "");

export const byProvince = (apps: Application[]): Slice[] =>
  tally(apps, (a) => normalizeProvince(a.manpowerProfile?.province));

/**
 * Keep the `n` largest slices and roll the long tail into a single "Other" slice,
 * so charts with many categories (sectors, qualifications) stay legible.
 */
export function topNWithOther(slices: Slice[], n: number): Slice[] {
  if (slices.length <= n) return slices;
  const top = slices.slice(0, n);
  const rest = slices.slice(n);
  const otherValue = rest.reduce((sum, s) => sum + s.value, 0);
  if (otherValue <= 0) return top;
  return [...top, { label: `Other (${rest.length})`, value: otherValue }];
}
