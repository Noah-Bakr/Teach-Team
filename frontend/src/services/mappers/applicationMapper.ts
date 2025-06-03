import {
    Application as BackendApp,
    User as BackendUser,
    Skill as BackendSkill,
    AcademicCredential as BackendAcadCred,
    PreviousRole as BackendPrevRole,
    Course as BackendCourse,
    Comment as BackendComment,
    Ranking as BackendRanking,
} from '../api/applicationApi';

import {
    ApplicationUI,
    CommentUI,
    RankingUI,
    CourseUI,
} from '../../types/applicationTypes';

/** Helpers **/

function extractSkillNames(skills: BackendSkill[] | undefined): string[] {
    if (!Array.isArray(skills)) return [];
    return skills.map(s => s.skill_name);
}

function extractAcademicNames(
    creds: BackendAcadCred[] | undefined
): string[] {
    if (!Array.isArray(creds)) return [];
    return creds.map(c => c.degree_name);
}

function mapRawComments(
    rawComments: BackendComment[] | undefined
): CommentUI[] | undefined {
    if (!Array.isArray(rawComments) || rawComments.length === 0) return undefined;
    return rawComments.map(c => ({
        id: c.comment_id,
        text: c.comment,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        lecturerName: `${c.lecturer.first_name} ${c.lecturer.last_name}`,
    }));
}

function mapRawRankings(
    rawRankings: BackendRanking[] | undefined
): RankingUI[] | undefined {
    if (!Array.isArray(rawRankings) || rawRankings.length === 0) return undefined;
    return rawRankings.map(r => ({
        id: r.ranking_id,
        ranking: r.ranking,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        lecturerName: `${r.lecturer.first_name} ${r.lecturer.last_name}`,
    }));
}

function mapRawUserToUI(raw: BackendUser) {
    return {
        id: raw.user_id,
        username: raw.username,
        firstName: raw.first_name,
        lastName: raw.last_name,
        skills: extractSkillNames(raw.skills),
        academicCredentials: extractAcademicNames(raw.academicCredentials),
    };
}

function mapRawCourseToUI(raw: BackendCourse): CourseUI {
    return {
        id: raw.course_id,
        code: raw.course_code,
        name: raw.course_name,
        semester: raw.semester,
        skills: extractSkillNames(raw.skills),
    };
}

/**
 * Main mapper: raw BackendApp → ApplicationUI
 */
export function mapRawAppToUI(raw: BackendApp): ApplicationUI {
    const userUI = mapRawUserToUI(raw.user);
    const courseUI = mapRawCourseToUI(raw.course);
    const commentsUI = mapRawComments(raw.comments);
    const rankingsUI = mapRawRankings(raw.rankings);

    const result: ApplicationUI = {
        id: raw.application_id,
        positionType: raw.position_type,
        status: raw.status,
        appliedAt: raw.applied_at,
        selected: raw.selected,
        availability: raw.availability,

        user: userUI,
        course: courseUI,
        ...(commentsUI ? { comments: commentsUI } : {}),
        ...(rankingsUI ? { rank: rankingsUI } : {}),
    };

    return result;
}
