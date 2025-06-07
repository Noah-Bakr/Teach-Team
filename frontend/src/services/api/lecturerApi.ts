export type ApplicationStatus = "pending" | "accepted" | "rejected";
// BackendCourse
export interface BackendCourse {
    course_id: number;
    course_code: string;
    course_name: string;
    semester: '1' | '2';
}

// BackendApplication
export interface BackendApplication {
    application_id: number;
    position_type: "tutor" | "lab_assistant";
    status?: ApplicationStatus;
    applied_at: string;
    user: BackendUser;
    course: BackendCourse;
    skills: BackendSkill[];
    academicCredentials: BackendAcademicCredential[];
}

export interface BackendSkill {
    skill_id: number;
    skill_name: string;
}

export interface BackendAcademicCredential {
    academic_id: number;
    degree_name: string;
    institution: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
}

export interface BackendUser {
    user_id: number;
    username: string;
    email: string;
    role?: string;
    password: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
}

// BackendReview
export interface BackendReview {
    review_id: number;
    rank: number | null;
    comment: string | null;
    reviewed_at: string;
    updated_at: string;
    lecturer_id: { user_id: number };
    application_id: number;
}


