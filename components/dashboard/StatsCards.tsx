"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, ShieldAlert, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  counts: { pending: number; completed: number; spam: number; total: number };
}

export function StatsCards({ counts }: Props) {
  const stats = [
    { label: "Pending", value: counts.pending, icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Completed", value: counts.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Spam", value: counts.spam, icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-100" },
    { label: "Total", value: counts.total, icon: Layers, color: "text-sky-600", bg: "bg-sky-100" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -4 }}
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
  );
}
