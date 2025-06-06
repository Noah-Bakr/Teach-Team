import { UserUI } from "@/types/userTypes";
import { User as BackendUser } from "@/services/api/userApi";

export function mapBackendUserToUI(raw: BackendUser): UserUI {
    return {
        id: raw.user_id,
        username: raw.username,
        firstName: raw.first_name,
        lastName: raw.last_name,
        email: raw.email,
        avatar: raw.avatar || null,
        role: raw.role.role_name,
        skills: raw.skills.map((s) => s.skill_name),
        courses:
            raw.courses?.map((c) => ({
                    id: c.course_id,
                    name: c.course_name,
                })),
        previousRoles: raw.previousRoles.map((r) => r.previous_role),
        academicCredentials: raw.academicCredentials.map((a) => a.degree_name),
        reviews:
            raw.reviews?.map((r) => ({
            id: r.review_id,
            rank: r.rank,
            comment: r.comment,
            reviewedAt: r.reviewed_at,
            updatedAt: r.updated_at,
            lecturerId: r.lecturer_id,
            applicationId: r.application_id,
            })) || undefined,
        createdAt: raw.created_at,
        // updatedAt: raw.updated_at,
    };
}