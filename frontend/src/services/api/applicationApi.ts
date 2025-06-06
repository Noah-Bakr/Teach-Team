export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Skill {
    skill_id: number;
    skill_name: string;
}

export interface AcademicCredential {
    academic_id: number;
    degree_name: string;
    institution: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
}

export interface PreviousRole {
    previous_role_id: number;
    previous_role: string;
    company: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
}

export interface UserNested {
    user_id: number;
    username: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    skills: Skill[];
    academicCredentials: AcademicCredential[];
    courses: CourseNested[];
    previousRoles: PreviousRole[];
}

export interface CourseNested {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
    skills: Skill[];
}

export interface Review {
    review_id: number;
    lecturer_id: number;
    application_id: number;
    rank: number | null;
    comment: string | null;
    reviewed_at: string;
    updated_at: string;
}

export interface Application {
    application_id: number;
    position_type: 'tutor' | 'lab_assistant';
    status?: ApplicationStatus;
    applied_at: string;
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    user: UserNested;
    course: CourseNested;
    reviews: Review[];
    skills: Skill[];
}

export interface CreateApplicationDto {
    position_type: 'tutor' | 'lab_assistant';
    status?: ApplicationStatus;
    applied_at: string;
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    user_id: number;
    course_id: number;
}

export interface UpdateApplicationDto {
    position_type?: 'tutor' | 'lab_assistant';
    status?: ApplicationStatus;
    applied_at?: string;
    selected?: boolean;
    availability?: 'Full-Time' | 'Part-Time' | 'Not Available';
}
