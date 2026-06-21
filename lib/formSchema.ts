import { z } from "zod";
import type { Application } from "@/types/application";
import { nowTimestampString } from "@/lib/dates";

const req = (label: string) => z.string().trim().min(1, `${label} is required`);
const opt = z.string().trim().default("");

const schoolRow = z.object({
  name: opt,
  level: opt,
  year: opt,
  degree: opt,
});
const experienceRow = z.object({
  company: opt,
  position: opt,
  dates: opt,
  salary: opt,
  yearsOfExperience: opt,
});
const trainingRow = z.object({ title: opt, venue: opt, dates: opt, hours: opt });
const licenseRow = z.object({ title: opt, year: opt, rating: opt, expiry: opt });
const competencyRow = z.object({
  sector: opt,
  tradeArea: opt,
  occupation: opt,
  classificationLevel: opt,
  competency: opt,
  specialization: opt,
});
const familyMember = z.object({
  name: opt,
  education: opt,
  occupation: opt,
  income: opt,
});

export const formSchema = z.object({
  tesdaInfo: z.object({ nmisCode: opt, nmisDate: opt }),
  manpowerProfile: z.object({
    lastName: req("Last name"),
    firstName: req("First name"),
    middleInitial: req("Middle initial"),
    extension: opt,
    mailingAddress: req("Address"),
    city: req("City"),
    province: req("Province"),
    region: opt,
    zipCode: opt,
    poBox: opt,
    sex: req("Sex"),
    civilStatus: opt,
    contact: req("Contact number"),
    telephone: opt,
    email: req("Email").pipe(z.string().email("Enter a valid email")),
    fax: opt,
    employmentType: opt,
    employmentStatus: opt,
  }),
  personalInfo: z.object({
    birthdate: req("Birthdate"),
    birthplace: opt,
    citizenship: opt,
    religion: opt,
    height: opt,
    weight: opt,
    bloodType: opt,
    sssNo: opt,
    gsisNo: opt,
    tinNo: opt,
    distinguishingMarks: opt,
  }),
  educationalBackground: z.object({ schools: z.array(schoolRow) }),
  courseInfo: z.object({
    courseTitle: opt,
    trainingDuration: opt,
    scheduleFrom: opt,
    scheduleTo: opt,
    aptitudeExamDate: opt,
    aptitudeExamTime: opt,
  }),
  competencyAssessment: z.object({
    applicationDate: opt,
    sectorComponent: opt,
    tradeArea: opt,
    occupation: opt,
    classification: opt,
    competency: opt,
    trainingProgram: opt,
    programSector: opt,
    clientType: opt,
  }),
  workingExperience: z.object({
    totalYears: req("Years of experience"),
    trainingHours: req("Training hours"),
    trainingInstitution: req("Training institution"),
    typeTrainingInstitution: req("Institution type"),
    educationalAttainment: req("Educational attainment"),
    experiences: z.array(experienceRow),
  }),
  trainingSeminars: z.array(trainingRow),
  licenses: z.array(licenseRow),
  competencyAssessmentPassed: z.array(competencyRow),
  familyBackground: z.object({
    spouse: familyMember,
    father: familyMember,
    mother: familyMember,
    guardian: familyMember,
    dependents: opt,
    dependentAge: opt,
  }),
  nttcApplication: z.object({
    sector: req("Sector"),
    qualification: req("Qualification"),
    nttcstatus: req("Status"),
    ncCertNumber: req("NC certificate number"),
    ncDateIssuance: req("NC date of issuance"),
    ncValidity: opt,
    tmCertNumber: req("TM certificate number").pipe(
      z.string().regex(/^\d{14}$/, "TM Certificate Number must be exactly 14 digits")
    ),
    tmDateIssuance: req("TM date of issuance"),
    tmValidity: opt,
    assessor1: req("Assessor 1"),
    assessor2: opt,
    assessor3: opt,
  }),
});

export type FormValues = z.infer<typeof formSchema>;

const emptyMember = { name: "", education: "", occupation: "", income: "" };

export const defaultFormValues: FormValues = {
  tesdaInfo: { nmisCode: "", nmisDate: "" },
  manpowerProfile: {
    lastName: "", firstName: "", middleInitial: "", extension: "", mailingAddress: "",
    city: "", province: "", region: "Region VII", zipCode: "", poBox: "", sex: "",
    civilStatus: "", contact: "", telephone: "", email: "", fax: "",
    employmentType: "", employmentStatus: "",
  },
  personalInfo: {
    birthdate: "", birthplace: "", citizenship: "", religion: "", height: "", weight: "",
    bloodType: "", sssNo: "", gsisNo: "", tinNo: "", distinguishingMarks: "",
  },
  educationalBackground: {
    schools: [
      { name: "", level: "", year: "", degree: "" },
      { name: "", level: "", year: "", degree: "" },
    ],
  },
  courseInfo: {
    courseTitle: "", trainingDuration: "", scheduleFrom: "", scheduleTo: "",
    aptitudeExamDate: "", aptitudeExamTime: "",
  },
  competencyAssessment: {
    applicationDate: "", sectorComponent: "", tradeArea: "", occupation: "",
    classification: "", competency: "", trainingProgram: "", programSector: "", clientType: "",
  },
  workingExperience: {
    totalYears: "", trainingHours: "", trainingInstitution: "",
    typeTrainingInstitution: "", educationalAttainment: "",
    experiences: [
      { company: "", position: "", dates: "", salary: "", yearsOfExperience: "" },
      { company: "", position: "", dates: "", salary: "", yearsOfExperience: "" },
      { company: "", position: "", dates: "", salary: "", yearsOfExperience: "" },
    ],
  },
  trainingSeminars: [
    { title: "", venue: "", dates: "", hours: "" },
    { title: "", venue: "", dates: "", hours: "" },
  ],
  licenses: [
    { title: "", year: "", rating: "", expiry: "" },
    { title: "", year: "", rating: "", expiry: "" },
  ],
  competencyAssessmentPassed: [
    { sector: "", tradeArea: "", occupation: "", classificationLevel: "", competency: "", specialization: "" },
    { sector: "", tradeArea: "", occupation: "", classificationLevel: "", competency: "", specialization: "" },
  ],
  familyBackground: {
    spouse: { ...emptyMember },
    father: { ...emptyMember },
    mother: { ...emptyMember },
    guardian: { ...emptyMember },
    dependents: "",
    dependentAge: "",
  },
  nttcApplication: {
    sector: "", qualification: "", nttcstatus: "new", ncCertNumber: "", ncDateIssuance: "",
    ncValidity: "", tmCertNumber: "", tmDateIssuance: "", tmValidity: "",
    assessor1: "", assessor2: "", assessor3: "",
  },
};

/** Build the full Firestore Application document from validated form values. */
export function buildApplication(values: FormValues, ticketNumber: string): Application {
  return {
    ticketNumber,
    timestamp: nowTimestampString(),
    status: "pending",
    ...values,
  };
}
