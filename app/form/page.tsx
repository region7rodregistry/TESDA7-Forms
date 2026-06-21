import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { NttcForm } from "@/components/form/NttcForm";

export default function FormPage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-gradient-to-r from-[#001933] to-[#0a2463] text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6">
          <Link href="/instructions" className="inline-flex w-fit items-center gap-1 text-sm text-sky-200 hover:text-white">
            <ArrowLeft className="size-4" /> Back to instructions
          </Link>
          <div className="flex items-center gap-4">
            <Image src="/icons/t7logo.png" alt="TESDA" width={56} height={56} className="object-contain" />
            <div>
              <p className="text-xs uppercase tracking-widest text-sky-300">TESDA Region VII</p>
              <h1 className="text-2xl font-bold">Trainer&apos;s Profile Form — NMIS-01A</h1>
            </div>
          </div>
          <p className="max-w-2xl text-sm text-sky-100/80">
            Complete all sections. Fields marked with <span className="text-rose-300">*</span> are
            required. Page 1 covers your profile; page 2 covers your NTTC application details.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <NttcForm />
      </div>
    </div>
  );
}
