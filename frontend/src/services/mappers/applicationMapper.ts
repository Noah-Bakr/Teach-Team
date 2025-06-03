import {
    Application as BackendApp,
    User        as BackendUser,
    Skill       as BackendSkill,
    AcademicCredential as BackendAcadCred,
    Course      as BackendCourse,
    Comment     as BackendComment,
    Ranking     as BackendRanking,
} from "../api/applicationApi";

import {
    ApplicationUI,
    CommentUI,
    RankingUI,
    CourseUI,
} from "../../types/applicationTypes";

/** Helpers to extract arrays safely **/

function extractSkillNames(skills: BackendSkill[] | undefined): string[] {
    if (!Array.isArray(skills)) return [];
    return skills.map((s) => s.skill_name);
}

function extractAcademicNames(
    creds: BackendAcadCred[] | undefined
): string[] {
    if (!Array.isArray(creds)) return [];
    return creds.map((c) => c.degree_name);
}

/** Map raw comments → UI, guarding against missing `c.lecturer` */
function mapRawComments(
    rawComments: BackendComment[] | undefined
): CommentUI[] | undefined {
    if (!Array.isArray(rawComments) || rawComments.length === 0) return undefined;

    return rawComments.map((c) => {
        // Safety check: if `lecturer` is undefined or null, fallback to empty strings
        const first = c.lecturer?.first_name  ?? "";
        const last  = c.lecturer?.last_name   ?? "";
        const lecturerFullName = first || last
            ? `${first} ${last}`.trim()
            : "(unknown lecturer)";

        return {
            id:           c.comment_id,
            text:         c.comment,
            createdAt:    c.created_at,
            updatedAt:    c.updated_at,
            lecturerName: lecturerFullName,
        };
    });
}

/** Map raw rankings → UI, guarding against missing `r.lecturer` */
function mapRawRankings(
    rawRankings: BackendRanking[] | undefined
): RankingUI[] | undefined {
    if (!Array.isArray(rawRankings) || rawRankings.length === 0) return undefined;

    return rawRankings.map((r) => {
        const first = r.lecturer?.first_name  ?? "";
        const last  = r.lecturer?.last_name   ?? "";
        const lecturerFullName = first || last
            ? `${first} ${last}`.trim()
            : "(unknown lecturer)";

        return {
            id:           r.ranking_id,
            ranking:      r.ranking,
            createdAt:    r.created_at,
            updatedAt:    r.updated_at,
            lecturerName: lecturerFullName,
        };
    });
}

/** Map a raw BackendUser (with snake_case) → UI type (camelCase) **/
function mapRawUserToUI(raw: BackendUser) {
    return {
        id:                 raw.user_id,
        username:           raw.username,
        firstName:          raw.first_name,
        lastName:           raw.last_name,
        skills:             extractSkillNames(raw.skills),
        academicCredentials: extractAcademicNames(raw.academicCredentials),
    };
}

/** Map a raw BackendCourse → CourseUI **/
function mapRawCourseToUI(raw: BackendCourse): CourseUI {
    return {
        id:       raw.course_id,
        code:     raw.course_code,
        name:     raw.course_name,
        semester: raw.semester,
        skills:   extractSkillNames(raw.skills),
    };
}

/** Main mapper: raw BackendApp → ApplicationUI **/
export function mapRawAppToUI(raw: BackendApp): ApplicationUI {
    // “raw.user” should exist. If it were ever undefined you could also do:
    // const safeUser = raw.user ?? { user_id: 0, first_name: "", last_name: "", … };
    const userUI     = mapRawUserToUI(raw.user);
    const courseUI   = mapRawCourseToUI(raw.course);
    const commentsUI = mapRawComments(raw.comments);
    const rankingsUI = mapRawRankings(raw.rankings);

    const result: ApplicationUI = {
        id:           raw.application_id,
        positionType: raw.position_type,
        status:       raw.status,
        appliedAt:    raw.applied_at,
        selected:     raw.selected,
        availability: raw.availability,

        user:   userUI,
        course: courseUI,

        // Only spread in “comments” if it isn’t undefined
        ...(commentsUI ?   { comments: commentsUI } : {}),

        // Only spread in “rank” if there are some rankings
        ...(rankingsUI ?   { rank: rankingsUI } : {}),
    };

    return result;
}
