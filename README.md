# TESDA Region VII — NTTC Forms (Next.js 16)

Online system for managing **National TVET Trainer Certificates (NTTC)** for TESDA Region VII —
trainer profile submission, provincial-office review, and certification issuance.

This is the **Next.js 16** rewrite of the original vanilla-HTML site. The complete original is
preserved, untouched, in [`backup-pre-nextjs/`](./backup-pre-nextjs).

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives, neutral/brand-blue theme)
- **Framer Motion** for animations
- **Firebase** — Authentication, Firestore, Storage (project `r7nttconaf`)
- **React Hook Form** + **Zod** (the 12-section form), **Zustand** (form → preview hand-off),
  **Sonner** (toasts), **SheetJS/xlsx** (Excel export)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase web config (already set for r7nttconaf)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Firebase config lives in `.env.local` as `NEXT_PUBLIC_FIREBASE_*` (public-by-design client keys —
data is protected by Firestore Security Rules, not secrecy).

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Public landing page | Public |
| `/instructions` | User-agreement gate | Public |
| `/login` | Firebase email/password sign-in (role-based redirect) | Public |
| `/form` | NTTC Trainer's Profile form (NMIS-01A), 12 sections, 2 pages | Public |
| `/form/preview` | Pre-submit review → submit to Provincial Office | Public |
| `/admindash/onaf` | Focal/PO dashboard (province-scoped) | PO / Admin |
| `/r7admindash` | Region VII dashboard (all provinces, stats) | region7 only |
| `/issuances` | Certified issuances registry (search, export) | Authenticated |
| `/nttc-registry` | Flat spreadsheet view of issuances | Authenticated |
| `/applications/[ticketNumber]/preview` | View / edit / print one application | Authenticated |

**Roles:** `region7@tesda.gov.ph` → Region VII admin (all provinces); the PO emails map to one
province each (Cebu, Bohol, Negros Oriental, Siquijor). See `lib/roles.ts`.

## Project layout

```
app/                  App Router pages ( (admin) route group is auth-guarded )
components/
  auth/               AuthProvider + AuthGuard
  dashboard/          cards, filters, stats, modals, the shared dashboard
  form/               RHF fields, dynamic tables, the NttcForm
  profile/            ProfileView (read-only + editable) used by all preview pages
  issuances/          issuances table + flat registry
  layout/  site/  motion/  ui/   (ui/ = shadcn components)
hooks/                useApplications, useApplication, useFormStore
lib/                  firebase, roles, applications-db, filters, duplicates,
                      dates, qualifications, formSchema, object-path, …
types/                application.ts — the canonical Firestore document model
public/icons/         image assets
backup-pre-nextjs/    the original vanilla HTML site (read-only history)
```

## Data model

One Firestore collection, `applications`, keyed by a `ticketNumber` field (`PO-N`, generated via an
atomic `counters/ticketNumber` transaction). Completed applications are mirrored into `issuances`.
The full nested document shape is defined in `types/application.ts`.

## Notes vs. the original

- The three near-identical legacy preview pages are unified into one role-gated preview.
- Ticket numbers use the atomic counter (the legacy `PO-${Date.now()}` was collision-prone).
- A `storageBucket` typo (`r7nttcmis…`) in the old `dashboard.js` is fixed to `r7nttconaf`.
- PDF export uses the browser print dialog (`window.print()`) with A4 print styles — html2pdf.js
  is no longer needed.
