import { Applicant } from '../types/types';

export const dummyApplicants: Applicant[] = [
    {
        id: 1,
        name: "Jane Doe",
        course: "COSC2758",
        availability: "Full-Time",
        skills: ["JavaScript", "React", "TypeScript"],
        academicCredentials: "Bachelor of Cyber Security",
        selected: false,
    },
    {
        id: 2,
        name: "Bob Smith",
        course: "COSC2500",
        availability: "Part-Time",
        skills: ["HTML", "CSS", "Java, Scene Builder"],
        academicCredentials: "Bachelor of Data Science",
        selected: false,
    },
]