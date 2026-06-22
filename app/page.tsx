import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PublicNav } from "@/components/site/PublicNav";
import { SiteCredit } from "@/components/site/SiteCredit";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-tesda-gradient text-sky-50">
      <PublicNav />

      {/* Hero — single viewport, fills remaining height */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden">
        <Image
          src="/icons/office.jpg"
          alt=""
          fill
          priority
          className="object-cover blur-[5px]"
        />
        <div className="absolute inset-0 bg-[#001226]/70" />

        <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
          <Reveal className="rounded-2xl border border-sky-400/20 bg-[rgba(0,25,51,0.82)] p-6 shadow-2xl backdrop-blur sm:p-12">
            <h1 className="mb-5 font-extrabold leading-tight">
              <span className="text-rainbow whitespace-nowrap text-[clamp(1.25rem,6vw,3.5rem)]">
                NTTC Application Form
              </span>
            </h1>
            <p className="mb-8 text-lg text-sky-100/90">
              A web-based system for managing National TVET Trainer Certificates — streamlining
              data entry, tracking, and certification in support of TESDA&apos;s digitalization
              efforts.
            </p>
            <Button
              render={<Link href="/instructions" />}
              nativeButton={false}
              size="lg"
              className="rounded-full px-8"
            >
              Get Started <ArrowRight className="ml-1 size-4" />
            </Button>
          </Reveal>
        </div>
      </section>

      <SiteCredit />
    </div>
  );
}
