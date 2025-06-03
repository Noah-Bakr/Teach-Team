/**
 * Front‐end shape of Comment as returned by the backend
 */
export interface Comment {
    comment_id: number;
    comment: string;
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime

    application: {
        application_id: number;
        position_type: "tutor" | "lab_assistant";
        status: "pending" | "accepted" | "rejected";
        applied_at: string;
        selected: boolean;
        availability: "Full-Time" | "Part-Time" | "Not Available";
        rank?: number | null;
    };

    lecturer: {
        user_id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

// DTO for creating a new comment
export interface CreateCommentDto {
    comment: string;
    application_id: number;
    lecturer_id: number;
}

// DTO for updating an existing comment
export interface UpdateCommentDto {
    comment: string;
}
