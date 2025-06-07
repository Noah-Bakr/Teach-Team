import {
    ApplicationUI,
    UserUI,
    SkillUI,
    AcademicCredentialsUI,
    CourseUI,
    ReviewUI,
    PreviousRoleUI,
} from "@/types/lecturerTypes";


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

// --- Skills ---
export function mapRawSkill(skill: any): SkillUI {
    return {
        id: skill.skill_id,
        name: skill.skill_name,
    };
}

// --- Academic Credentials ---
export function mapRawAcademic(cred: any): AcademicCredentialsUI {
    return {
        id: cred.academic_id,
        degreeName: cred.degree_name,
        institution: cred.institution,
        startDate: cred.start_date,
        endDate: cred.end_date,
        description: cred.description ?? "",
    };
}

// --- User (Applicant) ---
export function mapRawUser(user: any): UserUI {
    return {
        id: user.user_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar,
        skills: Array.isArray(user.skills) ? user.skills.map(mapRawSkill) : [],
        academicCredentials: Array.isArray(user.academicCredentials)
            ? user.academicCredentials.map(mapRawAcademic)
            : [],
        previousRoles: user.previousRoles?.map(mapRawPreviousRole) || [],
    };
}

// --- Course ---
export function mapRawCourse(course: any): CourseUI {
    return {
        id: course.course_id,
        name: course.course_name,
        code: course.course_code,
        semester: course.semester,
        skills: course.skills?.map((s: any) => s.skill_name) || [],
    };
}

// --- Review ---
export function mapRawReview(review: any): ReviewUI {
    return {
        id: review.review_id,
        lecturerId: review.lecturer_id,
        applicationId: review.application_id,
        rank: review.rank,
        comment: review.comment,
        reviewedAt: review.reviewed_at,
        updatedAt: review.updated_at,
    };
}

// --- Application ---
export function mapRawApplication(app: any): ApplicationUI {
    return {
        id: app.application_id,
        positionType: app.position_type,
        status: app.status ?? "pending",
        appliedAt: app.applied_at,
        selected: app.selected,
        availability: app.availability,
        user: mapRawUser(app.user),
        course: mapRawCourse(app.course),
        reviews: Array.isArray(app.reviews) ? app.reviews.map(mapRawReview) : [],
    };
}
