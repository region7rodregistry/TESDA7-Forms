"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formSchema, defaultFormValues, buildApplication, type FormValues } from "@/lib/formSchema";
import type { Application } from "@/types/application";
import {
  SEX_OPTIONS,
  CIVIL_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  INSTITUTION_TYPE_OPTIONS,
  EDUCATIONAL_ATTAINMENT_OPTIONS,
  NTTC_STATUS_OPTIONS,
} from "@/lib/formOptions";
import { SECTORS, QUALIFICATIONS } from "@/lib/qualifications";
import { validityFromIssuance } from "@/lib/dates";
import { useFormStore } from "@/hooks/useFormStore";
import { Field, SelectField } from "@/components/form/fields";
import { FieldArrayTable } from "@/components/form/FieldArrayTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const upper = (v: string) => v.toUpperCase();
const digits14 = (v: string) => v.replace(/\D/g, "").slice(0, 14);

function Section({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 border-l-4 border-primary pl-3 text-lg font-semibold text-primary">
        {num}. {title}
      </h2>
      {children}
    </Card>
  );
}

const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

/**
 * Hydration gate: the draft lives in a sessionStorage-backed Zustand store. We must wait
 * until the client has mounted (and the store rehydrated) before initializing react-hook-form,
 * because RHF locks in its defaultValues on first render. Otherwise an "Edit Form" round-trip
 * from the preview would initialize with empty values and lose the user's draft.
 */
export function NttcForm() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <NttcFormInner />;
}

function NttcFormInner() {
  const router = useRouter();
  const setDraft = useFormStore((s) => s.setDraft);
  // Read the persisted draft once, at mount (post-hydration), for defaultValues.
  const [initialDraft] = useState(() => useFormStore.getState().draft);
  const [page, setPage] = useState(1);

  const { control, handleSubmit, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialDraft ? toFormValues(initialDraft) : defaultFormValues,
    mode: "onBlur",
  });

  // Cascade: sector → qualification options
  const sector = useWatch({ control, name: "nttcApplication.sector" });
  const qualificationOptions = useMemo(
    () => (QUALIFICATIONS[sector ?? ""] ?? []).map((q) => ({ value: q, label: q })),
    [sector]
  );

  // Computed validity (issuance + 5yr − 1 day)
  const ncIssuance = useWatch({ control, name: "nttcApplication.ncDateIssuance" });
  const tmIssuance = useWatch({ control, name: "nttcApplication.tmDateIssuance" });
  useEffect(() => {
    setValue("nttcApplication.ncValidity", validityFromIssuance(ncIssuance ?? ""));
  }, [ncIssuance, setValue]);
  useEffect(() => {
    setValue("nttcApplication.tmValidity", validityFromIssuance(tmIssuance ?? ""));
  }, [tmIssuance, setValue]);

  function onValid(values: FormValues) {
    setDraft(buildApplication(values, ""));
    router.push("/form/preview");
  }

  function onInvalid(errors: FieldErrors<FormValues>) {
    const page1Keys = [
      "tesdaInfo",
      "manpowerProfile",
      "personalInfo",
      "educationalBackground",
      "courseInfo",
    ];
    const hasPage1 = page1Keys.some((k) => k in errors);
    setPage(hasPage1 ? 1 : 2);
    toast.error("Please complete the required fields", {
      description: "Fields marked with * are required. Check the highlighted inputs.",
    });
  }

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-6">
      <AnimatePresence mode="wait">
        {page === 1 ? (
          <motion.div
            key="page1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Section num={1} title="To be accomplished by TESDA">
              <div className={grid}>
                <Field control={control} name="tesdaInfo.nmisCode" label="NMIS / Manpower Code" />
                <Field control={control} name="tesdaInfo.nmisDate" label="Entry Date" type="date" />
              </div>
            </Section>

            <Section num={2} title="Manpower Profile">
              <div className={grid}>
                <Field control={control} name="manpowerProfile.lastName" label="Last Name" required transform={upper} />
                <Field control={control} name="manpowerProfile.firstName" label="First Name" required transform={upper} />
                <Field control={control} name="manpowerProfile.middleInitial" label="Middle Initial" required transform={upper} />
                <Field control={control} name="manpowerProfile.extension" label="Extension (Jr., Sr., III)" />
                <Field control={control} name="manpowerProfile.mailingAddress" label="Mailing Address" required wide />
                <Field control={control} name="manpowerProfile.city" label="City / Municipality" required />
                <Field control={control} name="manpowerProfile.province" label="Province" required />
                <Field control={control} name="manpowerProfile.region" label="Region" />
                <Field control={control} name="manpowerProfile.zipCode" label="Zip Code" />
                <Field control={control} name="manpowerProfile.poBox" label="P.O. Box" />
                <SelectField control={control} name="manpowerProfile.sex" label="Sex" required options={SEX_OPTIONS} />
                <SelectField control={control} name="manpowerProfile.civilStatus" label="Civil Status" options={CIVIL_STATUS_OPTIONS} />
                <Field control={control} name="manpowerProfile.contact" label="Contact Number" required />
                <Field control={control} name="manpowerProfile.telephone" label="Telephone" />
                <Field control={control} name="manpowerProfile.email" label="Email" type="email" required />
                <Field control={control} name="manpowerProfile.fax" label="Fax" />
                <SelectField control={control} name="manpowerProfile.employmentType" label="Employment Type" options={EMPLOYMENT_TYPE_OPTIONS} />
                <SelectField control={control} name="manpowerProfile.employmentStatus" label="Employment Status" options={EMPLOYMENT_STATUS_OPTIONS} />
              </div>
            </Section>

            <Section num={3} title="Personal Information">
              <div className={grid}>
                <Field control={control} name="personalInfo.birthdate" label="Birthdate" type="date" required />
                <Field control={control} name="personalInfo.birthplace" label="Birthplace" />
                <Field control={control} name="personalInfo.citizenship" label="Citizenship" />
                <Field control={control} name="personalInfo.religion" label="Religion" />
                <Field control={control} name="personalInfo.height" label="Height" />
                <Field control={control} name="personalInfo.weight" label="Weight" />
                <Field control={control} name="personalInfo.bloodType" label="Blood Type" />
                <Field control={control} name="personalInfo.sssNo" label="SSS No." />
                <Field control={control} name="personalInfo.gsisNo" label="GSIS No." />
                <Field control={control} name="personalInfo.tinNo" label="TIN No." />
                <Field control={control} name="personalInfo.distinguishingMarks" label="Distinguishing Marks" wide />
              </div>
            </Section>

            <Section num={4} title="Educational Background">
              <FieldArrayTable
                control={control}
                name="educationalBackground.schools"
                columns={[
                  { key: "name", label: "School" },
                  { key: "level", label: "Educational Level" },
                  { key: "year", label: "Year Graduated" },
                  { key: "degree", label: "Degree / Qualification" },
                ]}
                emptyRow={{ name: "", level: "", year: "", degree: "" }}
                addLabel="Add school"
              />
            </Section>

            <Section num={5} title="Course Title">
              <div className={grid}>
                <Field control={control} name="courseInfo.courseTitle" label="Course Title" wide />
                <Field control={control} name="courseInfo.trainingDuration" label="Training Duration (hrs)" />
                <Field control={control} name="courseInfo.scheduleFrom" label="Schedule From" type="date" />
                <Field control={control} name="courseInfo.scheduleTo" label="Schedule To" type="date" />
                <Field control={control} name="courseInfo.aptitudeExamDate" label="Aptitude Exam Date" type="date" />
                <Field control={control} name="courseInfo.aptitudeExamTime" label="Aptitude Exam Time" type="time" />
              </div>
            </Section>

            <div className="flex justify-end">
              <Button type="button" size="lg" onClick={() => setPage(2)}>
                Next <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="page2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Section num={6} title="Competency Assessment to Take">
              <div className={grid}>
                <Field control={control} name="competencyAssessment.applicationDate" label="Application Date" type="date" />
                <Field control={control} name="competencyAssessment.sectorComponent" label="Sector Component" />
                <Field control={control} name="competencyAssessment.tradeArea" label="Trade Area" />
                <Field control={control} name="competencyAssessment.occupation" label="Occupation" />
                <Field control={control} name="competencyAssessment.classification" label="Classification" />
                <Field control={control} name="competencyAssessment.competency" label="Competency" />
                <Field control={control} name="competencyAssessment.trainingProgram" label="Training Program" />
                <Field control={control} name="competencyAssessment.programSector" label="Program Sector" />
                <Field control={control} name="competencyAssessment.clientType" label="Client Type" />
              </div>
            </Section>

            <Section num={7} title="Working Experience">
              <div className={`${grid} mb-4`}>
                <Field control={control} name="workingExperience.totalYears" label="Total Years of Experience" required />
                <Field control={control} name="workingExperience.trainingHours" label="Total Training Hours" required />
                <Field control={control} name="workingExperience.trainingInstitution" label="Training Institution" required />
                <SelectField control={control} name="workingExperience.typeTrainingInstitution" label="Institution Type" required options={INSTITUTION_TYPE_OPTIONS} />
                <SelectField control={control} name="workingExperience.educationalAttainment" label="Educational Attainment" required options={EDUCATIONAL_ATTAINMENT_OPTIONS} />
              </div>
              <FieldArrayTable
                control={control}
                name="workingExperience.experiences"
                columns={[
                  { key: "company", label: "Company" },
                  { key: "position", label: "Position" },
                  { key: "dates", label: "Inclusive Dates" },
                  { key: "salary", label: "Salary" },
                  { key: "yearsOfExperience", label: "Years" },
                ]}
                emptyRow={{ company: "", position: "", dates: "", salary: "", yearsOfExperience: "" }}
                addLabel="Add experience"
              />
            </Section>

            <Section num={8} title="Other Training / Seminars Attended">
              <FieldArrayTable
                control={control}
                name="trainingSeminars"
                columns={[
                  { key: "title", label: "Title" },
                  { key: "venue", label: "Venue" },
                  { key: "dates", label: "Inclusive Dates" },
                  { key: "hours", label: "Hours" },
                ]}
                emptyRow={{ title: "", venue: "", dates: "", hours: "" }}
                addLabel="Add training"
              />
            </Section>

            <Section num={9} title="Licenses / Examinations Passed">
              <FieldArrayTable
                control={control}
                name="licenses"
                columns={[
                  { key: "title", label: "Title" },
                  { key: "year", label: "Year" },
                  { key: "rating", label: "Rating" },
                  { key: "expiry", label: "Expiry Date" },
                ]}
                emptyRow={{ title: "", year: "", rating: "", expiry: "" }}
                addLabel="Add license"
              />
            </Section>

            <Section num={10} title="Competency Assessment Passed">
              <FieldArrayTable
                control={control}
                name="competencyAssessmentPassed"
                columns={[
                  { key: "sector", label: "Sector" },
                  { key: "tradeArea", label: "Trade Area" },
                  { key: "occupation", label: "Occupation" },
                  { key: "classificationLevel", label: "Classification Level" },
                  { key: "competency", label: "Competency" },
                  { key: "specialization", label: "Specialization" },
                ]}
                emptyRow={{ sector: "", tradeArea: "", occupation: "", classificationLevel: "", competency: "", specialization: "" }}
                addLabel="Add competency"
              />
            </Section>

            <Section num={11} title="Family Background">
              {(["spouse", "father", "mother", "guardian"] as const).map((m) => (
                <div key={m} className="mb-4">
                  <p className="mb-2 text-sm font-semibold capitalize text-muted-foreground">{m}</p>
                  <div className={grid}>
                    <Field control={control} name={`familyBackground.${m}.name`} label="Name" />
                    <Field control={control} name={`familyBackground.${m}.education`} label="Education" />
                    <Field control={control} name={`familyBackground.${m}.occupation`} label="Occupation" />
                    <Field control={control} name={`familyBackground.${m}.income`} label="Monthly Income" />
                  </div>
                </div>
              ))}
              <div className={grid}>
                <Field control={control} name="familyBackground.dependents" label="No. of Dependents" />
                <Field control={control} name="familyBackground.dependentAge" label="Dependent Age(s)" />
              </div>
            </Section>

            <Section num={12} title="NTTC Application Form">
              <div className={grid}>
                <SelectField
                  control={control}
                  name="nttcApplication.sector"
                  label="Sector"
                  required
                  options={SECTORS}
                  onValueChangeSideEffect={() => setValue("nttcApplication.qualification", "")}
                />
                <SelectField
                  control={control}
                  name="nttcApplication.qualification"
                  label="Qualification"
                  required
                  options={qualificationOptions}
                  placeholder={sector ? "Select qualification" : "Select a sector first"}
                  wide
                />
                <SelectField control={control} name="nttcApplication.nttcstatus" label="Status" required options={NTTC_STATUS_OPTIONS} />
                <Field control={control} name="nttcApplication.ncCertNumber" label="NC Certificate Number" required transform={(v) => v.replace(/\D/g, "").slice(0, 14)} />
                <Field control={control} name="nttcApplication.ncDateIssuance" label="NC Date of Issuance" type="date" required />
                <Field control={control} name="nttcApplication.ncValidity" label="NC Validity (auto)" type="date" />
                <Field control={control} name="nttcApplication.tmCertNumber" label="TM Certificate Number (TMC-, 14 digits)" required transform={digits14} placeholder="14 digits" />
                <Field control={control} name="nttcApplication.tmDateIssuance" label="TM Date of Issuance" type="date" required />
                <Field control={control} name="nttcApplication.tmValidity" label="TM Validity (auto)" type="date" />
                <Field control={control} name="nttcApplication.assessor1" label="Assessor 1" required transform={upper} />
                <Field control={control} name="nttcApplication.assessor2" label="Assessor 2" transform={upper} />
                <Field control={control} name="nttcApplication.assessor3" label="Assessor 3" transform={upper} />
              </div>
            </Section>

            <div className="flex justify-between">
              <Button type="button" variant="outline" size="lg" onClick={() => setPage(1)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <Button type="submit" size="lg">
                Review & Submit <Send className="size-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/** Strip workflow/identity fields so a draft Application can re-hydrate the form. */
function toFormValues(draft: Application): FormValues {
  const { id, ticketNumber, timestamp, status, completedAt, completedBy, pendingAt, pendingBy, ...rest } =
    draft as unknown as Record<string, unknown>;
  void id; void ticketNumber; void timestamp; void status;
  void completedAt; void completedBy; void pendingAt; void pendingBy;
  return rest as unknown as FormValues;
}
