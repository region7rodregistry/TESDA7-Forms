"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { label: "Home", href: "/" },
  { label: "Instructions", href: "/instructions" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "Log In", href: "/login" },
];

export function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(0,25,51,0.92)] backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icons/tlogo.png" alt="TESDA" width={44} height={44} className="object-contain" />
          <span className="hidden text-lg font-bold text-white sm:inline">
            TESDA Region VII
          </span>
          <Image src="/icons/blogo.png" alt="Bagong Pilipinas" width={44} height={44} className="object-contain" />
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-sky-100 transition-colors hover:bg-sky-400/10 hover:text-sky-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle className="text-sky-100 hover:bg-sky-400/10 hover:text-sky-300" />

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="text-sky-100 md:hidden"
          >
            {open ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-[rgba(0,25,51,0.98)] md:hidden"
          >
            {links.map((l, i) => (
              <motion.li
                key={l.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 text-sky-100 transition-colors hover:bg-sky-400/10"
                >
                  {l.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
