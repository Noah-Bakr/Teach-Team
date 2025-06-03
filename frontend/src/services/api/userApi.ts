export interface Role {
    role_id: number;
    role_name: 'admin' | 'lecturer' | 'candidate';
    users: any[];  // we’ll ignore this field in our mapper
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
    user: { user_id: number }; // nested but we ignore it
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

export interface User {
    user_id: number;
    username: string;
    email: string;
    password: string;           // we will not include this in UI
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    avatar: string | null;

    role: Role;                  // nested object
    skills: Skill[];             // nested array
    applications: any[];         // we’ll ignore in UI
    academicCredentials: AcademicCredential[];
    courses: Course[];
    previousRoles: PreviousRole[];
    comments: Comment[];
    rankings: any[];
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
