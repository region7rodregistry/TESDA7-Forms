// Date utilities ported from the vanilla site.

/**
 * Certificate validity = issuance date + 5 years − 1 day, as YYYY-MM-DD.
 * Mirrors setNCValidity/setTMValidity in form.html exactly. Returns "" for empty input.
 */
export function validityFromIssuance(issuanceDate: string): string {
  if (!issuanceDate) return "";
  const date = new Date(issuanceDate);
  if (Number.isNaN(date.getTime())) return "";
  date.setFullYear(date.getFullYear() + 5);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}

/**
 * Format a Firestore timestamp (string "MM/DD/YYYY, h:mm:ss AM" or a Timestamp-like
 * object) into a friendly string for the dashboards. Falls back to the raw value.
 */
export function formatTimestamp(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "string") return value;
  // Firestore Timestamp has toDate()
  if (typeof value === "object" && value !== null && "toDate" in value) {
    try {
      const d = (value as { toDate: () => Date }).toDate();
      return d.toLocaleString();
    } catch {
      return "—";
    }
  }
  return String(value);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Format an ISO date ("YYYY-MM-DD", as produced by <input type="date">) as a long,
 * human-readable date like "April 5, 2025". Parses the parts directly to avoid timezone
 * off-by-one shifts. Returns the input unchanged if it isn't an ISO date.
 */
export function formatDateLong(value: string): string {
  if (!value) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return value;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return value;
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** Current local timestamp string in the format the vanilla site used. */
export function nowTimestampString(): string {
  const now = new Date();
  const date = now.toLocaleDateString("en-US");
  const time = now.toLocaleTimeString("en-US", { hour12: true });
  return `${date} ${time}`;
}

/**
 * Local calendar date as "YYYY-MM-DD" — the date segment of an application reference
 * number (PO-YYYY-MM-DD-NNNN). Uses local time (Philippines) to match nowTimestampString,
 * so the day rolls over consistently with the displayed submission timestamp.
 */
export function ticketDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
