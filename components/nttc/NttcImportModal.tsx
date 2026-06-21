"use client";

// "Import to NTTC Registry" — the Next.js replacement for the vanilla flow where the admin
// preview page stashed `nttcData` in localStorage and redirected to nttcregistry.html.
// Now it's a self-contained modal: it shows every NTTC field for the application and a
// "Copy Data" button that puts a single tab-separated row (exact NTTC-template column order)
// on the clipboard, so the user can paste it straight into one row of the registry template.

import { useState } from "react";
import { ClipboardCheck, Copy, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import type { Application } from "@/types/application";
import { NTTC_TEMPLATE_GROUPS, nttcTemplateRow } from "@/lib/nttc-template";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NttcImportModal({ app }: { app: Application }) {
  const [copied, setCopied] = useState(false);

  async function copyData() {
    try {
      await navigator.clipboard.writeText(nttcTemplateRow(app));
      setCopied(true);
      toast.success("NTTC data copied", {
        description: "Paste it directly into a new row of the NTTC registry template.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed", {
        description: "Your browser blocked clipboard access. Try again or copy manually.",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <FileSpreadsheet className="size-4" /> Import to NTTC Registry
      </DialogTrigger>

      <DialogContent className="flex max-h-[88vh] flex-col gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="border-b p-5">
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="size-4 text-primary" /> Import to NTTC Registry
          </DialogTitle>
          <DialogDescription>
            Review the values below, then <strong>Copy Data</strong> to place a single
            tab-separated row on your clipboard — paste it into a new row of the NTTC registry
            template and the columns line up exactly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {NTTC_TEMPLATE_GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </h3>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
                {group.fields.map((field) => {
                  const value = field.get(app);
                  return (
                    <div
                      key={field.label}
                      className="flex items-baseline justify-between gap-3 border-b border-dashed border-border/60 py-1"
                    >
                      <dt className="shrink-0 text-sm text-muted-foreground">{field.label}</dt>
                      <dd className="text-right text-sm font-medium break-words">
                        {value || <span className="text-muted-foreground">—</span>}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
        </div>

        <DialogFooter className="m-0 border-t p-5">
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
          <Button onClick={copyData}>
            {copied ? <ClipboardCheck className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
