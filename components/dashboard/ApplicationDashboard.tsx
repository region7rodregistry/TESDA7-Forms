"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useApplications } from "@/hooks/useApplications";
import {
  filterApplications,
  sortApplications,
  countByStatus,
  type StatusFilter,
  type SortBy,
} from "@/lib/filters";
import {
  completeApplication,
  cancelApplication,
  restoreApplication,
  deleteApplication,
} from "@/lib/applications-db";
import { RETENTION_DAYS } from "@/lib/retention";
import type { Application } from "@/types/application";
import { useAuth } from "@/components/auth/AuthProvider";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { FilterTabs } from "@/components/dashboard/FilterTabs";
import { ApplicationCard } from "@/components/dashboard/ApplicationCard";
import { Pagination } from "@/components/dashboard/Pagination";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ProvinceCards } from "@/components/dashboard/ProvinceCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 9;

export function ApplicationDashboard({ variant }: { variant: "focal" | "r7" }) {
  const { email, province: scopedProvince } = useAuth();
  // R7 admin sees everything and can pick a province; focal users are locked to theirs.
  const [provinceFilter, setProvinceFilter] = useState<string | null>(null);
  const dataProvince = variant === "r7" ? null : scopedProvince;
  const { applications, loading } = useApplications(dataProvince);

  const [status, setStatus] = useState<StatusFilter>("pending");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("latest");
  const [page, setPage] = useState(1);

  const [completeTarget, setCompleteTarget] = useState<Application | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Application | null>(null);
  const [purgeTarget, setPurgeTarget] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);

  // For r7, the province cards filter further; for focal it's already scoped.
  const scoped = useMemo(
    () =>
      variant === "r7" && provinceFilter
        ? applications.filter((a) => a.manpowerProfile?.province === provinceFilter)
        : applications,
    [applications, provinceFilter, variant]
  );

  const counts = useMemo(() => countByStatus(scoped), [scoped]);

  const visible = useMemo(() => {
    const filtered = filterApplications(scoped, { status, search });
    return sortApplications(filtered, sortBy);
  }, [scoped, status, search, sortBy]);

  const pageCount = Math.ceil(visible.length / PAGE_SIZE);
  const currentPage = pageCount > 0 ? Math.min(page, pageCount) : 1;
  const paged = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function handleComplete() {
    if (!completeTarget) return;
    setBusy(true);
    try {
      await completeApplication(completeTarget, email ?? "admin");
      toast.success("Application marked as completed and added to issuances.");
      setCompleteTarget(null);
    } catch (e) {
      toast.error("Failed to complete", { description: errMsg(e) });
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    if (!cancelTarget?.id) return;
    setBusy(true);
    try {
      await cancelApplication(cancelTarget.id, email ?? "admin");
      toast.success("Application moved to Deleted.", {
        description: `It will be permanently removed after ${RETENTION_DAYS} days.`,
      });
      setCancelTarget(null);
    } catch (e) {
      toast.error("Failed to cancel", { description: errMsg(e) });
    } finally {
      setBusy(false);
    }
  }

  async function handlePurge() {
    if (!purgeTarget?.id) return;
    setBusy(true);
    try {
      await deleteApplication(purgeTarget.id);
      toast.success("Application permanently deleted.");
      setPurgeTarget(null);
    } catch (e) {
      toast.error("Failed to delete", { description: errMsg(e) });
    } finally {
      setBusy(false);
    }
  }

  async function handleRestore(app: Application) {
    if (!app.id) return;
    try {
      await restoreApplication(app.id, email ?? "admin");
      toast.success("Application restored to pending.");
    } catch (e) {
      toast.error("Failed to restore", { description: errMsg(e) });
    }
  }

  return (
    <div className="space-y-6">
      {variant === "r7" && (
        <>
          <StatsCards counts={counts} />
          <ProvinceCards apps={applications} selected={provinceFilter} onSelect={setProvinceFilter} />
        </>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-[150px]" size="sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FilterTabs value={status} onChange={(v) => { setStatus(v); setPage(1); }} counts={counts} />

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : paged.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-muted-foreground">
          <Inbox className="size-10" />
          <p>No applications found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {paged.map((app) => (
                <ApplicationCard
                  key={app.id ?? app.ticketNumber}
                  app={app}
                  onComplete={setCompleteTarget}
                  onCancel={setCancelTarget}
                  onRestore={handleRestore}
                  onDeletePermanent={setPurgeTarget}
                />
              ))}
            </AnimatePresence>
          </div>
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!completeTarget}
        onOpenChange={(o) => !o && setCompleteTarget(null)}
        variant="complete"
        title="Mark as Completed?"
        description="This will mark the application as completed and add it to the issuances registry."
        confirmLabel="Mark Completed"
        onConfirm={handleComplete}
        loading={busy}
      />
      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        variant="delete"
        title="Cancel this application?"
        description={`It will be moved to the Deleted tab and permanently removed after ${RETENTION_DAYS} days. You can restore it before then.`}
        confirmLabel="Move to Deleted"
        onConfirm={handleCancel}
        loading={busy}
      />
      <ConfirmDialog
        open={!!purgeTarget}
        onOpenChange={(o) => !o && setPurgeTarget(null)}
        variant="delete"
        title="Delete permanently?"
        description="This permanently removes the application and cannot be undone."
        confirmLabel="Delete Permanently"
        onConfirm={handlePurge}
        loading={busy}
      />
    </div>
  );
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong.";
}
