import { ApplicationUI, AcademicCredentialsUI, CourseUI, SkillUI, ReviewUI, PreviousRoleUI, UserUI  } from "@/types/types";
import { BackendApplication, BackendReview, BackendSkill, BackendCourse, BackendAcademicCredential, BackendUser  } from "@/services/api/lecturerApi";

export function mapRawSkill(raw: BackendSkill): SkillUI {
    return {
        id: raw.skill_id,
        name: raw.skill_name,
    };
}

export function mapRawAcademicCredential(raw: BackendAcademicCredential): AcademicCredentialsUI {
    return {
        id: raw.academic_id,
        degreeName: raw.degree_name,
        institution: raw.institution,
        startDate: raw.start_date,
        endDate: raw.end_date,
        description: raw.description,
    };
}

export function mapRawUser(raw: BackendUser): UserUI {
    return {
        id: raw.user_id,
        username: raw.username,
        email: raw.email,
        firstName: raw.first_name,
        lastName: raw.last_name,
        avatar: raw.avatar,
        role: raw.role as UserUI["role"],
        createdAt: raw.created_at,
        skills: Array.isArray(raw.skills) ? raw.skills.map(mapRawSkill) : [],
        academicCredentials: Array.isArray(raw.academicCredentials)
            ? raw.academicCredentials.map(mapRawAcademicCredential)
            : [],
        previousRoles: raw.previousRoles?.map(mapRawPreviousRole) || [],
    };
}



export function mapRawCourse(raw: BackendCourse): CourseUI {
    return {
        id: raw.course_id,
        code: raw.course_code,
        name: raw.course_name,
        semester: raw.semester,
        skills: raw.skills?.map((s: BackendSkill) => s.skill_name) || [],
    };
}

// --- Review ---
export function mapRawReview(review: BackendReview): ReviewUI {
    return {
        id: review.review_id,
        rank: review.rank,
        comment: review.comment,
        reviewedAt: review.reviewed_at,
        updatedAt: review.updated_at,
        lecturerId: review.lecturer_id,
        applicationId: review.application_id,
        // Optional: applicationCandidate & applicationCourse
    };
}

function mapRawPreviousRole(role: any): PreviousRoleUI {
    return {
        id: role.previous_role_id,
        role: role.previous_role,
        company: role.company,
        startDate: role.start_date,
        endDate: role.end_date,
        description: role.description,
    };
}

export function mapRawApplication(app: BackendApplication): ApplicationUI {
    return {
        id: app.application_id,
        positionType: app.position_type,
        status: app.status ?? "pending",
        appliedAt: app.applied_at,
        selected: false,
        availability: app.availability ?? "Not Available",
        user: mapRawUser(app.user),
        course: mapRawCourse(app.course),
        reviews: Array.isArray(app.reviews) ? app.reviews.map(mapRawReview) : [],
        skills: Array.isArray(app.skills) ? app.skills.map(mapRawSkill) : [],
    };
}