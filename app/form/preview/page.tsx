"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Pencil, Printer, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useFormStore } from "@/hooks/useFormStore";
import { addApplication, nextTicketNumber } from "@/lib/applications-db";
import { nowTimestampString } from "@/lib/dates";
import { ProfileView } from "@/components/profile/ProfileView";
import { SiteCredit } from "@/components/site/SiteCredit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function FormPreviewPage() {
  const router = useRouter();
  const draft = useFormStore((s) => s.draft);
  const clearDraft = useFormStore((s) => s.clearDraft);

  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (hydrated && !draft && !ticket) router.replace("/form");
  }, [hydrated, draft, ticket, router]);

  async function handleSubmit() {
    if (!draft) return;
    setSubmitting(true);
    try {
      const ticketNumber = await nextTicketNumber();
      await addApplication({
        ...draft,
        ticketNumber,
        timestamp: nowTimestampString(),
        status: "pending",
      });
      // NOTE: keep the draft until the user leaves — clearing it here would null `draft`
      // and trip the `!draft` loading guard below, hiding the success dialog (infinite spinner).
      setTicket(ticketNumber);
    } catch (e) {
      toast.error("Submission failed", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated || !draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 pb-16">
      <div className="no-print sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold">Review your application</h1>
            <p className="text-xs text-muted-foreground">
              Please check all details before submitting to the Provincial Office.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/form")}>
              <Pencil className="size-4" /> Edit Form
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="size-4" /> Print Profile
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Submit to Provincial Office
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <ProfileView value={draft} />
      </div>

      <SiteCredit className="no-print" />

      <Dialog open={!!ticket} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader className="items-center text-center sm:text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.15, 1] }}
              transition={{ duration: 0.5 }}
            >
              <Image src="/icons/success.png" alt="Success" width={88} height={88} className="mx-auto" />
            </motion.div>
            <DialogTitle>Application Submitted!</DialogTitle>
            <DialogDescription>
              Your application has been sent to the Provincial Office. Please keep your ticket number
              for tracking.
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-2xl font-bold text-primary">{ticket}</p>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                clearDraft();
                router.push("/");
              }}
            >
              Back to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
