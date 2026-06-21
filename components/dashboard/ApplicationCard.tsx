"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, CheckCircle2, RotateCcw, Trash2, XCircle, Mail, Phone, Clock, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { statusOf, fullName } from "@/lib/filters";
import { sectorLabel } from "@/lib/qualifications";
import { formatTimestamp } from "@/lib/dates";
import { daysUntilPurge } from "@/lib/retention";
import type { Application } from "@/types/application";

interface Props {
  app: Application;
  onComplete: (app: Application) => void;
  onCancel: (app: Application) => void;
  onRestore: (app: Application) => void;
  onDeletePermanent: (app: Application) => void;
}

export function ApplicationCard({
  app,
  onComplete,
  onCancel,
  onRestore,
  onDeletePermanent,
}: Props) {
  const status = statusOf(app);
  const previewHref = `/applications/${encodeURIComponent(app.ticketNumber)}/preview`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-primary">{app.ticketNumber}</span>
          <StatusBadge status={status} />
        </div>

        <div>
          <h3 className="text-base font-semibold leading-tight">{fullName(app) || "—"}</h3>
          <p className="text-xs text-muted-foreground">
            {sectorLabel(app.nttcApplication?.sector ?? "")} ·{" "}
            {app.nttcApplication?.qualification || "—"}
          </p>
        </div>

        <dl className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="size-3.5 shrink-0" />
            <span className="truncate">{app.manpowerProfile?.contact || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{app.manpowerProfile?.email || "—"}</span>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Button render={<Link href={previewHref} target="_blank" />} nativeButton={false} size="sm" variant="outline">
            <Eye className="size-4" /> View PDF
          </Button>

          {status === "pending" && (
            <Button size="sm" onClick={() => onComplete(app)}>
              <CheckCircle2 className="size-4" /> Mark as Complete
            </Button>
          )}
          {status === "spam" && (
            <Button size="sm" variant="secondary" onClick={() => onRestore(app)}>
              <RotateCcw className="size-4" /> Mark Pending
            </Button>
          )}

          {/* Active items (not yet trashed): Cancel = soft-delete into the Deleted tab. */}
          {status !== "deleted" && (
            <Button size="sm" variant="destructive" onClick={() => onCancel(app)}>
              <XCircle className="size-4" /> Cancel
            </Button>
          )}

          {/* Trash state: restore or permanently remove. */}
          {status === "deleted" && (
            <>
              <Button size="sm" variant="secondary" onClick={() => onRestore(app)}>
                <RotateCcw className="size-4" /> Restore
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDeletePermanent(app)}>
                <Trash2 className="size-4" /> Delete Permanently
              </Button>
            </>
          )}
        </div>

        {status === "deleted" ? (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Timer className="size-3" /> Auto-deletes in {daysUntilPurge(app.deletedAt)} day(s)
          </p>
        ) : (
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3" /> Received {formatTimestamp(app.timestamp)}
          </p>
        )}
      </Card>
    </motion.div>
  );
}
