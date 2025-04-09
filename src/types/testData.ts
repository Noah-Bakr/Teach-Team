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

export const DEFAULT_COURSEIdS: Course[] = [
    // Default courseIds for testing purposes
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
      date: "2025-04-02T16:22:45.987Z",
      userId: "U0000001",
      courseId: "COSC2625",
      availability: ["Full-Time"],
      skills: ["JavaScript", "React", "TypeScript"],
      academicCredentials: "Bachelor of Cyber Security",
      selected: false},

    { id: "A0000002",
      date: "2025-04-04T10:14:22.321Z",
      userId: "U0000002",
      courseId: "COSC2625",
      availability: ["Part-Time"],
      skills: ["Java", "Android", "iOS"],
      academicCredentials: "Bachelor of Data Science",
      selected: false},

    { id: "A0000003",
      date: "2025-04-05T06:33:12.654Z",
      userId: "U0000003",
      courseId: "COSC2625",
      availability: ["Part-Time"],
      skills: ["HTML", "CSS", "Java, Scene Builder"],
      academicCredentials: "Bachelor of Data Engineering",
      selected: false},

    { id: "A0000004",
      date: "2025-04-01T12:08:56.123Z",
      userId: "U0000004",
      courseId: "COSC2625",
      availability: ["Full-Time"],
      skills: ["Network Security", "Cryptography", "Ethical Hacking"],
      academicCredentials: "Bachelor of Computer Science",
      selected: false},

    { id: "A0000005",
      date: "2025-04-03T19:45:39.111Z",
      userId: "U0000001",
      courseId: "COSC2758",
      availability: ["Full-Time"],
      skills: ["JavaScript", "React", "TypeScript"],
      academicCredentials: "Bachelor of Cyber Security",
      selected: false},

    { id: "A0000006",
      date: "2025-04-06T08:05:27.987Z",
      userId: "U0000002",
      courseId: "COSC2758",
      availability: ["Part-Time"],
      skills: ["Java", "Android", "iOS"],
      academicCredentials: "Bachelor of Data Science",
      selected: false},

    { id: "A0000007",
      date: "2025-04-07T23:59:01.234Z",
      userId: "U0000003",
      courseId: "COSC3413",
      availability: ["Part-Time"],
      skills: ["HTML", "CSS", "Java, Scene Builder"],
      academicCredentials: "Bachelor of Data Engineering",
      selected: false},

    { id: "A0000008",
      date: "2025-04-09T05:16:48.765Z",
      userId: "U0000002",
      courseId: "COSC2757",
      availability: ["Full-Time"],
      skills: ["Network Security", "Cryptography", "Ethical Hacking"],
      academicCredentials: "Bachelor of Computer Science",
      selected: false},
  ];