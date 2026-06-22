"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Layers, GraduationCap, MapPin, FileStack } from "lucide-react";
import { useApplications } from "@/hooks/useApplications";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PieChart } from "@/components/dashboard/PieChart";
import {
  statsApplications,
  bySector,
  byQualification,
  byProvince,
  topNWithOther,
  type StatStatusFilter,
} from "@/lib/stats";

const TOP_N = 10;

const STATUS_TABS: { key: StatStatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

export function StatisticsView() {
  // province is null for the R7 admin (all provinces) and the scoped province for
  // focal/PO users, so it doubles as both the data-scope and the role discriminator.
  const { province } = useAuth();
  const isAdmin = province == null;
  const { applications, loading } = useApplications(province);

  const [status, setStatus] = useState<StatStatusFilter>("all");

  const counted = useMemo(
    () => statsApplications(applications, status),
    [applications, status]
  );

  // Full tallies, computed once — feed both the summary counts and the charts.
  const sectorAll = useMemo(() => bySector(counted), [counted]);
  const qualificationAll = useMemo(() => byQualification(counted), [counted]);
  const provinceAll = useMemo(() => byProvince(counted), [counted]);

  const sectorData = useMemo(() => topNWithOther(sectorAll, TOP_N), [sectorAll]);
  const qualificationData = useMemo(
    () => topNWithOther(qualificationAll, TOP_N),
    [qualificationAll]
  );

  const summary = [
    { label: "Applications", value: counted.length, icon: FileStack, color: "text-sky-600", bg: "bg-sky-100" },
    { label: "Sectors", value: sectorAll.length, icon: Layers, color: "text-violet-600", bg: "bg-violet-100" },
    { label: "Qualifications", value: qualificationAll.length, icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-100" },
    // The province breakdown is only meaningful for the region-wide admin.
    ...(isAdmin
      ? [{ label: "Provinces", value: provinceAll.length, icon: MapPin, color: "text-amber-600", bg: "bg-amber-100" }]
      : []),
  ];

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="flex items-center gap-4 p-5">
              <div className={`flex size-12 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                <s.icon className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status filter */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => (
            <Button
              key={t.key}
              size="sm"
              variant={status === t.key ? "default" : "outline"}
              onClick={() => setStatus(t.key)}
              className={cn(status === t.key && "pointer-events-none")}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Counts exclude spam and deleted applications.
        </p>
      </div>

      {/* Charts */}
      {counted.length === 0 ? (
        <Card className="flex min-h-[30vh] flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
          <FileStack className="size-10" />
          <p>No applications to chart for this filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <PieChart
            title="Applications by Sector"
            data={sectorData}
            totalCategories={sectorAll.length}
            icon={<Layers className="size-4 text-violet-600" />}
          />
          {isAdmin ? (
            <>
              <PieChart
                title="Applications by Province"
                data={provinceAll}
                icon={<MapPin className="size-4 text-amber-600" />}
              />
              <PieChart
                title="Applications by Qualification"
                data={qualificationData}
                totalCategories={qualificationAll.length}
                icon={<GraduationCap className="size-4 text-emerald-600" />}
                className="xl:col-span-2"
              />
            </>
          ) : (
            <PieChart
              title="Applications by Qualification"
              data={qualificationData}
              totalCategories={qualificationAll.length}
              icon={<GraduationCap className="size-4 text-emerald-600" />}
            />
          )}
        </div>
      )}
    </div>
  );
}
