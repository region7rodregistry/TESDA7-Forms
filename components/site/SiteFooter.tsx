import Link from "next/link";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Our Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "UTPRAS", href: "#" },
      { label: "Assessment & Certification", href: "#" },
      { label: "Scholarships", href: "https://www.tesda.gov.ph/barangay/" },
      { label: "Training Programs", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Support", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Data Privacy", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-sky-400">
                {col.title}
              </h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-sky-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} TESDA Region VII. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
