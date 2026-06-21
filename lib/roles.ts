// Role + province mapping, ported verbatim from the vanilla site
// (login.html redirect logic + r7admindash/dashboard.js userProvinceMap).

export type Role = "r7admin" | "po";

export const R7_ADMIN_EMAIL = "region7@tesda.gov.ph";

/** Email → province. region7 sees all provinces; each PO email is scoped to one. */
export const userProvinceMap: Record<string, string> = {
  "region7@tesda.gov.ph": "All Provinces",
  "r7po.registry@gmail.com": "Cebu",
  "r7po12.registry@gmail.com": "Bohol",
  "r7po46.registry@gmail.com": "Negros Oriental",
  "r7po61.registry@gmail.com": "Siquijor",
};

export const PROVINCES = ["Bohol", "Cebu", "Negros Oriental", "Siquijor"] as const;

/**
 * Collapse a raw province value to its canonical Region VII name, so casing / format
 * variants ("SIQUIJOR", "negros-oriental", "negros oriental") all map to one entry.
 * Unknown values fall back to the trimmed input so nothing is silently dropped.
 */
export function normalizeProvince(raw?: string | null): string {
  if (!raw) return "";
  const key = raw.toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return PROVINCES.find((p) => p.toLowerCase() === key) ?? raw.trim();
}

/** Returns the role for an email, or null if the user is not authorized. */
export function roleFor(email?: string | null): Role | null {
  if (!email) return null;
  if (email === R7_ADMIN_EMAIL) return "r7admin";
  if (userProvinceMap[email]) return "po";
  return null;
}

/** Province a user is scoped to. region7/admin → null (all provinces). */
export function provinceFor(email?: string | null): string | null {
  if (!email) return null;
  if (email === R7_ADMIN_EMAIL) return null;
  return userProvinceMap[email] ?? null;
}

/** Post-login destination (mirrors login.html). */
export function redirectFor(email?: string | null): string {
  return email === R7_ADMIN_EMAIL ? "/r7admindash" : "/admindash/onaf";
}
