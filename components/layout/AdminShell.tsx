"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileSpreadsheet, BookMarked, ChartPie, LogOut, MapPin } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SiteCredit } from "@/components/site/SiteCredit";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { email, province, role, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const dashboardHref = role === "r7admin" ? "/r7admindash" : "/admindash/onaf";
  const nav = [
    { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
    { label: "Statistics", href: "/statistics", icon: ChartPie },
    { label: "Issuances", href: "/issuances", icon: FileSpreadsheet },
    { label: "Registry", href: "/nttc-registry", icon: BookMarked },
  ];

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="no-print sticky top-0 z-40 border-b bg-gradient-to-r from-[#001933] to-[#0a2463] text-white shadow">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href={dashboardHref} className="flex items-center gap-3">
            <Image src="/icons/t7ilogo.png" alt="TESDA" width={40} height={40} className="object-contain" />
            <div className="leading-tight">
              <p className="text-sm font-bold sm:text-base">NTTC ONAF Database</p>
              <p className="flex items-center gap-1 text-xs text-sky-200">
                <MapPin className="size-3" />
                {province ?? "All Provinces"}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <Button
                  key={n.label}
                  render={<Link href={n.href} />}
                  nativeButton={false}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-sky-100 hover:bg-white/10 hover:text-white",
                    active && "bg-white/15 text-white"
                  )}
                >
                  <n.icon className="size-4" />
                  <span className="hidden sm:inline">{n.label}</span>
                </Button>
              );
            })}
            <ThemeToggle className="text-sky-100 hover:bg-white/10 hover:text-white" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sky-100 hover:bg-red-500/20 hover:text-white"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
        {email && (
          <div className="bg-black/20 px-4 py-1 text-right text-[11px] text-sky-200 sm:px-6">
            Signed in as {email}
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">{children}</main>

      <SiteCredit className="no-print" />
    </div>
  );
}
