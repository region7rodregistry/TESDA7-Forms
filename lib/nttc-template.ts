// Single-row "NTTC Template" projection of one application — the exact column order and
// per-field formatting the office pastes into the NTTC registry spreadsheet.
//
// Ported VERBATIM from the vanilla site's per-application import flow:
//   backup-pre-nextjs/admindash/preview.html  (the "Import to NTTC Registry" button that
//   built a flat `nttcData` object) → backup-pre-nextjs/admindash/nttcregistry.html
//   (its `orderedSections` + Copy-Data logic that produced one tab-separated row).
//
// The 26-field ORDER below is `orderedSections` flattened, and each `get()` reproduces that
// page's copy formatting exactly: dates → long ("June 21, 2026"), middle initial → "X.",
// sector/qualification → UPPERCASE, TM cert → "TMC-…", empty → "N/A" (extension → "").
//
// This differs intentionally from lib/issuance-export.ts (the multi-row registry MASTER LIST,
// which leads with Region/Province and trails with employment columns). Keep them separate.

import type { Application } from "@/types/application";
import { sectorLabel } from "@/lib/qualifications";
import { completeAddress } from "@/lib/issuance-export";
import { formatDateLong } from "@/lib/dates";

const NA = "N/A";

const m = (a: Application) => a.manpowerProfile ?? ({} as Application["manpowerProfile"]);
const p = (a: Application) => a.personalInfo ?? ({} as Application["personalInfo"]);
const w = (a: Application) => a.workingExperience ?? ({} as Application["workingExperience"]);
const n = (a: Application) => a.nttcApplication ?? ({} as Application["nttcApplication"]);

/** Long date or "N/A" for empty — mirrors the vanilla `data[key] ? formatDate(...) : 'N/A'`. */
const longDate = (v: string | undefined) => (v ? formatDateLong(v) : NA);

export interface NttcField {
  /** Human-readable label shown in the import modal. */
  label: string;
  /** The formatted value — identical for display and clipboard (what you see is what you copy). */
  get: (app: Application) => string;
}

export interface NttcGroup {
  title: string;
  fields: NttcField[];
}

/**
 * Sections drive the modal layout; flattening them (NTTC_TEMPLATE_FIELDS) drives the
 * clipboard row. One source of truth → display order can never drift from copy order.
 */
export const NTTC_TEMPLATE_GROUPS: NttcGroup[] = [
  {
    title: "Personal Information",
    fields: [
      { label: "Last Name", get: (a) => m(a).lastName || NA },
      { label: "First Name", get: (a) => m(a).firstName || NA },
      {
        label: "Middle Initial",
        get: (a) => {
          const mi = m(a).middleInitial;
          return mi && mi.length > 0 ? `${mi[0].toUpperCase()}.` : NA;
        },
      },
      // Vanilla used '' (not 'N/A') for a blank extension.
      { label: "Extension", get: (a) => m(a).extension || "" },
      { label: "Birthdate", get: (a) => longDate(p(a).birthdate) },
      { label: "Sex", get: (a) => m(a).sex || NA },
    ],
  },
  {
    title: "Contact Information",
    fields: [
      { label: "Address", get: (a) => completeAddress(a) || NA },
      { label: "Email", get: (a) => m(a).email || NA },
      { label: "Contact Number", get: (a) => m(a).contact || NA },
    ],
  },
  {
    title: "Training Information",
    fields: [
      { label: "Educational Attainment", get: (a) => w(a).educationalAttainment || NA },
      { label: "Training Institution", get: (a) => w(a).trainingInstitution || NA },
      { label: "Type of Training Institution", get: (a) => w(a).typeTrainingInstitution || NA },
      { label: "Training Hours", get: (a) => w(a).trainingHours || NA },
      { label: "Years of Experience", get: (a) => w(a).totalYears || NA },
      {
        label: "Sector",
        get: (a) => {
          const s = n(a).sector;
          return s ? sectorLabel(s).toUpperCase() : NA;
        },
      },
      {
        label: "Qualification",
        get: (a) => {
          const q = n(a).qualification;
          return q ? q.toUpperCase() : NA;
        },
      },
    ],
  },
  {
    title: "Certification",
    fields: [
      { label: "NC Certificate Number", get: (a) => n(a).ncCertNumber || NA },
      { label: "NC Date of Issuance", get: (a) => longDate(n(a).ncDateIssuance) },
      { label: "NC Validity", get: (a) => longDate(n(a).ncValidity) },
      {
        label: "TM Certificate Number",
        get: (a) => {
          const tm = n(a).tmCertNumber;
          return tm ? `TMC-${tm}` : NA;
        },
      },
      { label: "TM Date of Issuance", get: (a) => longDate(n(a).tmDateIssuance) },
      { label: "TM Validity", get: (a) => longDate(n(a).tmValidity) },
    ],
  },
  {
    title: "Assessors",
    fields: [
      { label: "Assessor 1", get: (a) => n(a).assessor1 || NA },
      { label: "Assessor 2", get: (a) => n(a).assessor2 || NA },
      { label: "Assessor 3", get: (a) => n(a).assessor3 || NA },
      { label: "NTTC Status", get: (a) => n(a).nttcstatus || NA },
    ],
  },
];

/** All 26 fields flattened in template (clipboard) order. */
export const NTTC_TEMPLATE_FIELDS: NttcField[] = NTTC_TEMPLATE_GROUPS.flatMap((g) => g.fields);

/**
 * One tab-separated row in exact NTTC-template column order, ready to paste into a single
 * spreadsheet row. Tabs/newlines inside a value are flattened to spaces so columns never shift.
 */
export function nttcTemplateRow(app: Application): string {
  return NTTC_TEMPLATE_FIELDS.map((f) => f.get(app).replace(/[\t\r\n]+/g, " ")).join("\t");
}
