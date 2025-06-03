import {
    User as BackendUser,
    Skill as BackendSkill,
    Course as BackendCourse,
    PreviousRole as BackendPrevRole,
    AcademicCredential as BackendAcadCred,
} from '../api/userApi';
import { UserUI } from '../../types/userTypes';

/**
 * Take a raw BackendSkill[] and return an array of just its names.
 */
function extractSkillNames(skills: BackendSkill[] | undefined): string[] {
    if (!Array.isArray(skills)) return [];
    return skills.map(s => s.skill_name);
}

/**
 * Take a raw BackendCourse[] and return an array of just its names.
 */
function extractCourseNames(courses: BackendCourse[] | undefined): string[] {
    if (!Array.isArray(courses)) return [];
    return courses.map(c => c.course_name);
}

/**
 * Take a raw BackendPrevRole[] and return an array of just its role titles.
 */
function extractPreviousRoleTitles(prevRoles: BackendPrevRole[] | undefined): string[] {
    if (!Array.isArray(prevRoles)) return [];
    return prevRoles.map(r => r.previous_role);
}

/**
 * Take a raw BackendAcadCred[] and return an array of just its degree_name.
 */
function extractAcademicDegreeNames(acadCreds: BackendAcadCred[] | undefined): string[] {
    if (!Array.isArray(acadCreds)) return [];
    return acadCreds.map(a => a.degree_name);
}

/**
 * Map a raw BackendUser into our lean UserUI.
 */
export function mapRawUserToUI(raw: BackendUser): UserUI {
    return {
        id: raw.user_id,
        username: raw.username,
        firstName: raw.first_name,
        lastName: raw.last_name,
        email: raw.email,
        avatar: raw.avatar,

        // Collapse raw.role.role_name to a simple string
        role: raw.role.role_name,

        // Convert nested arrays to string[]
        skills: extractSkillNames(raw.skills),
        courses: extractCourseNames(raw.courses),
        previousRoles: extractPreviousRoleTitles(raw.previousRoles),
        academicCredentials: extractAcademicDegreeNames(raw.academicCredentials),
    };
}
