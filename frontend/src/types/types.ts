export const Availability = ['Full-Time', 'Part-Time', 'Not Available'] as const;
export type AvailabilityUI = typeof Availability[number];
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export const Roles = ['admin', 'lecturer', 'candidate'] as const;
export type RoleUI = typeof Roles[number];

export interface AcademicCredentialsUI {
    id: number;               // maps to academic_id
    degreeName: string;       // maps to degree_name
    institution: string;
    startDate: string;        // ISO date string
    endDate?: string | null;   // ISO date string or null
    description?: string | null;
    // Optional: a flat list of usernames who hold this credential
    users?: string[];
}

export interface ApplicationUI {
    id: number;                   // application_id
    positionType: 'tutor' | 'lab_assistant';
    status: ApplicationStatus;
    appliedAt: string;            // ISO datetime
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    user: UserUI;
    course: CourseUI;
    reviews?: ReviewUI[];
    skills?: SkillUI[];
}

export interface CourseUI {
    id: number;
    name: string;
    code: string;
    semester: '1' | '2';
    skills?: string[];
    lecturers?: string[];
}

export interface PreviousRoleUI {
    id: number;            // previous_role_id
    role: string;          // previous_role
    company: string;
    startDate: string;     // ISO date (e.g. "2023-06-01")
    endDate?: string | null;
    description?: string | null;
    userId?: number;
}

export interface ReviewUI {
    id: number;
    rank?: number | null;
    comment?: string | null;
    reviewedAt?: string;
    updatedAt?: string;
    lecturerId: number;
    lecturerName?: string;
    applicationId?: number;
    applicationCandidate?: string;
    applicationCourse?: string;
}

export interface SkillUI {
    id: number;
    name: string;
    users?: string[];
    courses?: string[];
}

export interface UserUI {
    id?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    role?: 'admin' | 'lecturer' | 'candidate';
    skills?: SkillUI[];
    academicCredentials?: AcademicCredentialsUI[];
    courses?: CourseUI[];
    //courses?: string[];         // courses the user is enrolled in
    previousRoles?: PreviousRoleUI[];
    createdAt?: string;
    reviews?: ReviewUI[];
}

export interface VisualInsightsUI {
    statusBreakdown: { status: string; count: number }[];
    averageRankByStatus: { status: string; avgRank: number }[];
    mostCommonSkills: { skill_name: string; count: number }[];
    usersWithMostPopularSkills: {
        skill_name: string;
        user_id: number;
        first_name: string;
        last_name: string;
        avatar?: string;
    };
    leastCommonSkills: { skill_name: string; count: number }[];
    usersWithLeastCommonSkills: {
        skill_name: string;
        user_id: number;
        first_name: string;
        last_name: string;
        avatar?: string;
    }[];
    mostAcceptedApplicant: {
        user_id: number;
        first_name: string;
        last_name: string;
        acceptedCount: number;
        avatar?: string;
    } | null;
    topApplicants: { user_id: number; first_name: string; last_name: string; avgRank: number; avatar?: string; }[];
    bottomApplicants: { user_id: number; first_name: string; last_name: string; avgRank: number; avatar?: string; }[];
    positionBreakdown: { position: string; count: number }[];
    unrankedApplicants: ApplicationUI[];
}

































// export const Roles: string[] = ['admin', 'lecturer', 'candidate'];
// export type Role = typeof Roles[number];
// export const Availability: string[] = ["Full-Time", "Part-Time", "Not Available"];
// export type Availability = typeof Availability[number];
//
// export type User = {
//   id: string;
//   username: string;
//   firstName: string;
//   lastName: string;
//   avatar?: string; // URL to the avatar image
//   email: string; // will be the username
//   password: string;
//   role: Role[]; // List of roles (closed)
//   previousRoles?: PreviousRoles[]; // Optional field only for tutors
//
//   academicCredentials?: string; // Optional field for academic credentials
//   skills?: string[]; // Optional field for skills
//   availability?: Availability[]; // Optional field for availability (list) only for tutors
// };
//
// export type Applicant = {
//     id: string;
//     date: string; // Date of application (new Date().toISOString())
//     userId: string;
//     courseId: string;
//     availability: Availability[];
//     skills: string[];
//     academicCredentials: string | null;
//     previousRoles: PreviousRoles[]
//     selected: boolean | false;
//     // Optional based on lecturers preference
//     rank?: number;
//     // Optional comments left by lecturer
//     comment?: string[];
// };
//
// export type PreviousRoles = {
//     id: string;
//     role: string;
//     company: string;
//     startDate: string;  // (new Date().toISOString())
//     endDate: string | null;  // endDate can be null if the user is still employed
//     description: string;
// };
//
// export type Course = {
//     id: string;
//     name: string;
//     skills?: string[];
// };