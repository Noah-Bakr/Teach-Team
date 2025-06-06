import { SkillUI } from "./skillTypes";

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export type CommentUI = {
    id: number;             // comment_id
    text: string;           // comment
    createdAt: string;      // ISO datetime
    updatedAt: string;      // ISO datetime
    lecturerName: string;   // “First Last”
    lecturerId: number;
};

export type RankingUI = {
    id: number;             // ranking_id
    ranking: number;
    createdAt: string;      // ISO datetime
    updatedAt: string;      // ISO datetime
    lecturerName: string;   // “First Last”
    lecturerId: number;
};

export type CourseUI = {
    id: number;             // course_id
    code: string;           // course_code
    name: string;           // course_name
    semester: '1' | '2';
    skills: string[];       // array of skill_name
};

export type PreviousRoleUI = {
    id: number;            // previous_role_id
    role: string;          // previous_role
    company: string;
    startDate: string;     // ISO date (e.g. "2023-06-01")
    endDate: string | null;
    description: string | null;
};

export type AcademicCredentialsUI = {
    id: number;               // maps to academic_id
    degreeName: string;       // maps to degree_name
    institution: string;
    startDate: string;        // ISO date string
    endDate: string | null;   // ISO date string or null
    description: string | null;
}

// UserUI (used by applicationMapper)
export type UserUI = {
    id: number;                    // user_id
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    skills: string[];              // array of skill_name
    academicCredentials?: AcademicCredentialsUI[]; // array of degree_name
    courses: CourseUI[];           // courses the user is enrolled in
    previousRoles: PreviousRoleUI[]; // user’s prior job roles
};

// ReviewUI (combines rank + comment per review)
export type ReviewUI = {
    id: number;             // review_id
    rank: number | null;
    comment: string | null;
    reviewedAt: string;     // ISO datetime
    updatedAt: string;      // ISO datetime
    lecturerId: number;
};

export type ApplicationUI = {
    id: number;                   // application_id
    positionType: 'tutor' | 'lab_assistant';
    status: ApplicationStatus;
    appliedAt: string;            // ISO datetime
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';

    user: UserUI;

    course: CourseUI;

    reviews?: ReviewUI[];
    skills: string[];
};
