export const Roles: string[] = ["admin", "lecturer", "tutor"];
export type Role = typeof Roles[number];
export const Availability: string[] = ["Full-Time", "Part-Time", "Not Available"];
export type Availability = typeof Availability[number];

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string; // URL to the avatar image
  email: string; // will be the username
  password: string;
  role: Role[]; // List of roles (closed)

  academicCredentials?: string; // Optional field for academic credentials
  skills?: string[]; // Optional field for skills
  availability?: Availability[]; // Optional field for availability (list)
};

export type Applicant = {
    id: string;
    date: string; // Date of application (new Date().toISOString())
    userId: string;
    courseId: string;
    availability: Availability[];
    skills: string[];
    academicCredentials: string;
    selected: boolean;
    // Optional based on lecturers preference
    rank?: number;
    // Optional comments left by lecturer
    comment?: string[];
  };

export type Course = {
    id: string;
    name: string;
    skills?: string[];
};