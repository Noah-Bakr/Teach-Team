export interface ApplicationRanking {
    ranking_id: number;
    lecturer_id: number;
    application_id: number;
    rank: number;
    reviewed_at: string;
    updated_at: string;

    /** The nested lecturer object may or may not be included. */
    lecturer?: {
        user_id: number;
        username: string;
        email: string;
        password: string;
        created_at: string;
        updated_at: string;
        first_name: string;
        last_name: string;
        avatar: string;
        skills: any[];
        academicCredentials: {
            academic_id: number;
            degree_name: string;
            institution: string;
            start_date: string;
            end_date: string;
            description: string | null;
        }[];
        courses: any[];
    };

    /** The nested application object also be present (but we don’t need it for RankingUI). */
    application?: {
        application_id: number;
        position_type: "tutor" | "lab_assistant";
        status: "pending" | "accepted" | "rejected";
        applied_at: string;
        selected: boolean;
        availability: "Full-Time" | "Part-Time" | "Not Available";
        rank: number | null;
        user: {
            user_id: number;
            username: string;
            email: string;
            password: string;
            created_at: string;
            updated_at: string;
            first_name: string;
            last_name: string;
            avatar: string;
        };
        course: {
            course_id: number;
            course_name: string;
            course_code: string;
            semester: string;
        };
        comments: any[];
        rankings: {
            ranking_id: number;
            lecturer_id: number;
            application_id: number;
            rank: number;
            reviewed_at: string;
            updated_at: string;
        }[];
    };
}

export interface CreateRankingDto {
    application_id: number;
    lecturer_id: number;
    rank: number;
}

export interface UpdateRankingDto {
    rank: number;
}
