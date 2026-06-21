import Image from "next/image";
import { Building2, MapPin, Landmark } from "lucide-react";
import { PublicNav } from "@/components/site/PublicNav";
import { Reveal } from "@/components/motion/Reveal";

const units = [
  "TESDA VII Regional Office",
  "TESDA Cebu Provincial Office",
  "TESDA Regional Training Center — Cebu",
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-tesda-gradient text-sky-50">
      <PublicNav />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <Reveal className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-sky-400">
            About Us
          </span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">The TESDA Region VII Compound</h1>
        </Reveal>

        {/* Hero image */}
        <Reveal className="mb-8">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-sky-400/20 shadow-xl">
            <Image
              src="/icons/tesdabuilding.png"
              alt="The TESDA Region VII compound in Lahug, Cebu City"
              fill
              priority
              className="object-cover"
            />
          </div>
        </Reveal>

        {/* Operating units */}
        <Reveal className="mb-8">
          <div className="rounded-2xl border border-sky-400/20 bg-[rgba(0,25,51,0.6)] p-6 shadow-lg sm:p-8">
            <p className="mb-6 flex items-start gap-2 text-lg text-sky-100/90">
              <MapPin className="mt-1 size-5 shrink-0 text-sky-400" />
              <span>
                Three operating units of TESDA are currently located in a{" "}
                <span className="font-semibold text-white">1.9-hectare compound</span> in Lahug,
                Cebu City:
              </span>
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {units.map((unit) => (
                <div
                  key={unit}
                  className="flex items-center gap-3 rounded-xl border border-sky-400/15 bg-gradient-to-br from-[#002952]/70 to-[#001933]/70 p-4"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-800 text-white">
                    <Building2 className="size-4" />
                  </div>
                  <span className="text-sm font-semibold text-white">{unit}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* History */}
        <Reveal>
          <div className="rounded-2xl border border-sky-400/20 bg-[rgba(0,25,51,0.6)] p-6 shadow-lg sm:p-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-sky-300">
              <Landmark className="size-5 text-sky-400" />
              Our History
            </h2>
            <p className="leading-relaxed text-sky-100/85">
              The history of this TESDA compound started during the establishment of the Regional
              Manpower Training Center as one of the ten skills centers of the government in
              affirmation of its commitment to the development of the country&apos;s manpower
              resources. This project was financed through a loan from the International Bank of
              Reconstruction and Development, built by the then Department of Education and Culture
              (now DepEd) through the Education Projects Implementation Task Force at the donated
              property by the Provincial Government of Cebu to the then National Manpower and Youth
              Council (now TESDA by virtue of RA 7796). This project was completed on{" "}
              <span className="font-semibold text-white">February 1, 1977</span> and inaugurated on{" "}
              <span className="font-semibold text-white">September 17, 1977</span> by the then Labor
              Secretary Blas F. Ople under the administration of President Ferdinand E. Marcos.
            </p>
          </div>
        </Reveal>
      </main>

      <footer className="shrink-0 border-t border-white/10 bg-[rgba(0,25,51,0.92)] py-3 text-center text-xs text-sky-100/60">
        © {new Date().getFullYear()} TESDA Region VII. All rights reserved.
      </footer>
    </div>
  );
}
