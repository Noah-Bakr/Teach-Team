//
// Skill (nested under User or Course)
//
export interface Skill {
    skill_id: number;
    skill_name: string;
}

//
// AcademicCredential (nested under User)
//
export interface AcademicCredential {
    academic_id: number;
    degree_name: string;
    institution: string;
    start_date: string;      // ISO date
    end_date: string | null; // ISO date or null
    description: string | null;
}

//
// PreviousRole (nested under User)
//
export interface PreviousRole {
    previous_role_id: number;
    previous_role: string;
    company: string;
    start_date: string;        // ISO date
    end_date: string | null;   // ISO date or null
    description: string | null;
    user: { user_id: number }; // we ignore this field in the mapper
}

//
// Comment (nested under Application)
//
export interface Comment {
    comment_id: number;
    comment: string;
    created_at: string;   // ISO datetime
    updated_at: string;   // ISO datetime
    lecturer: {           // nested lecturer info
        user_id: number;
        first_name: string;
        last_name: string;
    };
    application: { application_id: number };
}

//
// Ranking (nested under Application)
//
export interface Ranking {
    ranking_id: number;
    ranking: number;
    created_at: string;   // ISO datetime
    updated_at: string;   // ISO datetime
    lecturer: {           // nested lecturer info
        user_id: number;
        first_name: string;
        last_name: string;
    };
    application: { application_id: number };
}

//
// User (nested under Application)
//
export interface User {
    user_id: number;
    username: string;
    email: string;
    password: string;       // will be discarded by the mapper
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    avatar: string | null;

    role: {
        role_id: number;
        role_name: 'admin' | 'lecturer' | 'candidate';
        users: any[];         // not used in mapper
    };
    skills: Skill[];                   // nested Skill[]
    applications: any[];               // not used in mapper
    academicCredentials: AcademicCredential[];
    courses: any[];                    // not used in mapper for this UI
    previousRoles: PreviousRole[];
    comments: Comment[];
    rankings: Ranking[];
}

//
// Course (nested under Application)
//
export interface Course {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
    skills: Skill[];    // nested array of Skill
}

//
// Application (top‐level, raw backend shape)
//
export interface Application {
    application_id: number;
    position_type: 'tutor' | 'lab_assistant';
    status: 'pending' | 'accepted' | 'rejected';
    applied_at: string;                 // ISO datetime
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    rank: number | null;

    user: User;           // nested User object
    course: Course;       // nested Course object
    comments: Comment[];  // nested array of Comment
    rankings: Ranking[];  // nested array of Ranking
}

//
// DTOs for creating/updating an Application
//
export interface CreateApplicationDto {
    position_type: 'tutor' | 'lab_assistant';
    status: 'pending' | 'accepted' | 'rejected';
    applied_at: string;               // “YYYY-MM-DD” or ISO
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    rank?: number;

    user_id: number;
    course_id: number;
}

export interface UpdateApplicationDto {
    position_type?: 'tutor' | 'lab_assistant';
    status?: 'pending' | 'accepted' | 'rejected';
    applied_at?: string;
    selected?: boolean;
    availability?: 'Full-Time' | 'Part-Time' | 'Not Available';
    rank?: number | null;
}
