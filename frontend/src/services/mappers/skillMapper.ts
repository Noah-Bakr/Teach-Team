import { Skill as BackendSkill, User as BackendUser, Course as BackendCourse } from '../skillApi';
import { SkillUI } from '../../types/skillTypes';

/**
 * Map a raw BackendSkill to SkillUI shape.
 */
export function mapRawSkillToUI(raw: BackendSkill): SkillUI {
        const name = raw.skill_name;

    // extract raw.users[].username
    const users: string[] = Array.isArray(raw.users)
        ? raw.users.map((u: BackendUser) => u.username)
        : [];

    // extract raw.courses[].course_name
    const courses: string[] = Array.isArray(raw.courses)
        ? raw.courses.map((c: BackendCourse) => c.course_name)
        : [];

    const ui: SkillUI = { name };

    if (users.length) ui.users = users;
    if (courses.length) ui.courses = courses;

    return ui;
}
