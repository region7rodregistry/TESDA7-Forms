import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/application";

const styles: Record<ApplicationStatus, string> = {
  pending: "bg-orange-100 text-orange-700 border-orange-300",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  spam: "bg-rose-100 text-rose-800 border-rose-200",
  deleted: "bg-neutral-200 text-neutral-700 border-neutral-300",
};

const labels: Record<ApplicationStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  spam: "Spam",
  deleted: "Deleted",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", styles[status])}>
      {labels[status]}
    </Badge>
  );
}
