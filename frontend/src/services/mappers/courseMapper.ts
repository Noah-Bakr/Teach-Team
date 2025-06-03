import { Course as BackendCourse, Skill, User } from '../api/courseApi';
import { CourseUI } from '../../types/courseTypes';

/**
 * Extract just the skill_name array from Skill[].
 */
function extractSkillNames(skills: Skill[] | undefined): string[] {
    if (!Array.isArray(skills)) return [];
    return skills.map(s => s.skill_name);
}

/**
 * Convert raw lecturers (User[]) → array of "First Last" strings
 */
function extractLecturerNames(lecturers: User[] | undefined): string[] {
    if (!Array.isArray(lecturers)) return [];
    return lecturers.map(l => `${l.first_name} ${l.last_name}`);
}

/**
 * Map a raw backend Course → CourseUI
 */
export function mapRawCourseToCourseUI(raw: BackendCourse): CourseUI {
    return {
        id: raw.course_id,
        name: raw.course_name,
        code: raw.course_code,
        semester: raw.semester as '1' | '2',
        skills: extractSkillNames(raw.skills),
        lecturers: extractLecturerNames(raw.lecturers),
    };
}
