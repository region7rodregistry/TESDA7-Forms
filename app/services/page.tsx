import { ClipboardList, FileCheck2, Award, FileText, ChevronRight } from "lucide-react";
import { PublicNav } from "@/components/site/PublicNav";
import { SiteCredit } from "@/components/site/SiteCredit";
import { Reveal } from "@/components/motion/Reveal";

const sections = [
  {
    id: "competency-standards",
    icon: ClipboardList,
    title: "Competency Standards Development",
  },
  {
    id: "program-registration",
    icon: FileCheck2,
    title: "Program Registration and Accreditation",
  },
  {
    id: "assessment-certification",
    icon: Award,
    title: "Assessment and Certification",
  },
];

const faqGroups = [
  {
    label:
      "a. General Requirements and Procedures in Applying for Assessment and Certification (National Certificate (NC) / Certificate of Competency (COC))",
    items: [
      "New Applicant",
      "Renewal",
      "Lost/Damaged Certificate",
      "Certification, Verification and Authentication (CAV) for TESDA Issued National Certificates (NC) / Certificates of Competency (COC)",
    ],
  },
  {
    label: "b. Maritime / Seafarer",
    items: [
      "Steps in Applying for Certification, Verification and Authentication (CAV) for TESDA Issued COC-Maritime",
    ],
  },
  {
    label: "c. Household Service Worker",
    items: ["Procedures and Guidelines in applying for Household Service Worker NC II"],
  },
  {
    label: "d. Lists",
    items: [
      "List of TESDA Accredited Assessment Centers (PDF) (MSExcel)",
      "List of Assessment Fees",
    ],
  },
  {
    label: "e. Online Verification Registries",
    items: [
      "Registry of Certified Workers",
      "Maritime Certificate (COC) Verification",
      "Registry of Certified Household Service Workers",
      "Registry of Certified Welders",
      "Registry of TESDA Accredited Trainors/Assessors (Archive Only)",
      "NEW! List of National TVET Trainers Certificate (NTTC) Holders as of December 2013",
    ],
  },
  {
    label:
      "f. Skills Certificate Equivalency Program (SCEP) by TESDA and the Civil Service Commission",
    items: ["Primer/Reference Page for SCEP Application"],
  },
  {
    label:
      "g. Guidelines on the Implementation of Competency Assessment and Certification of TVET Trainers for Level I and II",
    items: ["View/download the PDF here"],
  },
];

function ResourceItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <FileText className="mt-0.5 size-4 shrink-0 text-sky-400" />
      <span className="text-sky-200">{children}</span>
    </li>
  );
}

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: typeof Award;
  children: React.ReactNode;
}) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-white">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-800 text-white">
        <Icon className="size-6" />
      </span>
      {children}
    </h2>
  );
}

const cardClass =
  "scroll-mt-24 rounded-2xl border border-sky-400/20 bg-[rgba(0,25,51,0.6)] p-6 shadow-lg sm:p-8";

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-tesda-gradient text-sky-50">
      <PublicNav />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <Reveal className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-sky-400">
            What We Do
          </span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">TESDA Services</h1>
        </Reveal>

        {/* Quick navigation */}
        <Reveal className="mb-12">
          <div className="grid gap-3 sm:grid-cols-3">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-3 rounded-xl border border-sky-400/15 bg-gradient-to-br from-[#002952]/70 to-[#001933]/70 p-4 transition-colors hover:border-sky-400/40"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-800 text-white">
                  <s.icon className="size-4" />
                </span>
                <span className="text-sm font-semibold text-white">{s.title}</span>
                <ChevronRight className="ml-auto size-4 text-sky-400 transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </Reveal>

        <div className="space-y-8">
          {/* Competency Standards Development */}
          <Reveal>
            <section id="competency-standards" className={cardClass}>
              <SectionHeading icon={ClipboardList}>Competency Standards Development</SectionHeading>
              <div className="space-y-4 leading-relaxed text-sky-100/85">
                <p>
                  TESDA develops competency standards for middle-level skilled workers. These are in
                  the form of units of competency containing descriptors for acceptable work
                  performance. These are packaged into qualifications corresponding to critical jobs
                  and occupations in the priority industry sectors. The qualifications correspond to
                  specific levels in the Philippine TVET Qualifications Framework (PTQF).
                </p>
                <p>
                  The competency standards and qualifications, together with training standards and
                  assessment arrangements, comprise the national training regulations (TR)
                  promulgated by the TESDA Board. The TRs serve as the basis for registration and
                  delivery of TVET programs, competency assessment and certification, and
                  development of curricula for the specific qualification.
                </p>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                <ResourceItem>List of Promulgated Training Regulations (TR)</ResourceItem>
                <ResourceItem>List of Competency Based Curriculum (CBC)</ResourceItem>
              </ul>
            </section>
          </Reveal>

          {/* Program Registration and Accreditation */}
          <Reveal>
            <section id="program-registration" className={cardClass}>
              <SectionHeading icon={FileCheck2}>
                Program Registration and Accreditation
              </SectionHeading>
              <div className="space-y-4 leading-relaxed text-sky-100/85">
                <p>
                  Program registration in UTPRAS is the mandatory registration of Technical
                  Vocational Education and Training (TVET) programs with TESDA. It is the system that
                  ensures compliance of Technical Vocational Institutions (TVIs) with the minimum
                  requirements as prescribed under the promulgated training regulation — including,
                  among others, curricular programs, faculty and staff qualifications, physical
                  sites and facilities, tools, equipment, supplies and materials, and similar
                  requirements — prior to the issuance of the government authority to offer or
                  undertake technical vocational education programs.
                </p>
                <p>
                  A TVET institution has to comply with the requirements of registration prior to
                  its offering of a program. Upon completion of all the requirements, an institution
                  is issued a Certificate of Program Registration (CoPR) and the program is
                  officially listed in the TESDA Compendium of Registered Programs. The program is
                  subjected to a compliance audit and, in some instances, surveillance upon receipt
                  of a complaint by TESDA.
                </p>
              </div>
            </section>
          </Reveal>

          {/* Assessment and Certification */}
          <Reveal>
            <section id="assessment-certification" className={cardClass}>
              <SectionHeading icon={Award}>Assessment and Certification</SectionHeading>
              <div className="space-y-4 leading-relaxed text-sky-100/85">
                <p>
                  TESDA pursues the assessment and certification of the competencies of middle-level
                  skilled workers through the Philippine TVET Qualification and Certification System
                  (PTQCS). The assessment process seeks to determine whether the graduate or worker
                  can perform to the standards expected in the workplace based on the defined
                  competency standards. Certification is provided to those who meet the competency
                  standards. This ensures the productivity, quality, and global competitiveness of
                  middle-level workers.
                </p>
                <p>
                  TESDA has a Registry of Certified Workers which provides information on the pool of
                  certified workers for certain occupations nationwide.
                </p>
                <p>
                  TESDA also has accredited assessment centers as well as competency assessors who
                  conduct the competency assessment process for persons applying for certification.
                </p>
              </div>

              <ul className="mt-5 space-y-3 text-sm">
                <ResourceItem>
                  Philippine TVET Qualification and Certification System (PTQCS) Primer
                </ResourceItem>
                <li>
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 size-4 shrink-0 text-sky-400" />
                    <span className="text-sky-200">
                      Frequently Asked Questions (FAQs) and Answers on the TESDA Assessment and
                      Certification
                    </span>
                  </div>
                  <div className="ml-6 mt-3 space-y-4 border-l border-sky-400/20 pl-4">
                    {faqGroups.map((g) => (
                      <div key={g.label}>
                        <p className="font-semibold text-sky-200">{g.label}</p>
                        <ol className="ml-5 mt-1.5 list-decimal space-y-1 text-sky-100/80 marker:text-sky-400">
                          {g.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </main>

      <SiteCredit />
    </div>
  );
}
