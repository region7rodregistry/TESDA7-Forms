import type { Application } from "@/types/application";

/** Soft-deleted applications are permanently purged after this many days. */
export const RETENTION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_MS = RETENTION_DAYS * DAY_MS;

/** Doc ids of soft-deleted applications whose 30-day window has elapsed → purge candidates. */
export function findExpiredDeletedIds(apps: Application[], now = Date.now()): string[] {
  const ids: string[] = [];
  for (const app of apps) {
    if (app.status !== "deleted" || !app.id || !app.deletedAt) continue;
    const t = Date.parse(app.deletedAt);
    if (!Number.isNaN(t) && now - t >= RETENTION_MS) ids.push(app.id);
  }
  return ids;
}

/** Whole days remaining until a soft-deleted application is auto-purged (clamped 0..30). */
export function daysUntilPurge(deletedAt?: string, now = Date.now()): number {
  if (!deletedAt) return RETENTION_DAYS;
  const t = Date.parse(deletedAt);
  if (Number.isNaN(t)) return RETENTION_DAYS;
  const remaining = RETENTION_MS - (now - t);
  return Math.max(0, Math.ceil(remaining / DAY_MS));
}
