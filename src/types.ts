// types.ts
export interface Applicant {
    id: number;
    name: string;
    course: string;
    availability: "Full-Time" | "Part-Time";
    skills: string[];
    academicCredentials: string;
    selected: boolean;
    // Optional based on lecturers preference
    rank?: number;
    // Optional comments left by lecturer
    comment?: string[];
}