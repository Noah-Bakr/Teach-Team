import { Skill as BackendSkill, User as BackendUser, Course as BackendCourse } from '../api/skillApi';
import { SkillUI } from '../../types/skillTypes';

/**
 * Map a raw BackendSkill to the lean SkillUI shape.
 */
export function mapRawSkillToUI(raw: BackendSkill): SkillUI {
    // Extract just the skill_name
    const name = raw.skill_name;

    // If you want usernames for each skill, extract raw.users[].username
    const users: string[] = Array.isArray(raw.users)
        ? raw.users.map((u: BackendUser) => u.username)
        : [];

    // If you want course names (or codes) for each skill, extract raw.courses[].course_name
    const courses: string[] = Array.isArray(raw.courses)
        ? raw.courses.map((c: BackendCourse) => c.course_name)
        : [];

    const ui: SkillUI = { name };

    if (users.length) ui.users = users;
    if (courses.length) ui.courses = courses;

    return ui;
}
