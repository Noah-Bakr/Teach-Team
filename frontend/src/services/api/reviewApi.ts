export interface Review {
    review_id: number;
    lecturer_id: number;
    application_id: number;
    rank: number | null;
    comment: string | null;
    reviewed_at: string;  // ISO timestamp
    updated_at: string;   // ISO timestamp

    lecturer: {
        user_id: number;
        username: string;
        email: string;
        password: string;
        created_at: string;
        updated_at: string;
        first_name: string;
        last_name: string;
        avatar: string | null;
        skills: unknown[];               // we don’t need to dig into these for UI
        academicCredentials: unknown[];  // placeholder
        courses: unknown[];              // placeholder
    };

    application: {
        application_id: number;
        position_type: "tutor" | "lab_assistant";
        status: "pending" | "accepted" | "rejected";
        applied_at: string;
        selected: boolean;
        availability: "Full-Time" | "Part-Time" | "Not Available";
        user: {
            user_id: number;
            username: string;
            email: string;
            password: string;
            created_at: string;
            updated_at: string;
            first_name: string;
            last_name: string;
            avatar: string | null;
        };
        course: {
            course_id: number;
            course_name: string;
            course_code: string;
            semester: "1" | "2";
        };
    };
}

export interface CreateReviewDto {
    lecturer_id: number;
    application_id: number;
    rank?: number;
    comment?: string;
}

export interface UpdateReviewDto {
    rank?: number | null;
    comment?: string | null;
}
