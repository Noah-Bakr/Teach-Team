export type RankingUI = {
    id: number;             // ranking_id
    ranking: number;
    createdAt: string;      // ISO datetime
    updatedAt: string;      // ISO datetime
    lecturerName: string;   // “First Last”
    applicationStatus?: string;     // e.g. “pending” / “accepted” / etc.
    applicantName?: string;         // e.g. raw.application.user.first_name + " " + raw.application.user.last_name
    courseCode?: string;
};