export interface ReviewUI {
    id: number;
    rank: number | null;
    comment: string | null;
    reviewedAt: string;
    updatedAt: string;
    lecturerName: string;
    lecturerId: number;
    applicationId: number;
    applicationCandidate: string;
    applicationCourse: string;
}