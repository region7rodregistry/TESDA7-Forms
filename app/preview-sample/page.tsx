"use client";

// TEMPORARY visual-check route — renders the printable ProfileView with sample data so the
// clean 2-page A4 layout can be reviewed without filling the form or loading Firestore.
// Visit /preview-sample. Safe to delete once the layout is approved.

import { Printer } from "lucide-react";
import { ProfileView } from "@/components/profile/ProfileView";
import { SiteCredit } from "@/components/site/SiteCredit";
import { Button } from "@/components/ui/button";
import type { Application } from "@/types/application";

const SAMPLE: Application = {
  ticketNumber: "PO-2026-06-21-0001",
  timestamp: "6/21/2026, 4:02:11 PM",
  status: "pending",
  tesdaInfo: { nmisCode: "MC-07-2026-00128", nmisDate: "2026-06-21" },
  manpowerProfile: {
    lastName: "DELA CRUZ",
    firstName: "JUAN",
    middleInitial: "P",
    extension: "Jr.",
    mailingAddress: "123 Osmeña Blvd, Barangay Cogon",
    city: "Cebu City",
    province: "Cebu",
    region: "Region VII",
    zipCode: "6000",
    poBox: "—",
    sex: "Male",
    civilStatus: "Married",
    contact: "0917 555 1234",
    telephone: "(032) 255 0000",
    email: "juan.delacruz@email.com",
    fax: "—",
    employmentType: "Employed",
    employmentStatus: "Regular",
  },
  personalInfo: {
    birthdate: "1992-03-14",
    birthplace: "Cebu City",
    citizenship: "Filipino",
    religion: "Roman Catholic",
    height: "170 cm",
    weight: "68 kg",
    bloodType: "O+",
    sssNo: "34-1234567-8",
    gsisNo: "—",
    tinNo: "123-456-789",
    distinguishingMarks: "Mole on left cheek",
  },
  educationalBackground: {
    schools: [
      { name: "Cebu Technological University", level: "College", year: "2014", degree: "BS Mechanical Engineering" },
      { name: "Cebu City National Science HS", level: "Secondary", year: "2010", degree: "—" },
    ],
  },
  courseInfo: {
    courseTitle: "Shielded Metal Arc Welding (SMAW) NC II",
    trainingDuration: "268",
    scheduleFrom: "2026-02-01",
    scheduleTo: "2026-03-15",
    aptitudeExamDate: "2026-01-20",
    aptitudeExamTime: "09:00",
  },
  competencyAssessment: {
    applicationDate: "2026-01-10",
    sectorComponent: "Metals and Engineering",
    tradeArea: "Welding",
    occupation: "Welder",
    classification: "NC II",
    competency: "Weld carbon steel plates",
    trainingProgram: "SMAW NC II",
    programSector: "Metals and Engineering",
    clientType: "Walk-in",
  },
  workingExperience: {
    totalYears: "8",
    trainingHours: "268",
    trainingInstitution: "Cebu Skills Training Center",
    typeTrainingInstitution: "Private",
    educationalAttainment: "College",
    experiences: [
      { company: "ABC Fabrication Inc.", position: "Welder", dates: "2016–2020", salary: "₱18,000", yearsOfExperience: "4" },
      { company: "Metro Shipyard Corp.", position: "Senior Welder", dates: "2020–2024", salary: "₱25,000", yearsOfExperience: "4" },
    ],
  },
  trainingSeminars: [
    { title: "Occupational Safety & Health", venue: "DOLE Region VII", dates: "2023-05-10", hours: "40" },
    { title: "Trainers Methodology I", venue: "TESDA RTC", dates: "2022-08-01", hours: "264" },
  ],
  licenses: [
    { title: "PRC Welder Certificate", year: "2019", rating: "Passed", expiry: "2027-06-30" },
  ],
  competencyAssessmentPassed: [
    { sector: "Metals and Engineering", tradeArea: "Welding", occupation: "Welder", classificationLevel: "NC II", competency: "SMAW", specialization: "Plate & Pipe" },
  ],
  familyBackground: {
    spouse: { name: "Maria Dela Cruz", education: "College", occupation: "Teacher", income: "₱22,000" },
    father: { name: "Pedro Dela Cruz", education: "High School", occupation: "Farmer", income: "₱10,000" },
    mother: { name: "Ana Dela Cruz", education: "College", occupation: "Nurse", income: "₱20,000" },
    guardian: { name: "—", education: "—", occupation: "—", income: "—" },
    dependents: "2",
    dependentAge: "5, 8",
  },
  nttcApplication: {
    sector: "metals_and_engineering",
    qualification: "Shielded Metal Arc Welding (SMAW) NC II",
    nttcstatus: "new",
    ncCertNumber: "12345678901234",
    ncDateIssuance: "2026-01-15",
    ncValidity: "2031-01-14",
    tmCertNumber: "09876543210987",
    tmDateIssuance: "2026-02-01",
    tmValidity: "2031-01-31",
    assessor1: "Engr. Maria Santos",
    assessor2: "Engr. Jose Reyes",
    assessor3: "Engr. Liza Tan",
  },
};

export default function PreviewSamplePage() {
  return (
    <div className="min-h-screen bg-neutral-200 py-6">
      <div className="no-print mx-auto mb-4 flex max-w-5xl items-center justify-between px-4">
        <p className="text-sm text-neutral-600">
          Sample preview (temporary). This is exactly how the form prints.
        </p>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="size-4" /> Print Profile
        </Button>
      </div>
      <ProfileView value={SAMPLE} />

      <SiteCredit className="no-print" />
    </div>
  );
}
