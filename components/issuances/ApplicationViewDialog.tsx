"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, X } from "lucide-react";
import type { Application } from "@/types/application";
import { fullName } from "@/lib/filters";
import { ProfileView } from "@/components/profile/ProfileView";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// One A4 sheet is 210mm wide ≈ 794px at 96dpi — used to fit the form to the modal width.
const A4_PX = 794;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2;
const STEP = 0.1;

/**
 * Read-only modal that shows the submitted NMIS-01A (NTTC) printable form for one issuance,
 * with zoom controls and an enlarge (near-fullscreen) toggle. The full Application doc already
 * lives on each issuances row, so no extra fetch is needed.
 */
export function ApplicationViewDialog({
  app,
  open,
  onOpenChange,
}: {
  app: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [enlarged, setEnlarged] = useState(false);
  const [zoom, setZoom] = useState(0.75);
  const [autoFit, setAutoFit] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset the view each time the dialog opens.
  useEffect(() => {
    if (open) {
      setAutoFit(true);
      setEnlarged(false);
    }
  }, [open]);

  // Fit the A4 sheet to the available width until the user zooms manually.
  useEffect(() => {
    if (!open || !autoFit) return;
    const el = scrollRef.current;
    if (!el) return;
    const fit = () => {
      const avail = el.clientWidth - 32; // minus container padding
      const z = Math.min(1, Math.max(MIN_ZOOM, avail / A4_PX));
      setZoom(Number(z.toFixed(2)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, autoFit, enlarged]);

  function changeZoom(delta: number) {
    setAutoFit(false);
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((z + delta).toFixed(2)))));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex flex-col gap-0 overflow-hidden p-0",
          enlarged
            ? "h-[97vh] w-[98vw] max-w-[98vw] sm:max-w-[98vw]"
            : "h-[88vh] w-full max-w-5xl sm:max-w-5xl"
        )}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-2.5">
          <DialogTitle className="truncate text-sm">
            NTTC Application{app ? ` — ${fullName(app) || "—"}` : ""}
          </DialogTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => changeZoom(-STEP)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
            >
              <ZoomOut className="size-4" />
            </Button>
            <button
              type="button"
              onClick={() => setAutoFit(true)}
              title="Reset to fit"
              className="min-w-12 rounded px-1 text-center text-xs font-medium tabular-nums text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {Math.round(zoom * 100)}%
            </button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => changeZoom(STEP)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
            >
              <ZoomIn className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="ml-1"
              onClick={() => setEnlarged((v) => !v)}
            >
              {enlarged ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              {enlarged ? "Shrink" : "Enlarge"}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="ml-1"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Document */}
        <div ref={scrollRef} className="flex-1 overflow-auto bg-neutral-300/50 p-4">
          {app && (
            <div className="mx-auto" style={{ zoom, width: "210mm" }}>
              <ProfileView value={app} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
