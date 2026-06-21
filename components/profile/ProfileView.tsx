"use client";

import Image from "next/image";
import type { Application, FamilyMember } from "@/types/application";
import { getPath } from "@/lib/object-path";
import { formatDateLong } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  PROFILE_SECTIONS,
  FAMILY_MEMBERS,
  type FieldDef,
  type TableDef,
  type SectionDef,
} from "@/components/profile/profileConfig";

interface ProfileViewProps {
  value: Application;
  editing?: boolean;
  onChange?: (path: string, value: string) => void;
}

/**
 * Clean, official-document render of the TESDA NMIS-01A "Trainer's Profile Form" as TWO A4
 * pages — page 1 = the profile (sections 1-5), page 2 = NTTC/competency/family (sections
 * 6-12), matching the physical front/back form. Fields are fill-in-the-blank rows
 * ("Label: ____value____") laid out in even columns, not boxed web inputs.
 *
 * Built for printing (Save as PDF / Ctrl+P): each page is an A4 `.print-page` sheet, a
 * forced `.print-break-before` separates them, screen chrome is `.no-print`. Read-only by
 * default; `editing` swaps the underlined values for inline inputs.
 */
export function ProfileView({ value, editing = false, onChange }: ProfileViewProps) {
  const page1 = PROFILE_SECTIONS.filter((s) => s.num <= 5);
  const page2 = PROFILE_SECTIONS.filter((s) => s.num >= 6);
  const applicant = `${value.manpowerProfile?.firstName ?? ""} ${
    value.manpowerProfile?.lastName ?? ""
  }`.trim();

  const renderSection = (section: SectionDef) => (
    <section key={section.num} className="print-avoid-break">
      <h2 className="mb-1 border-b border-neutral-400 pb-0.5 text-[11px] font-bold uppercase tracking-wide text-neutral-800">
        {section.num}. {section.title}
      </h2>
      {section.fields && (
        <div className="profile-grid">
          {section.fields.map((f) => (
            <DocField key={f.path} def={f} value={value} editing={editing} onChange={onChange} />
          ))}
        </div>
      )}
      {section.tables?.map((t) => (
        <DocTable key={t.arrayPath} def={t} value={value} editing={editing} onChange={onChange} />
      ))}
      {section.family && (
        <FamilyBackground value={value} editing={editing} onChange={onChange} />
      )}
    </section>
  );

  return (
    <div className="print-area mx-auto flex w-full flex-col items-center gap-6">
      {/* ---------- PAGE 1 ---------- */}
      <div className="print-page bg-white text-neutral-900 shadow-md">
        <header className="flex items-stretch gap-3 pb-2">
          <Image
            src="/icons/tlogo.png"
            alt="TESDA"
            width={96}
            height={96}
            className="-mt-[4mm] h-[27.5mm] w-[27.5mm] shrink-0 self-start object-contain object-top"
          />
          <div className="flex flex-1 flex-col text-center">
            <div>
              <h1 className="text-[13px] font-bold uppercase leading-tight">
                Technical Education and Skills Development Authority
              </h1>
              <p className="text-[9.5px] italic text-neutral-600">
                Pangasiwaan sa Edukasyong Teknikal at Pagpapaunlad ng Kasanayan
              </p>
              <p className="mt-0.5 text-[10.5px] font-semibold">
                Trainer&apos;s Profile Form — NMIS-01A
              </p>
            </div>
            {/* Signature — centered like the title, pushed to the foot of the 2x2 box. */}
            <div className="mt-auto flex justify-center pt-2">
              <div className="w-64 text-center">
                <div className="border-b border-neutral-700" />
                <span className="text-[10.5px] text-neutral-600">
                  Signature of Applicant over Printed Name
                </span>
              </div>
            </div>
          </div>
          {/* True 2in × 2in box (50.8mm) so a physical 2×2 photo pastes in exactly. */}
          <div className="box-border flex h-[2in] w-[2in] shrink-0 self-start items-center justify-center border border-neutral-700 text-center text-[9px] leading-tight text-neutral-400">
            ID PICTURE
            <br />
            2&quot; × 2&quot;
          </div>
        </header>

        {/* Main header divider line. */}
        <div className="mt-2 border-b-2 border-neutral-800" />

        <p className="mt-1 text-right text-[9.5px] text-neutral-500">
          Ref:{" "}
          <span className="font-mono font-semibold text-red-700">{value.ticketNumber || "—"}</span>
          {value.timestamp ? ` · ${value.timestamp}` : ""}
        </p>

        <div className="print-fill mt-2">{page1.map(renderSection)}</div>

        <p className="mt-3 text-center text-[10px] text-neutral-400">Page 1 of 2 — NMIS-01A</p>
      </div>

      {/* ---------- PAGE 2 ---------- */}
      <div className="print-page print-break-before bg-white text-neutral-900 shadow-md">
        <header className="mb-3 flex items-baseline justify-between border-b border-neutral-800 pb-1.5">
          <h1 className="text-[12px] font-bold uppercase">Trainer&apos;s Profile Form — NMIS-01A</h1>
          <span className="text-[11px] text-neutral-600">
            {applicant}
            {value.ticketNumber ? ` · ${value.ticketNumber}` : ""}
          </span>
        </header>

        <div className="print-fill">{page2.map(renderSection)}</div>

        {/* Signature at the very bottom of the form */}
        <div className="mt-8 flex justify-end">
          <div className="w-64 text-center">
            <div className="border-b border-neutral-700" />
            <span className="text-[10.5px] text-neutral-600">
              Signature of Applicant over Printed Name
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-neutral-400">Page 2 of 2 — NMIS-01A</p>
      </div>
    </div>
  );
}

/** "Label: ____value____" — underlined value, read-only span or inline input. */
function DocField({
  def,
  value,
  editing,
  onChange,
}: {
  def: FieldDef;
  value: Application;
  editing: boolean;
  onChange?: (path: string, value: string) => void;
}) {
  const raw = (getPath<string>(value, def.path) ?? "") as string;
  const isDisplay = !!def.display; // coded fields (e.g. sector) stay read-only
  // Read-only display: coded → label, date → "April 5, 2025", else raw.
  const shown = isDisplay ? def.display!(raw) : def.type === "date" ? formatDateLong(raw) : raw;
  const editable = editing && !isDisplay;

  return (
    <div className={cn("doc-field", def.wide && "col-span-2")}>
      <span className="doc-label">{def.label}:</span>
      {editable ? (
        <input
          type={def.type === "date" ? "date" : "text"}
          value={raw}
          onChange={(e) => onChange?.(def.path, e.target.value)}
          className="doc-value"
        />
      ) : (
        <span className="doc-value" title={shown}>
          {shown}
        </span>
      )}
    </div>
  );
}

function DocTable({
  def,
  value,
  editing,
  onChange,
}: {
  def: TableDef;
  value: Application;
  editing: boolean;
  onChange?: (path: string, value: string) => void;
}) {
  const rows = (getPath<Record<string, string>[]>(value, def.arrayPath) ?? []) as Record<
    string,
    string
  >[];
  const displayRows = rows.length > 0 ? rows : [emptyRow(def)];

  return (
    <table className="mt-1 w-full border-collapse border border-neutral-500 text-[10px]">
      <thead>
        <tr>
          {def.columns.map((c) => (
            <th
              key={c.key}
              className="border border-neutral-500 bg-neutral-100 px-1.5 py-0.5 text-left text-[8.5px] font-semibold uppercase tracking-wide text-neutral-700"
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {displayRows.map((row, i) => (
          <tr key={i}>
            {def.columns.map((c) => (
              <td key={c.key} className="border border-neutral-500 align-top">
                {editing ? (
                  <input
                    type={c.type === "date" ? "date" : "text"}
                    value={row[c.key] ?? ""}
                    onChange={(e) => onChange?.(`${def.arrayPath}.${i}.${c.key}`, e.target.value)}
                    className="w-full border-0 bg-transparent px-1.5 py-0.5 text-[10px] outline-none focus:bg-red-50"
                  />
                ) : (
                  <span className="block min-h-[0.95rem] px-1.5 py-0.5">{row[c.key] || " "}</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function emptyRow(def: TableDef): Record<string, string> {
  return Object.fromEntries(def.columns.map((c) => [c.key, ""]));
}

function FamilyBackground({
  value,
  editing,
  onChange,
}: {
  value: Application;
  editing: boolean;
  onChange?: (path: string, value: string) => void;
}) {
  const fb = value.familyBackground;
  const memberFields: { label: string; key: keyof FamilyMember }[] = [
    { label: "Name", key: "name" },
    { label: "Educational Attainment", key: "education" },
    { label: "Occupation", key: "occupation" },
    { label: "Monthly Income", key: "income" },
  ];

  return (
    <div className="space-y-2">
      <table className="w-full border-collapse border border-neutral-500 text-[10px]">
        <thead>
          <tr>
            <th className="border border-neutral-500 bg-neutral-100 px-1.5 py-0.5 text-left text-[8.5px] font-semibold uppercase text-neutral-700">
              Relationship
            </th>
            {memberFields.map((f) => (
              <th
                key={f.key}
                className="border border-neutral-500 bg-neutral-100 px-1.5 py-0.5 text-left text-[8.5px] font-semibold uppercase text-neutral-700"
              >
                {f.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FAMILY_MEMBERS.map((m) => {
            const member = (fb?.[m.key] ?? {}) as FamilyMember;
            return (
              <tr key={m.key}>
                <td className="border border-neutral-500 px-2 py-1 font-semibold">{m.label}</td>
                {memberFields.map((f) => (
                  <td key={f.key} className="border border-neutral-500 align-top">
                    {editing ? (
                      <input
                        type="text"
                        value={member[f.key] ?? ""}
                        onChange={(e) =>
                          onChange?.(`familyBackground.${m.key}.${f.key}`, e.target.value)
                        }
                        className="w-full border-0 bg-transparent px-1.5 py-0.5 text-[10px] outline-none focus:bg-red-50"
                      />
                    ) : (
                      <span className="block min-h-[0.95rem] px-1.5 py-0.5">
                        {member[f.key] || " "}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="profile-grid">
        <DocFieldRaw
          label="No. of Dependents"
          path="familyBackground.dependents"
          value={fb?.dependents ?? ""}
          editing={editing}
          onChange={onChange}
        />
        <DocFieldRaw
          label="Dependent Age(s)"
          path="familyBackground.dependentAge"
          value={fb?.dependentAge ?? ""}
          editing={editing}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

/** Simple labelled doc-field bound to an explicit path/value (used outside the config grid). */
function DocFieldRaw({
  label,
  path,
  value,
  editing,
  onChange,
}: {
  label: string;
  path: string;
  value: string;
  editing: boolean;
  onChange?: (path: string, value: string) => void;
}) {
  return (
    <div className="doc-field">
      <span className="doc-label">{label}:</span>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(path, e.target.value)}
          className="doc-value"
        />
      ) : (
        <span className="doc-value">{value}</span>
      )}
    </div>
  );
}
