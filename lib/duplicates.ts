import type { Application } from "@/types/application";

/**
 * Grouping key used by the vanilla site to detect duplicate applications
 * (admindash/onaf.html). Matches firstName||lastName||contact||email||sector||qualification.
 */
export function duplicateKey(app: Application): string {
  const firstName = app.manpowerProfile?.firstName || "";
  const lastName = app.manpowerProfile?.lastName || "";
  const contact = app.manpowerProfile?.contact || "";
  const email = app.manpowerProfile?.email || "";
  const sector = app.nttcApplication?.sector || "";
  const qualification = app.nttcApplication?.qualification || "";
  return `${firstName}||${lastName}||${contact}||${email}||${sector}||${qualification}`;
}

/**
 * Returns the doc ids that should be marked as spam: every member of any group
 * that has more than one application and is not already flagged spam.
 */
export function findDuplicateIds(apps: Application[]): string[] {
  const groups = new Map<string, Application[]>();
  for (const app of apps) {
    const key = duplicateKey(app);
    const arr = groups.get(key);
    if (arr) arr.push(app);
    else groups.set(key, [app]);
  }
  const ids: string[] = [];
  for (const group of groups.values()) {
    if (group.length > 1) {
      for (const app of group) {
        if (app.status !== "spam" && app.id) ids.push(app.id);
      }
    }
  }
  return ids;
}
