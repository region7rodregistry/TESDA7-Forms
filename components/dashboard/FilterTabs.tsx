"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusFilter } from "@/lib/filters";

interface Props {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
  counts: { pending: number; completed: number; spam: number; deleted: number; active: number };
}

const tabs: { key: StatusFilter; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "spam", label: "Spam" },
  { key: "all", label: "All" },
  { key: "deleted", label: "Deleted" },
];

export function FilterTabs({ value, onChange, counts }: Props) {
  const countFor = (k: StatusFilter) =>
    k === "all" ? counts.active : counts[k as keyof typeof counts];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = value === t.key;
        const n = countFor(t.key);
        return (
          <Button
            key={t.key}
            size="sm"
            variant={active ? "default" : "outline"}
            onClick={() => onChange(t.key)}
            className={cn("gap-1.5", t.key === "pending" && !active && "relative")}
          >
            {t.label}
            <Badge
              variant="secondary"
              className={cn(
                "ml-1 px-1.5 py-0 text-[10px]",
                active && "bg-white/20 text-white",
                t.key === "pending" && n > 0 && !active && "bg-orange-500 text-white"
              )}
            >
              {n}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
