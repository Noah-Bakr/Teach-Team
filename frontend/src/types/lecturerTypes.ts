export interface SkillUI {
    id: number;
    name: string;
}

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface AcademicCredentialsUI {
    id: number;               // maps to academic_id
    degreeName: string;       // maps to degree_name
    institution: string;
    startDate: string;        // ISO date string
    endDate: string | null;   // ISO date string or null
    description: string | null;
}


export type PreviousRoleUI = {
    id: number;            // previous_role_id
    role: string;          // previous_role
    company: string;
    startDate: string;     // ISO date (e.g. "2023-06-01")
    endDate: string | null;
    description?: string | null;
};

export interface UserUI {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    skills: SkillUI[];
    academicCredentials: AcademicCredentialsUI[];
    courses?: CourseUI[];           // courses the user is enrolled in
    previousRoles?: PreviousRoleUI[];
}

export interface CourseUI {
    id: number;
    name: string;
    code: string;
    semester: '1' | '2';
    skills: string[];
}

export interface ReviewUI {
    id: number;
    lecturerId: number;
    applicationId: number;
    rank: number | null;
    comment: string | null;
    reviewedAt: string;
    updatedAt: string;
}

export interface ApplicationUI {
    id: number;
    positionType: 'tutor' | 'lab_assistant';
    status: ApplicationStatus;
    appliedAt: string;
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    user: UserUI;
    course: CourseUI;
    reviews: ReviewUI[];
}
