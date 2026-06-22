import type { Application, ApplicationStatus } from "@/types/application";
import { normalizeProvince } from "@/lib/roles";

export type StatusFilter = ApplicationStatus | "all";
export type SortBy = "latest" | "oldest" | "name" | "status";

/** Status of an application, defaulting to "pending" (matches the vanilla dashboards). */
export function statusOf(app: Application): ApplicationStatus {
  return app.status ?? "pending";
}

export function fullName(app: Application): string {
  const p = app.manpowerProfile;
  return `${p?.firstName ?? ""} ${p?.lastName ?? ""}`.trim();
}

/** Filter by province (PO scope), status tab, and free-text search.
 *  "all" shows active items only (pending/completed/spam); deleted items live in their own tab. */
export function filterApplications(
  apps: Application[],
  opts: { province?: string | null; status?: StatusFilter; search?: string }
): Application[] {
  const { province, status = "all", search = "" } = opts;
  const q = search.trim().toLowerCase();
  return apps.filter((app) => {
    if (province && normalizeProvince(app.manpowerProfile?.province) !== normalizeProvince(province))
      return false;
    const s = statusOf(app);
    if (status === "all") {
      if (s === "deleted") return false; // trash is excluded from "All"
    } else if (s !== status) {
      return false;
    }
    if (q) {
      const haystack = `${app.ticketNumber ?? ""} ${fullName(app)} ${
        app.manpowerProfile?.email ?? ""
      }`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortApplications(apps: Application[], sortBy: SortBy): Application[] {
  const copy = [...apps];
  switch (sortBy) {
    case "name":
      return copy.sort((a, b) => fullName(a).localeCompare(fullName(b)));
    case "status":
      return copy.sort((a, b) => statusOf(a).localeCompare(statusOf(b)));
    case "oldest":
      return copy.sort((a, b) => parseTs(a.timestamp) - parseTs(b.timestamp));
    case "latest":
    default:
      return copy.sort((a, b) => parseTs(b.timestamp) - parseTs(a.timestamp));
  }
}

function parseTs(ts?: string): number {
  if (!ts) return 0;
  const t = Date.parse(ts);
  return Number.isNaN(t) ? 0 : t;
}

export function countByStatus(apps: Application[]) {
  let pending = 0,
    completed = 0,
    spam = 0,
    deleted = 0;
  for (const app of apps) {
    const s = statusOf(app);
    if (s === "pending") pending++;
    else if (s === "completed") completed++;
    else if (s === "spam") spam++;
    else if (s === "deleted") deleted++;
  }
  // "active" = everything except the trash; used by the "All" tab badge.
  const active = pending + completed + spam;
  return { pending, completed, spam, deleted, active, total: apps.length };
}
