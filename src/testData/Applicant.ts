import { Availability } from "./user";

export type Applicant = {
    id: String;
    applicantId: string;
    course: string;
    availability: Availability[];
    skills: string[];
    academicCredentials: string;
    selected: boolean;
    // Optional based on lecturers preference
    rank?: number;
    // Optional comments left by lecturer
    comment?: string[];
  };
  
  export const DEFAULT_APPLICANTS: Applicant[] = [
    // Default applicants for testing purposes
    { id: "1",
      applicantId: "1",
      course: "COSC2758",
      availability: ["Full-Time"],
      skills: ["JavaScript", "React", "TypeScript"],
      academicCredentials: "Bachelor of Cyber Security",
      selected: false},

    { id: "2",
      applicantId: "1",
      course: "COSC2500",
      availability: ["Part-Time"],
      skills: ["HTML", "CSS", "Java, Scene Builder"],
      academicCredentials: "Bachelor of Data Science",
      selected: false},
  ];
  