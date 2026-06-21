"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Save, Printer, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useApplication } from "@/hooks/useApplication";
import { updateApplicationById } from "@/lib/applications-db";
import { setPath } from "@/lib/object-path";
import type { Application } from "@/types/application";
import { ProfileView } from "@/components/profile/ProfileView";
import { NttcImportModal } from "@/components/nttc/NttcImportModal";
import { Button } from "@/components/ui/button";

export default function ApplicationPreviewPage({
  params,
}: {
  params: Promise<{ ticketNumber: string }>;
}) {
  const { ticketNumber } = use(params);
  const decoded = decodeURIComponent(ticketNumber);
  const router = useRouter();
  const { application, loading, error } = useApplication(decoded);

  const [draft, setDraft] = useState<Application | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (application) setDraft(application);
  }, [application]);

  function handleField(path: string, val: string) {
    setDraft((d) => (d ? setPath(d, path, val) : d));
  }

  async function handleSave() {
    if (!draft?.id) return;
    setSaving(true);
    try {
      await updateApplicationById(draft.id, draft);
      toast.success("Changes saved.");
      setEditing(false);
    } catch (e) {
      toast.error("Failed to save", { description: e instanceof Error ? e.message : "" });
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    if (application) setDraft(application);
    setEditing(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !draft) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-muted-foreground">{error ?? "Application not found."}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="size-4" /> Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>
                <X className="size-4" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="size-4" /> Edit
              </Button>
              <NttcImportModal app={draft} />
              <Button size="sm" onClick={() => window.print()}>
                <Printer className="size-4" /> Print Profile
              </Button>
            </>
          )}
        </div>
      </div>

      <ProfileView value={draft} editing={editing} onChange={handleField} />
    </div>
  );
}
