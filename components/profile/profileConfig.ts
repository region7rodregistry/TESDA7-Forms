import { sectorLabel } from "@/lib/qualifications";

export type FieldType = "text" | "date" | "number";

export interface FieldDef {
  label: string;
  path: string;
  type?: FieldType;
  /** Read-only display formatter (e.g. sector value → label). */
  display?: (value: string) => string;
  /** Render full-width in the grid. */
  wide?: boolean;
}

export interface TableDef {
  label: string;
  /** Dot-path to the array on the Application. */
  arrayPath: string;
  columns: { label: string; key: string; type?: FieldType }[];
}

export interface SectionDef {
  num: number;
  title: string;
  fields?: FieldDef[];
  tables?: TableDef[];
  /** Special family-background layout. */
  family?: boolean;
}

export const PROFILE_SECTIONS: SectionDef[] = [
  {
    num: 1,
    title: "To be accomplished by TESDA",
    fields: [
      { label: "NMIS / Manpower Code", path: "tesdaInfo.nmisCode" },
      { label: "Entry Date", path: "tesdaInfo.nmisDate", type: "date" },
    ],
  },
  {
    num: 2,
    title: "Manpower Profile",
    fields: [
      { label: "Last Name", path: "manpowerProfile.lastName" },
      { label: "First Name", path: "manpowerProfile.firstName" },
      { label: "Middle Initial", path: "manpowerProfile.middleInitial" },
      { label: "Extension", path: "manpowerProfile.extension" },
      { label: "Mailing Address", path: "manpowerProfile.mailingAddress", wide: true },
      { label: "City / Municipality", path: "manpowerProfile.city" },
      { label: "Province", path: "manpowerProfile.province" },
      { label: "Region", path: "manpowerProfile.region" },
      { label: "Zip Code", path: "manpowerProfile.zipCode" },
      { label: "P.O. Box", path: "manpowerProfile.poBox" },
      { label: "Sex", path: "manpowerProfile.sex" },
      { label: "Civil Status", path: "manpowerProfile.civilStatus" },
      { label: "Contact Number", path: "manpowerProfile.contact" },
      { label: "Telephone", path: "manpowerProfile.telephone" },
      { label: "Email", path: "manpowerProfile.email" },
      { label: "Fax", path: "manpowerProfile.fax" },
      { label: "Employment Type", path: "manpowerProfile.employmentType" },
      { label: "Employment Status", path: "manpowerProfile.employmentStatus" },
    ],
  },
  {
    num: 3,
    title: "Personal Information",
    fields: [
      { label: "Birthdate", path: "personalInfo.birthdate", type: "date" },
      { label: "Birthplace", path: "personalInfo.birthplace" },
      { label: "Citizenship", path: "personalInfo.citizenship" },
      { label: "Religion", path: "personalInfo.religion" },
      { label: "Height", path: "personalInfo.height" },
      { label: "Weight", path: "personalInfo.weight" },
      { label: "Blood Type", path: "personalInfo.bloodType" },
      { label: "SSS No.", path: "personalInfo.sssNo" },
      { label: "GSIS No.", path: "personalInfo.gsisNo" },
      { label: "TIN No.", path: "personalInfo.tinNo" },
      { label: "Distinguishing Marks", path: "personalInfo.distinguishingMarks", wide: true },
    ],
  },
  {
    num: 4,
    title: "Educational Background",
    tables: [
      {
        label: "Schools",
        arrayPath: "educationalBackground.schools",
        columns: [
          { label: "School", key: "name" },
          { label: "Level", key: "level" },
          { label: "Year Graduated", key: "year" },
          { label: "Degree / Qualification", key: "degree" },
        ],
      },
    ],
  },
  {
    num: 5,
    title: "Course Title",
    fields: [
      { label: "Course Title", path: "courseInfo.courseTitle", wide: true },
      { label: "Training Duration (hrs)", path: "courseInfo.trainingDuration" },
      { label: "Schedule From", path: "courseInfo.scheduleFrom", type: "date" },
      { label: "Schedule To", path: "courseInfo.scheduleTo", type: "date" },
      { label: "Aptitude Exam Date", path: "courseInfo.aptitudeExamDate", type: "date" },
      { label: "Aptitude Exam Time", path: "courseInfo.aptitudeExamTime" },
    ],
  },
  {
    num: 6,
    title: "Competency Assessment to Take",
    fields: [
      { label: "Application Date", path: "competencyAssessment.applicationDate", type: "date" },
      { label: "Sector Component", path: "competencyAssessment.sectorComponent" },
      { label: "Trade Area", path: "competencyAssessment.tradeArea" },
      { label: "Occupation", path: "competencyAssessment.occupation" },
      { label: "Classification", path: "competencyAssessment.classification" },
      { label: "Competency", path: "competencyAssessment.competency" },
      { label: "Training Program", path: "competencyAssessment.trainingProgram" },
      { label: "Program Sector", path: "competencyAssessment.programSector" },
      { label: "Client Type", path: "competencyAssessment.clientType" },
    ],
  },
  {
    num: 7,
    title: "Working Experience",
    fields: [
      { label: "Total Years of Experience", path: "workingExperience.totalYears" },
      { label: "Total Training Hours", path: "workingExperience.trainingHours" },
      { label: "Training Institution", path: "workingExperience.trainingInstitution" },
      { label: "Institution Type", path: "workingExperience.typeTrainingInstitution" },
      { label: "Educational Attainment", path: "workingExperience.educationalAttainment" },
    ],
    tables: [
      {
        label: "Experience",
        arrayPath: "workingExperience.experiences",
        columns: [
          { label: "Company", key: "company" },
          { label: "Position", key: "position" },
          { label: "Dates", key: "dates" },
          { label: "Salary", key: "salary" },
          { label: "Years", key: "yearsOfExperience" },
        ],
      },
    ],
  },
  {
    num: 8,
    title: "Other Training / Seminars Attended",
    tables: [
      {
        label: "Training / Seminars",
        arrayPath: "trainingSeminars",
        columns: [
          { label: "Title", key: "title" },
          { label: "Venue", key: "venue" },
          { label: "Dates", key: "dates" },
          { label: "Hours", key: "hours" },
        ],
      },
    ],
  },
  {
    num: 9,
    title: "Licenses / Examinations Passed",
    tables: [
      {
        label: "Licenses",
        arrayPath: "licenses",
        columns: [
          { label: "Title", key: "title" },
          { label: "Year", key: "year" },
          { label: "Rating", key: "rating" },
          { label: "Expiry Date", key: "expiry" },
        ],
      },
    ],
  },
  {
    num: 10,
    title: "Competency Assessment Passed",
    tables: [
      {
        label: "Competency Passed",
        arrayPath: "competencyAssessmentPassed",
        columns: [
          { label: "Sector", key: "sector" },
          { label: "Trade Area", key: "tradeArea" },
          { label: "Occupation", key: "occupation" },
          { label: "Classification Level", key: "classificationLevel" },
          { label: "Competency", key: "competency" },
          { label: "Specialization", key: "specialization" },
        ],
      },
    ],
  },
  {
    num: 11,
    title: "Family Background",
    family: true,
  },
  {
    num: 12,
    title: "NTTC Application Form",
    fields: [
      { label: "Sector", path: "nttcApplication.sector", display: sectorLabel },
      { label: "Qualification", path: "nttcApplication.qualification", wide: true },
      { label: "Status", path: "nttcApplication.nttcstatus" },
      { label: "NC Certificate Number", path: "nttcApplication.ncCertNumber" },
      { label: "NC Date of Issuance", path: "nttcApplication.ncDateIssuance", type: "date" },
      { label: "NC Validity", path: "nttcApplication.ncValidity", type: "date" },
      { label: "TM Certificate Number", path: "nttcApplication.tmCertNumber" },
      { label: "TM Date of Issuance", path: "nttcApplication.tmDateIssuance", type: "date" },
      { label: "TM Validity", path: "nttcApplication.tmValidity", type: "date" },
      { label: "Assessor 1", path: "nttcApplication.assessor1" },
      { label: "Assessor 2", path: "nttcApplication.assessor2" },
      { label: "Assessor 3", path: "nttcApplication.assessor3" },
    ],
  },
];

export const FAMILY_MEMBERS = [
  { label: "Spouse", key: "spouse" },
  { label: "Father", key: "father" },
  { label: "Mother", key: "mother" },
  { label: "Guardian", key: "guardian" },
] as const;
