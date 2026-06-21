import type { Application } from "@/types/application";
import { sectorLabel } from "@/lib/qualifications";
import { normalizeProvince } from "@/lib/roles";

type Get = (app: Application) => string;

/** A single output column: `key` is the flat header (Excel/clipboard), `label` the on-screen sub-header. */
export interface RegistryLeaf {
  key: string;
  label: string;
  get: Get;
}

/** Either a standalone column or a grouped header (NAME, NC, TM, …) spanning child columns. */
export type RegistryColumn =
  | ({ kind: "single" } & RegistryLeaf)
  | { kind: "group"; label: string; children: RegistryLeaf[] };

const m = (a: Application) => a.manpowerProfile ?? ({} as Application["manpowerProfile"]);
const p = (a: Application) => a.personalInfo ?? ({} as Application["personalInfo"]);
const w = (a: Application) => a.workingExperience ?? ({} as Application["workingExperience"]);
const n = (a: Application) => a.nttcApplication ?? ({} as Application["nttcApplication"]);

/** Full mailing address composed from the discrete address parts. */
export function completeAddress(a: Application): string {
  const mp = m(a);
  return [mp.mailingAddress, mp.city, mp.province, mp.zipCode].filter(Boolean).join(", ");
}

/**
 * Official TESDA NTTC registry / master-list column arrangement (grouped headers).
 * Drives both the on-screen registry table and the Excel / clipboard export, so they
 * never drift apart. NOTE: the form captures a single "Total Years of Experience"
 * (mapped to Industry) and "Total Training Hours" — there is no separate training-years
 * value, so the "Years of Experience → Training" column is intentionally left blank.
 */
export const REGISTRY_COLUMNS: RegistryColumn[] = [
  { kind: "single", key: "Region", label: "Region", get: (a) => m(a).region ?? "" },
  { kind: "single", key: "Province", label: "Province", get: (a) => normalizeProvince(m(a).province) },
  {
    kind: "group",
    label: "Name",
    children: [
      { key: "Last Name", label: "Last Name", get: (a) => m(a).lastName ?? "" },
      { key: "First Name", label: "First Name", get: (a) => m(a).firstName ?? "" },
      { key: "M.I.", label: "M.I.", get: (a) => m(a).middleInitial ?? "" },
      { key: "Ext'n.", label: "Ext'n.", get: (a) => m(a).extension ?? "" },
    ],
  },
  { kind: "single", key: "Birthday", label: "Birthday (mm/dd/yy)", get: (a) => p(a).birthdate ?? "" },
  { kind: "single", key: "Sex", label: "Sex (Male/Female)", get: (a) => m(a).sex ?? "" },
  { kind: "single", key: "Complete Address", label: "Complete Address", get: completeAddress },
  { kind: "single", key: "E-mail Address", label: "E-mail Address", get: (a) => m(a).email ?? "" },
  { kind: "single", key: "Contact No.", label: "Contact No.", get: (a) => m(a).contact ?? "" },
  {
    kind: "single",
    key: "Educational Attainment",
    label: "Educational Attainment",
    get: (a) => w(a).educationalAttainment ?? "",
  },
  {
    kind: "single",
    key: "Training Institution/Company",
    label: "Training Institution/Company",
    get: (a) => w(a).trainingInstitution ?? "",
  },
  {
    kind: "single",
    key: "Type of Training Institution",
    label: "Type of Training Institution (Private/Public)",
    get: (a) => w(a).typeTrainingInstitution ?? "",
  },
  {
    kind: "group",
    label: "Years of Experience",
    children: [
      { key: "Years of Experience (Training)", label: "Training", get: () => "" },
      { key: "Years of Experience (Industry)", label: "Industry", get: (a) => w(a).totalYears ?? "" },
    ],
  },
  { kind: "single", key: "Sector", label: "Sector", get: (a) => sectorLabel(n(a).sector ?? "") },
  {
    kind: "single",
    key: "Qualification (NC Title)",
    label: "Qualification (NC Title)",
    get: (a) => n(a).qualification ?? "",
  },
  {
    kind: "group",
    label: "NC",
    children: [
      { key: "NC Certificate Number", label: "Certificate Number", get: (a) => n(a).ncCertNumber ?? "" },
      { key: "NC Date Issued", label: "Date Issued", get: (a) => n(a).ncDateIssuance ?? "" },
      {
        key: "NC Expiration Date",
        label: "Expiration Date (mm/dd/yy)",
        get: (a) => n(a).ncValidity ?? "",
      },
    ],
  },
  {
    kind: "group",
    label: "TM",
    children: [
      {
        key: "TM Certificate Number",
        label: "Certificate Number",
        get: (a) => {
          const tm = n(a).tmCertNumber;
          return tm ? `TMC-${tm}` : "";
        },
      },
      { key: "TM Date Issued", label: "Date Issued", get: (a) => n(a).tmDateIssuance ?? "" },
      {
        key: "TM Expiration Date",
        label: "Expiration Date (mm/dd/yy)",
        get: (a) => n(a).tmValidity ?? "",
      },
    ],
  },
  {
    kind: "group",
    label: "Assessed by (Name of Panel Member)",
    children: [
      { key: "Assessed by 1", label: "1", get: (a) => n(a).assessor1 ?? "" },
      { key: "Assessed by 2", label: "2", get: (a) => n(a).assessor2 ?? "" },
      { key: "Assessed by 3", label: "3", get: (a) => n(a).assessor3 ?? "" },
    ],
  },
  {
    kind: "single",
    key: "New NTTC or Renewal?",
    label: "NEW NTTC OR RENEWAL?",
    get: (a) => n(a).nttcstatus ?? "",
  },
  {
    kind: "single",
    key: "Type of Employment",
    label: "Type of Employment",
    get: (a) => m(a).employmentType ?? "",
  },
  {
    kind: "single",
    key: "Status of Employment",
    label: "Status of Employment",
    get: (a) => m(a).employmentStatus ?? "",
  },
];

/** All leaf columns flattened in display order. */
export const REGISTRY_LEAVES: RegistryLeaf[] = REGISTRY_COLUMNS.flatMap((c) =>
  c.kind === "group" ? c.children : [c]
);

/** Ordered, flat representation of one issuance for Excel / clipboard export. */
export function flattenIssuance(app: Application): Record<string, string> {
  const row: Record<string, string> = {};
  for (const leaf of REGISTRY_LEAVES) row[leaf.key] = leaf.get(app);
  return row;
}

export function issuanceRows(apps: Application[]): Record<string, string>[] {
  return apps.map(flattenIssuance);
}

/** Tab-separated values (header + rows) for clipboard. */
export function toTSV(rows: Record<string, string>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join("\t")];
  for (const row of rows) {
    lines.push(headers.map((h) => (row[h] ?? "").replace(/\t|\n/g, " ")).join("\t"));
  }
  return lines.join("\n");
}
