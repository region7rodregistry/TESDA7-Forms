"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PROVINCES } from "@/lib/roles";
import type { Application } from "@/types/application";

interface Props {
  apps: Application[];
  selected: string | null;
  onSelect: (province: string | null) => void;
}

export function ProvinceCards({ apps, selected, onSelect }: Props) {
  const countFor = (p: string) => apps.filter((a) => a.manpowerProfile?.province === p).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PROVINCES.map((p, i) => {
        const active = selected === p;
        return (
          <motion.button
            key={p}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            onClick={() => onSelect(active ? null : p)}
            className="text-left"
          >
            <Card
              className={cn(
                "gap-1 p-4 transition-colors",
                active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/40"
              )}
            >
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" /> {p}
              </div>
              <p className="text-2xl font-bold tabular-nums">{countFor(p)}</p>
            </Card>
          </motion.button>
        );
      })}
    </div>
  );
}
