// Authoritative TypeScript model of the Firestore `applications` document.
// Mirrors EXACTLY the nested object the vanilla site wrote
// (backup-pre-nextjs/preview1.html, applicationData @ line 1932).
// This is the single source of truth — never hand-map field names in components;
// go through lib/application.ts instead.

export type ApplicationStatus = "pending" | "completed" | "spam" | "deleted";

export interface TesdaInfo {
  nmisCode: string;
  nmisDate: string;
}

export interface ManpowerProfile {
  lastName: string;
  firstName: string;
  middleInitial: string;
  extension: string;
  mailingAddress: string;
  city: string;
  province: string;
  region: string;
  zipCode: string;
  poBox: string;
  sex: string;
  civilStatus: string;
  contact: string;
  telephone: string;
  email: string;
  fax: string;
  employmentType: string;
  employmentStatus: string;
}

export interface PersonalInfo {
  birthdate: string;
  birthplace: string;
  citizenship: string;
  religion: string;
  height: string;
  weight: string;
  bloodType: string;
  sssNo: string;
  gsisNo: string;
  tinNo: string;
  distinguishingMarks: string;
}

export interface SchoolRow {
  name: string;
  level: string;
  year: string;
  degree: string;
}

export interface CourseInfo {
  courseTitle: string;
  trainingDuration: string;
  scheduleFrom: string;
  scheduleTo: string;
  aptitudeExamDate: string;
  aptitudeExamTime: string;
}

export interface CompetencyAssessment {
  applicationDate: string;
  sectorComponent: string;
  tradeArea: string;
  occupation: string;
  classification: string;
  competency: string;
  trainingProgram: string;
  programSector: string;
  clientType: string;
}

export interface ExperienceRow {
  company: string;
  position: string;
  dates: string;
  salary: string;
  yearsOfExperience: string;
}

export interface WorkingExperience {
  totalYears: string;
  trainingHours: string;
  trainingInstitution: string;
  typeTrainingInstitution: string;
  educationalAttainment: string;
  experiences: ExperienceRow[];
}

export interface TrainingRow {
  title: string;
  venue: string;
  dates: string;
  hours: string;
}

export interface LicenseRow {
  title: string;
  year: string;
  rating: string;
  expiry: string;
}

export interface CompetencyPassedRow {
  sector: string;
  tradeArea: string;
  occupation: string;
  classificationLevel: string;
  competency: string;
  specialization: string;
}

export interface FamilyMember {
  name: string;
  education: string;
  occupation: string;
  income: string;
}

export interface FamilyBackground {
  spouse: FamilyMember;
  father: FamilyMember;
  mother: FamilyMember;
  guardian: FamilyMember;
  dependents: string;
  dependentAge: string;
}

export interface NttcApplication {
  sector: string;
  qualification: string;
  nttcstatus: string;
  ncCertNumber: string;
  ncDateIssuance: string;
  ncValidity: string;
  tmCertNumber: string;
  tmDateIssuance: string;
  tmValidity: string;
  assessor1: string;
  assessor2: string;
  assessor3: string;
}

/** The full `applications` Firestore document. */
export interface Application {
  /** Firestore document id (not stored in the doc body; attached on read). */
  id?: string;
  ticketNumber: string;
  timestamp: string;
  tesdaInfo: TesdaInfo;
  manpowerProfile: ManpowerProfile;
  personalInfo: PersonalInfo;
  educationalBackground: { schools: SchoolRow[] };
  courseInfo: CourseInfo;
  competencyAssessment: CompetencyAssessment;
  workingExperience: WorkingExperience;
  trainingSeminars: TrainingRow[];
  licenses: LicenseRow[];
  competencyAssessmentPassed: CompetencyPassedRow[];
  familyBackground: FamilyBackground;
  nttcApplication: NttcApplication;

  // Workflow fields added by the dashboards (not present on first submit).
  status?: ApplicationStatus;
  completedAt?: string;
  completedBy?: string;
  pendingAt?: string;
  pendingBy?: string;
  /** ISO timestamp when soft-deleted (moved to the Deleted/trash state). */
  deletedAt?: string;
  deletedBy?: string;
}
