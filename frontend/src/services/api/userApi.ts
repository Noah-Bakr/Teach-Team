export interface Role {
    role_id: number;
    role_name: 'admin' | 'lecturer' | 'candidate';
    users: unknown[]; // ignored by mapper
}

export interface Skill {
    skill_id: number;
    skill_name: string;
}

export interface Course {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
}

export interface PreviousRole {
    previous_role_id: number;
    previous_role: string;
    company: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
    user: { user_id: number };
}

export interface AcademicCredential {
    academic_id: number;
    degree_name: string;
    institution: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
}

export interface Comment {
    comment_id: number;
    comment: string;
    created_at: string;
    updated_at: string;
    application: { application_id: number };
    lecturer: { user_id: number; first_name: string; last_name: string };
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

export interface User {
    user_id: number;
    username: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    avatar: string | null;

    role: Role;
    skills: Skill[];
    applications: unknown[]; // ignored by mapper
    academicCredentials: AcademicCredential[];
    courses: Course[];
    previousRoles: PreviousRole[];
    comments: Comment[];
    rankings: unknown[]; // ignored by mapper
    reviews: Review[];
}

export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar?: string | null;
    role_id: number;
}

export interface UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string | null;
    role_id?: number;
}
