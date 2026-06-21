# Backup — Pre-Next.js (Vanilla HTML)

This folder is a **complete, untouched snapshot** of the original TESDA Region VII Forms
website as it existed **before the migration to Next.js 16**.

It is the vanilla HTML / CSS / JavaScript version (Tailwind via CDN, Firebase compat SDK,
SweetAlert2, html2pdf.js). Everything here still runs by opening the `.html` files directly
or serving the folder statically — no build step.

## Contents

| Path | Purpose |
|------|---------|
| `index.html` | Public landing page |
| `login.html` | Firebase email/password login (role-based redirect) |
| `instructions.html` | User-agreement gate before the form |
| `form.html` | NTTC Trainer's Profile form (NMIS-01A) |
| `preview1.html` | Form preview / PDF export |
| `admindash/` | Focal-person admin dashboard (onaf, issuances, registry, preview) |
| `r7admindash/` | Region VII admin dashboard (dashboard, preview) |
| `icons/` | All image assets |

## Why this exists

The live project at the repository root was rebuilt with **Next.js 16 (App Router) +
TypeScript + TailwindCSS + shadcn/ui + Framer Motion**. This snapshot is kept so the
original implementation can always be referenced or restored.

> Do not edit files here — treat this folder as read-only history.
