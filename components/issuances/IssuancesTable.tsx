"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Copy,
  Search,
  ArrowUpDown,
  Loader2,
  Inbox,
  Eye,
  TriangleAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { subscribeApplications } from "@/lib/applications-db";
import { fullName, statusOf } from "@/lib/filters";
import { sectorLabel } from "@/lib/qualifications";
import { normalizeProvince } from "@/lib/roles";
import { formatTimestamp } from "@/lib/dates";
import { issuanceRows, toTSV } from "@/lib/issuance-export";
import type { Application } from "@/types/application";
import { useAuth } from "@/components/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplicationViewDialog } from "@/components/issuances/ApplicationViewDialog";

type SortKey = "province" | "name" | "sector" | "qualification" | "received" | "status";

const PAGE_SIZE = 10;

/** Submission time (ms) of an issuance, for sorting the "received" column. */
function receivedTime(a: Application): number {
  const t = Date.parse(a.timestamp ?? "");
  return Number.isNaN(t) ? 0 : t;
}

export function IssuancesTable() {
  const { province } = useAuth();
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("received");
  const [asc, setAsc] = useState(false); // newest first by default
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const unsub = subscribeApplications(
      (apps) => {
        setData(apps);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        toast.error("Failed to load issuances", { description: err.message });
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Shows all records (every status except soft-deleted trash), province-scoped so a
  // Provincial Office sees only its own. (region7 admin has province = null → sees all.)
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = data.filter((a) => {
      if (statusOf(a) === "deleted") return false;
      const prov = normalizeProvince(a.manpowerProfile?.province);
      if (province && prov !== normalizeProvince(province)) return false;
      if (provinceFilter !== "all" && prov !== provinceFilter) return false;
      if (!q) return true;
      return [
        fullName(a),
        sectorLabel(a.nttcApplication?.sector ?? ""),
        a.nttcApplication?.qualification,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const strKey = (a: Application) => {
      switch (sortKey) {
        case "sector":
          return sectorLabel(a.nttcApplication?.sector ?? "");
        case "qualification":
          return a.nttcApplication?.qualification ?? "";
        case "status":
          return a.nttcApplication?.nttcstatus ?? "";
        case "province":
          return normalizeProvince(a.manpowerProfile?.province);
        default:
          return fullName(a);
      }
    };
    return [...filtered].sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (sortKey === "received") return dir * (receivedTime(a) - receivedTime(b));
      return dir * strKey(a).localeCompare(strKey(b));
    });
  }, [data, search, sortKey, asc, province, provinceFilter]);

  // Distinct provinces present in the (role-scoped) records — drives the filter.
  const provinceOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of data) {
      if (statusOf(a) === "deleted") continue;
      const pr = normalizeProvince(a.manpowerProfile?.province);
      if (province && pr !== normalizeProvince(province)) continue;
      if (pr) set.add(pr);
    }
    return Array.from(set).sort((x, y) => x.localeCompare(y));
  }, [data, province]);

  // Jump back to page 1 whenever the search or province filter narrows the result set.
  useEffect(() => {
    setPage(1);
  }, [search, provinceFilter]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  const start = (current - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);
  // Changes on any page / filter / search / sort change → re-runs the row stagger animation.
  const viewKey = `${current}|${provinceFilter}|${sortKey}|${asc}|${search.trim().toLowerCase()}`;

  function toggleSort(k: SortKey) {
    if (k === sortKey) setAsc((v) => !v);
    else {
      setSortKey(k);
      setAsc(k !== "received"); // received starts newest-first, others A→Z
    }
  }

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(issuanceRows(rows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NTTC");
    XLSX.writeFile(wb, "NTTC.xlsx");
    toast.success("Exported NTTC.xlsx");
  }

  async function copyTSV() {
    try {
      await navigator.clipboard.writeText(toTSV(issuanceRows(rows)));
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  }

  const cols: { key: SortKey; label: string }[] = [
    { key: "province", label: "Province" },
    { key: "name", label: "Full Name" },
    { key: "sector", label: "Sector" },
    { key: "qualification", label: "Qualification" },
    { key: "received", label: "Application Date Received" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, sector, qualification…"
              className="pl-9"
            />
          </div>
          <Select value={provinceFilter} onValueChange={(v) => setProvinceFilter(v as string)}>
            <SelectTrigger className="w-full sm:w-[190px]" size="sm">
              <SelectValue placeholder="Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provinces</SelectItem>
              {provinceOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={rows.length}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="inline-block"
              >
                {rows.length}
              </motion.span>
            </AnimatePresence>
            <span className="ml-1">records</span>
          </Badge>
          <Button variant="outline" size="sm" onClick={copyTSV} disabled={!rows.length}>
            <Copy className="size-4" /> Copy
          </Button>
          <Button size="sm" onClick={exportExcel} disabled={!rows.length}>
            <Download className="size-4" /> Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              {cols.map((c) => (
                <th key={c.key} className="px-3 py-2 text-left font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:text-primary"
                    onClick={() => toggleSort(c.key)}
                  >
                    {c.label}
                    <ArrowUpDown className="size-3 opacity-60" />
                  </button>
                </th>
              ))}
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-3 py-12 text-center text-destructive">
                  <TriangleAlert className="mx-auto mb-2 size-8" />
                  <p className="font-medium">Failed to load issuances</p>
                  <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <Inbox className="mx-auto mb-2 size-8" />
                  No issuances found.
                </td>
              </tr>
            ) : (
              pageRows.map((a, i) => {
                const id = a.id ?? a.ticketNumber;
                const n = a.nttcApplication;
                return (
                  <motion.tr
                    key={`${viewKey}:${id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.28,
                      delay: Math.min(i * 0.03, 0.2),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-t hover:bg-muted/40"
                  >
                    <td className="px-3 py-2">
                      {normalizeProvince(a.manpowerProfile?.province) || "—"}
                    </td>
                    <td className="px-3 py-2 font-medium">{fullName(a) || "—"}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline">{sectorLabel(n?.sector ?? "") || "—"}</Badge>
                    </td>
                    <td className="px-3 py-2">{n?.qualification || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                      {a.timestamp ? formatTimestamp(a.timestamp) : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {n?.nttcstatus ? (
                        <Badge variant="secondary" className="uppercase">
                          {n.nttcstatus}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button variant="outline" size="sm" onClick={() => setViewApp(a)}>
                        <Eye className="size-4" /> View
                      </Button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && rows.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <span>
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, rows.length)} of {rows.length}
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
      )}

      <ApplicationViewDialog
        app={viewApp}
        open={!!viewApp}
        onOpenChange={(o) => {
          if (!o) setViewApp(null);
        }}
      />
    </div>
  );
}
