"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Download, Loader2, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { subscribeApplications } from "@/lib/applications-db";
import { statusOf } from "@/lib/filters";
import { normalizeProvince } from "@/lib/roles";
import { REGISTRY_COLUMNS, REGISTRY_LEAVES, issuanceRows, toTSV } from "@/lib/issuance-export";
import type { Application } from "@/types/application";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

export function NttcRegistryTable() {
  const { province } = useAuth();
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const unsub = subscribeApplications(
      (apps) => {
        setData(apps);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  // The registry = completed (issued) applications, province-scoped (region7 admin sees all).
  const apps = useMemo(
    () =>
      data.filter(
        (a) =>
          statusOf(a) === "completed" &&
          (!province ||
            normalizeProvince(a.manpowerProfile?.province) === normalizeProvince(province))
      ),
    [data, province]
  );

  const totalPages = Math.max(1, Math.ceil(apps.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  // Keep page state in range when the filtered set shrinks (e.g. province change).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  const start = (current - 1) * PAGE_SIZE;
  const pageApps = apps.slice(start, start + PAGE_SIZE);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(toTSV(issuanceRows(apps)));
      toast.success("Registry copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  }

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(issuanceRows(apps));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NTTC Registry");
    XLSX.writeFile(wb, "NTTC-Registry.xlsx");
    toast.success("Exported NTTC-Registry.xlsx");
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-muted-foreground">
        <Inbox className="size-10" />
        <p>No registry records yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{apps.length} records</Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyAll}>
            <Copy className="size-4" /> Copy
          </Button>
          <Button size="sm" onClick={exportExcel}>
            <Download className="size-4" /> Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-max min-w-full border-collapse text-xs">
          <thead className="bg-muted/60">
            {/* Row 1 — standalone columns (span both rows) + group headers */}
            <tr>
              {REGISTRY_COLUMNS.map((c) =>
                c.kind === "group" ? (
                  <th
                    key={c.label}
                    colSpan={c.children.length}
                    className="border border-border px-3 py-2 text-center font-semibold"
                  >
                    {c.label}
                  </th>
                ) : (
                  <th
                    key={c.key}
                    rowSpan={2}
                    className="whitespace-nowrap border border-border px-3 py-2 text-left align-bottom font-semibold"
                  >
                    {c.label}
                  </th>
                )
              )}
            </tr>
            {/* Row 2 — sub-columns of each group */}
            <tr>
              {REGISTRY_COLUMNS.flatMap((c) =>
                c.kind === "group"
                  ? c.children.map((ch) => (
                      <th
                        key={ch.key}
                        className="whitespace-nowrap border border-border px-3 py-1.5 text-left font-medium"
                      >
                        {ch.label}
                      </th>
                    ))
                  : []
              )}
            </tr>
          </thead>
          <tbody>
            {pageApps.map((app, i) => (
              <tr key={app.id ?? app.ticketNumber ?? start + i} className="hover:bg-muted/30">
                {REGISTRY_LEAVES.map((leaf) => (
                  <td
                    key={leaf.key}
                    className="whitespace-nowrap border border-border px-3 py-1.5"
                  >
                    {leaf.get(app) || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <span>
          Showing {start + 1}–{Math.min(start + PAGE_SIZE, apps.length)} of {apps.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current <= 1}
          >
            <ChevronLeft className="size-4" /> Prev
          </Button>
          <span className="tabular-nums">
            Page {current} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current >= totalPages}
          >
            Next <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
