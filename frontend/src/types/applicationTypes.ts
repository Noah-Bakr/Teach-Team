/**
 * Minimal “skill” shape we care about at the frontend:
 *   just the skill name.
 */
export interface UserSkill {
    skill_name: string;
}

/**
 * The “user” object shape we want to see.
 *   Only keep these four fields plus an array of strings (skill names).
 */
export interface ApplicationUser {
    user_id: number;
    username: string;
    email: string;
    skills: string[];    // we’ll extract only skill_name from backend
}

/**
 * The “course” object shape we want:
 *   we only need course_id, course_name, course_code, semester.
 */
export interface ApplicationCourse {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
}

/**
 * If you plan to show comments on the frontend, you might define:
 */
export interface ApplicationComment {
    comment_id: number;
    comment: string;
    created_at: string;       // ISO string
    updated_at: string;       // ISO string
    lecturer: {
        user_id: number;
        first_name: string;
        last_name: string;
    };
}

/**
 * The top‐level Application interface will combine:
 *   - the main fields on the “application” itself
 *   - a nested “user” of type ApplicationUser
 *   - a nested “course” of type ApplicationCourse
 *   - optionally an array of comments
 *
 * Note: We omit “password”, “academicCredentials”, etc.
 */
export interface Application {
    application_id: number;
    position_type: 'tutor' | 'lab_assistant';
    status: 'pending' | 'accepted' | 'rejected';
    applied_at: string;       // ISO datetime
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    rank?: number | null;

    // reduce the “user” to id, username, email, and a list of skill names:
    user: ApplicationUser;

    // reduce the “course” to just the 4 fields:
    course: ApplicationCourse;

    // If your frontend needs comments, use this (otherwise can be omitted):
    comments?: ApplicationComment[];
}
