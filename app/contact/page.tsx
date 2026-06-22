import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, User, Building2, Star } from "lucide-react";
import { PublicNav } from "@/components/site/PublicNav";
import { SiteCredit } from "@/components/site/SiteCredit";
import { Reveal } from "@/components/motion/Reveal";

interface Office {
  name: string;
  director: string;
  title: string;
  address: string;
  phones: string[];
  email: string;
}

const regional: Office = {
  name: "TESDA Regional Office VII",
  director: "GAMALIEL B. VICENTE, JR. CESO III, ASEAN ENG.",
  title: "Regional Director",
  address: "Archbishop Reyes Ave., Cebu City",
  phones: ["T (032) 412-0307", "T (032) 412-0306", "TF (032) 231-1596"],
  email: "region7@tesda.gov.ph",
};

const provincial: Office[] = [
  {
    name: "Bohol",
    director: "FLORO T. RINGCA, Ph.D.T.M.",
    title: "Provincial Director",
    address: "B. Inting St., Cogon District, Tagbilaran City",
    phones: ["T (038) 501-8761", "T (038) 501-7093"],
    email: "region7.bohol@tesda.gov.ph",
  },
  {
    name: "Cebu",
    director: "CARLITO F. QUINTANO",
    title: "Provincial Director",
    address: "Salinas Drive, Lahug, Cebu City",
    phones: ["TF (032) 415-1518", "T (032) 412-7157"],
    email: "region7.cebu@tesda.gov.ph",
  },
  {
    name: "Negros Oriental",
    director: "FLETCHER B. GUMAHAD",
    title: "Provincial Director",
    address: "Old Engineering Bldg., Capitol Site, Dumaguete City",
    phones: ["T (035) 225-1578", "TF (035) 422-9481"],
    email: "region7.negrosoriental@tesda.gov.ph",
  },
  {
    name: "Siquijor",
    director: "WILKIE E. REROMA",
    title: "Provincial Director",
    address: "Caipilan, Siquijor, Siquijor",
    phones: ["(0917) 314-0185"],
    email: "region7.siquijor@tesda.gov.ph",
  },
];

function Detail({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-sky-400" />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export default function ContactPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-tesda-gradient text-sky-50">
      <PublicNav />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden px-6 py-5">
        <Reveal className="mb-5 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-400">
            Get in Touch
          </span>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Regional and Provincial Offices
          </h1>
        </Reveal>

        {/* Highlighted Regional Office */}
        <Reveal className="mb-5">
          <div className="relative overflow-hidden rounded-2xl border-2 border-sky-400/60 p-5 shadow-[0_0_36px_-10px_rgba(56,189,248,0.5)] sm:p-6">
            <Image
              src="/icons/noffice.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a2463]/90 to-[#001933]/92" />
            <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200 ring-1 ring-sky-400/40 backdrop-blur">
              <Star className="size-3 fill-sky-300 text-sky-300" />
              Regional Office
            </span>
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-40 w-32 shrink-0 self-center overflow-hidden rounded-xl shadow-lg ring-2 ring-sky-400/40 sm:self-start">
                <Image
                  src="/icons/RD.jpg"
                  alt={regional.director}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">{regional.name}</h2>
                <ul className="grid gap-x-8 gap-y-2 text-sm text-sky-100/85 sm:grid-cols-2">
                  <Detail icon={User}>
                    <span className="font-semibold text-white">{regional.director}</span>
                    <br />
                    <span className="text-sky-300">{regional.title}</span>
                  </Detail>
                  <Detail icon={MapPin}>{regional.address}</Detail>
                  <Detail icon={Phone}>{regional.phones.join("  •  ")}</Detail>
                  <Detail icon={Mail}>
                    <Link
                      href={`mailto:${regional.email}`}
                      className="font-medium text-sky-300 underline-offset-2 hover:text-sky-200 hover:underline"
                    >
                      {regional.email}
                    </Link>
                  </Detail>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Provincial Offices */}
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-sky-300">
          Region 7 — Provincial Offices
        </h2>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {provincial.map((office, i) => (
            <Reveal key={office.name} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-lg border border-sky-400/15 bg-gradient-to-br from-[#002952]/70 to-[#001933]/70 p-3 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-sky-400/40">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-blue-800 text-white">
                    <Building2 className="size-3.5" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-white">{office.name}</h3>
                </div>
                <ul className="space-y-1 text-[11px] leading-snug text-sky-100/85">
                  <Detail icon={User}>
                    <span className="font-semibold text-white">{office.director}</span>
                    <br />
                    <span className="text-sky-300">{office.title}</span>
                  </Detail>
                  <Detail icon={MapPin}>{office.address}</Detail>
                  <Detail icon={Phone}>{office.phones.join("  •  ")}</Detail>
                  <Detail icon={Mail}>
                    <Link
                      href={`mailto:${office.email}`}
                      className="break-all font-medium text-sky-300 underline-offset-2 hover:text-sky-200 hover:underline"
                    >
                      {office.email}
                    </Link>
                  </Detail>
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </main>

      <SiteCredit />
    </div>
  );
}
