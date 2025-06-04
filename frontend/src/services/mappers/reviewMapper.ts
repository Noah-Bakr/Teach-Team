import { Review as BackendReview } from '../api/reviewApi';
import { ReviewUI } from '../../types/reviewTypes';

/**
 * Map a raw BackendReview into our frontend ReviewUI.
 */
export function mapRawReviewToUI(raw: BackendReview): ReviewUI {
    return {
        id: raw.review_id,
        rank: raw.rank,
        comment: raw.comment,
        reviewedAt: raw.reviewed_at,
        updatedAt: raw.updated_at,
        lecturerId: raw.lecturer_id,

        // Compose a full lecturer name
        lecturerName: `${raw.lecturer.first_name} ${raw.lecturer.last_name}`,

        // Application details
        applicationId: raw.application.application_id,
        applicationCandidate: `${raw.application.user.first_name} ${raw.application.user.last_name}`,
        applicationCourse: raw.application.course.course_name,
    };
}
