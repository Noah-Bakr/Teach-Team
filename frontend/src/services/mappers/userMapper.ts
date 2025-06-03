import {
    User as BackendUser,
    Skill as BackendSkill,
    Course as BackendCourse,
    PreviousRole as BackendPrevRole,
    AcademicCredential as BackendAcadCred,
    Review as BackendReview,
} from '../api/userApi';
import { UserUI, ReviewUI } from '../../types/userTypes';

/** Helpers to extract string arrays **/

function extractSkillNames(skills: BackendSkill[] | undefined): string[] {
    if (!Array.isArray(skills)) return [];
    return skills.map((s) => s.skill_name);
}

function extractCourseNames(courses: BackendCourse[] | undefined): string[] {
    if (!Array.isArray(courses)) return [];
    return courses.map((c) => c.course_name);
}

function extractPreviousRoleTitles(prevRoles: BackendPrevRole[] | undefined): string[] {
    if (!Array.isArray(prevRoles)) return [];
    return prevRoles.map((r) => r.previous_role);
}

function extractAcademicDegreeNames(acadCreds: BackendAcadCred[] | undefined): string[] {
    if (!Array.isArray(acadCreds)) return [];
    return acadCreds.map((a) => a.degree_name);
}

function mapRawReviews(rawReviews: BackendReview[] | undefined): ReviewUI[] | undefined {
    if (!Array.isArray(rawReviews) || rawReviews.length === 0) return undefined;
    return rawReviews.map((r) => ({
        id: r.review_id,
        rank: r.rank,
        comment: r.comment,
        reviewedAt: r.reviewed_at,
        updatedAt: r.updated_at,
        lecturerId: r.lecturer_id,
        applicationId: r.application_id,
    }));
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

        role: raw.role.role_name,

        skills: extractSkillNames(raw.skills),
        courses: extractCourseNames(raw.courses),
        previousRoles: extractPreviousRoleTitles(raw.previousRoles),
        academicCredentials: extractAcademicDegreeNames(raw.academicCredentials),

        reviews: mapRawReviews(raw.reviews),
    };
}
