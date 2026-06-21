// Firestore data-access for the `applications` / `issuances` collections.
// Every read/write goes through here — no component touches `db` directly.
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
  runTransaction,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application, ApplicationStatus } from "@/types/application";
import { nowTimestampString, ticketDateKey } from "@/lib/dates";

const APPLICATIONS = "applications";
const ISSUANCES = "issuances";
const COUNTERS = "counters";

function withId(docId: string, data: Record<string, unknown>): Application {
  return { id: docId, ...(data as object) } as Application;
}

/** Live subscription to all applications. Returns an unsubscribe fn. */
export function subscribeApplications(
  onData: (apps: Application[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, APPLICATIONS),
    (snap) => onData(snap.docs.map((d) => withId(d.id, d.data()))),
    (err) => onError?.(err)
  );
}

/** Live subscription to the issuances registry. */
export function subscribeIssuances(
  onData: (apps: Application[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, ISSUANCES),
    (snap) => onData(snap.docs.map((d) => withId(d.id, d.data()))),
    (err) => onError?.(err)
  );
}

/** Find one application by its ticketNumber field (not the doc id). */
export async function getApplicationByTicket(
  ticketNumber: string
): Promise<Application | null> {
  const q = query(collection(db, APPLICATIONS), where("ticketNumber", "==", ticketNumber));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return withId(d.id, d.data());
}

/** Create a new application document. Returns the new doc id. */
export async function addApplication(data: Omit<Application, "id">): Promise<string> {
  const ref = await addDoc(collection(db, APPLICATIONS), data);
  return ref.id;
}

/** Update the workflow status of an application (keyed by doc id, as the vanilla site did). */
export async function setApplicationStatus(
  docId: string,
  status: ApplicationStatus,
  actor = "admin"
): Promise<void> {
  const ref = doc(db, APPLICATIONS, docId);
  const ts = nowTimestampString();
  const patch: Record<string, unknown> = { status };
  if (status === "completed") {
    patch.completedAt = ts;
    patch.completedBy = actor;
  } else if (status === "pending") {
    patch.pendingAt = ts;
    patch.pendingBy = actor;
  }
  await updateDoc(ref, patch);
}

/** Copy an application into the issuances collection (same doc id), as on "mark complete". */
export async function copyToIssuances(app: Application): Promise<void> {
  if (!app.id) return;
  const { id, ...body } = app;
  void id;
  await setDoc(doc(db, ISSUANCES, app.id), { ...body, status: "completed" });
}

/**
 * Mark an application completed AND mirror it into issuances in a single transaction,
 * so the invariant "every completed application exists in issuances" can never be left
 * half-applied if one write fails.
 */
export async function completeApplication(app: Application, actor = "admin"): Promise<void> {
  if (!app.id) return;
  const appId = app.id;
  const { id, ...body } = app;
  void id;
  await runTransaction(db, async (tx) => {
    const ts = nowTimestampString();
    tx.update(doc(db, APPLICATIONS, appId), {
      status: "completed",
      completedAt: ts,
      completedBy: actor,
    });
    tx.set(doc(db, ISSUANCES, appId), { ...body, status: "completed" });
  });
}

/** Soft-delete: move an application to the Deleted/trash state (auto-purged after 30 days). */
export async function cancelApplication(docId: string, actor = "admin"): Promise<void> {
  await updateDoc(doc(db, APPLICATIONS, docId), {
    status: "deleted",
    deletedAt: new Date().toISOString(),
    deletedBy: actor,
  });
}

/** Restore a soft-deleted (or spam) application back to pending. */
export async function restoreApplication(docId: string, actor = "admin"): Promise<void> {
  await setApplicationStatus(docId, "pending", actor);
}

/** Permanently delete a single application document. */
export async function deleteApplication(docId: string): Promise<void> {
  await deleteDoc(doc(db, APPLICATIONS, docId));
}

/** Permanently delete many applications (used by the 30-day auto-purge). */
export async function deleteApplications(docIds: string[]): Promise<void> {
  if (docIds.length === 0) return;
  const batch = writeBatch(db);
  for (const id of docIds) batch.delete(doc(db, APPLICATIONS, id));
  await batch.commit();
}

/** Persist edits to an application document (by doc id). */
export async function updateApplicationById(
  docId: string,
  data: Partial<Application>
): Promise<void> {
  const { id, ...body } = data;
  void id;
  await updateDoc(doc(db, APPLICATIONS, docId), body as Record<string, unknown>);
}

/** Batch-mark a set of doc ids as spam (used by duplicate detection). */
export async function markAsSpam(docIds: string[]): Promise<void> {
  if (docIds.length === 0) return;
  const batch = writeBatch(db);
  for (const id of docIds) batch.update(doc(db, APPLICATIONS, id), { status: "spam" });
  await batch.commit();
}

/**
 * Mint the reference number for a new application:
 *
 *     PO-YYYY-MM-DD-NNNN     e.g.  PO-2026-06-21-0001
 *
 * NNNN is a 4-digit, per-day series that resets each calendar day. It is produced
 * atomically by a runTransaction on a per-day counter doc (`counters/PO-YYYY-MM-DD`), so
 * concurrent submits can never collide or skip. The stored counter starts at 0 and is
 * pre-incremented, so the first application of each day is 0001.
 *
 * IMPORTANT: this runs on the PUBLIC (unauthenticated) applicant submit, so the Firestore
 * rules MUST permit anonymous read+write on `counters/{id}` (see firestore.rules). Deploy
 * the rules (`firebase deploy --only firestore:rules`) before shipping this, or the submit
 * will fail with permission-denied.
 */
export async function nextTicketNumber(date = new Date()): Promise<string> {
  const dayKey = ticketDateKey(date);
  const counterRef = doc(db, COUNTERS, `PO-${dayKey}`);
  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().value as number) || 0 : 0;
    const value = current + 1;
    tx.set(counterRef, { value }, { merge: true });
    return value;
  });
  return `PO-${dayKey}-${String(next).padStart(4, "0")}`;
}

export { getDoc };
