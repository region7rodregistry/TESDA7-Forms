"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function SiteCredit({ className }: { className?: string }) {
  // Compute the year on the client so it stays current forever, even if the
  // page was statically prerendered in a previous year.
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className={cn(
        "shrink-0 border-t border-white/10 bg-[rgba(0,25,51,0.92)] py-3 text-center text-xs text-sky-100/60",
        className,
      )}
    >
      © <span suppressHydrationWarning>{year}</span> TESDA Region VII · Developed by: TESDA VII - ROD ICT Team
    </footer>
  );
}
