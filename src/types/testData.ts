import { Applicant, Course, User } from "./types";

export const DEFAULT_USERS: User[] = [
  // Default users for testing purposes
  { id: "U0000001", 
    username: "admin_user",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com", 
    password: "admin123", 
    role: ["admin"] },
  
  { id: "U0000002", 
    username: "john_doe", 
    firstName: "John", 
    lastName: "Doe", 
    email: "john@example.com", 
    password: "Cart@21-c0ding", 
    avatar: "https://mighty.tools/mockmind-api/content/human/80.jpg",
    role: ["lecturer"],
    academicCredentials: "Bachelor of Computer Science",
    skills: ["Java", "Python", "C++"],
    availability: ["Full-Time"] },

  { id: "U0000003", 
    username: "jane_doe", 
    firstName: "Jane", 
    lastName: "Doe", 
    email: "jane@example.com", 
    password: "Cart@21-c0ding", 
    role: ["tutor"] },

  { id: "U0000004", 
    username: "bob_smith", 
    firstName: "Bob", 
    lastName: "Smith", 
    email: "bob@example.com", 
    password: "Cart@21-c0ding", 
    role: ["tutor"] },
];

export const DEFAULT_COURSES: Course[] = [
    // Default courses for testing purposes
  { id: "COSC2627", 
    name: "Blockchain Tech Fundamentals",
    skills: ["Blockchain", "Cryptography", "Distributed Systems"] },

    { id: "COSC2625", 
        name: "Introduction to Cyber Security",
        skills: ["Network Security", "Cryptography", "Ethical Hacking"] },

    { id: "COSC2960",
        name: "Foundations of AI for STEM",
        skills: ["Python", "Data Analysis", "Machine Learning"] },

    { id: "COSC2758",
        name: "Full Stack Development",
        skills: ["JavaScript", "React", "CSS"] },

    { id: "COSC3413",
        name: "Software Eng Fundamentals IT",
        skills: ["Java", "Android", "iOS"] },

    { id: "COSC2757",
        name: "Cloud Foundations",
        skills: ["AWS", "Docker", "Kubernetes"] },

];

export const DEFAULT_APPLICANTS: Applicant[] = [
    // Default applicants for testing purposes
    { id: "A0000001",
      applicantId: "U0000001",
      course: "COSC2625",
      availability: ["Full-Time"],
      skills: ["JavaScript", "React", "TypeScript"],
      academicCredentials: "Bachelor of Cyber Security",
      selected: false},

    { id: "A0000002",
      applicantId: "U0000002",
      course: "COSC2625",
      availability: ["Part-Time"],
      skills: ["Java", "Android", "iOS"],
      academicCredentials: "Bachelor of Data Science",
      selected: false},

    { id: "A0000003",
    applicantId: "U0000003",
    course: "COSC2625",
    availability: ["Part-Time"],
    skills: ["HTML", "CSS", "Java, Scene Builder"],
    academicCredentials: "Bachelor of Data Engineering",
    selected: false},

    { id: "A0000004",
    applicantId: "U0000004",
    course: "COSC2625",
    availability: ["Full-Time"],
    skills: ["Network Security", "Cryptography", "Ethical Hacking"],
    academicCredentials: "Bachelor of Computer Science",
    selected: false},

    { id: "A0000005",
    applicantId: "U0000001",
    course: "COSC2758",
    availability: ["Full-Time"],
    skills: ["JavaScript", "React", "TypeScript"],
    academicCredentials: "Bachelor of Cyber Security",
    selected: false},

    { id: "A0000006",
    applicantId: "U0000002",
    course: "COSC2758",
    availability: ["Part-Time"],
    skills: ["Java", "Android", "iOS"],
    academicCredentials: "Bachelor of Data Science",
    selected: false},

    { id: "A0000007",
    applicantId: "U0000003",
    course: "COSC3413",
    availability: ["Part-Time"],
    skills: ["HTML", "CSS", "Java, Scene Builder"],
    academicCredentials: "Bachelor of Data Engineering",
    selected: false},

    { id: "A0000008",
    applicantId: "U0000002",
    course: "COSC2757",
    availability: ["Full-Time"],
    skills: ["Network Security", "Cryptography", "Ethical Hacking"],
    academicCredentials: "Bachelor of Computer Science",
    selected: false},
  ];