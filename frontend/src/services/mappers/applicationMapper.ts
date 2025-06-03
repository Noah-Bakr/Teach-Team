import {
    Application as BackendApp,
    Skill as BackendSkill,
    AcademicCredential as BackendAcadCred,
    Review as BackendReview,
    UserNested as BackendUser,
    CourseNested as BackendCourse,
} from "../api/applicationApi";
import {
    ApplicationUI,
    UserUI,
    CourseUI,
    ReviewUI,
} from "../../types/applicationTypes";

/** Helper: extract skill names from BackendSkill[] */
function extractSkillNames(skills: BackendSkill[] | undefined): string[] {
    if (!Array.isArray(skills)) return [];
    return skills.map((s) => s.skill_name);
}

/** Helper: extract degree names from BackendAcadCred[] */
function extractAcademicNames(
    creds: BackendAcadCred[] | undefined
): string[] {
    if (!Array.isArray(creds)) return [];
    return creds.map((c) => c.degree_name);
}

/** Map raw reviews → UI */
function mapRawReviews(rawReviews: BackendReview[] | undefined): ReviewUI[] | undefined {
    if (!Array.isArray(rawReviews) || rawReviews.length === 0) return undefined;
    return rawReviews.map((r) => ({
        id: r.review_id,
        rank: r.rank,
        comment: r.comment,
        reviewedAt: r.reviewed_at,
        updatedAt: r.updated_at,
        lecturerId: r.lecturer_id,
    }));
}

/** Map raw user → UI */
function mapRawUserToUI(raw: BackendUser): UserUI {
    return {
        id: raw.user_id,
        username: raw.username,
        firstName: raw.first_name,
        lastName: raw.last_name,
        skills: extractSkillNames(raw.skills),
        academicCredentials: extractAcademicNames(raw.academicCredentials),
    };
}

/** Map raw course → UI */
function mapRawCourseToUI(raw: BackendCourse): CourseUI {
    return {
        id: raw.course_id,
        name: raw.course_name,
        code: raw.course_code,
        semester: raw.semester,
        skills: extractSkillNames(raw.skills),
    };
}

/** Main mapper: raw BackendApp → ApplicationUI */
export function mapRawAppToUI(raw: BackendApp): ApplicationUI {
    const userUI = mapRawUserToUI(raw.user);
    const courseUI = mapRawCourseToUI(raw.course);
    const reviewsUI = mapRawReviews(raw.reviews);

    const result: ApplicationUI = {
        id: raw.application_id,
        positionType: raw.position_type,
        status: raw.status,
        appliedAt: raw.applied_at,
        selected: raw.selected,
        availability: raw.availability,
        user: userUI,
        course: courseUI,
        ...(reviewsUI ? { reviews: reviewsUI } : {}),
    };

    return result;
}
