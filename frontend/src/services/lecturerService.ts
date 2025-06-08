import { api } from "./api";
import { ApplicationUI, CourseUI, ReviewUI } from "@/types/types";


import {
    BackendCourse,
    BackendApplication,
    BackendReview,
} from "@/services/api/lecturerApi";

import {
    mapRawCourse,
    mapRawApplication,
    mapRawReview,
} from "@/services/mappers/lecturerMapper";

//
// Fetch all courses assigned to a lecturer
//
export async function fetchCoursesByLecturer(id: number): Promise<CourseUI[]> {
    const resp = await api.get<BackendCourse[]>(`/lecturer/${id}/courses`);
    return resp.data.map(mapRawCourse);
}

//
// Fetch all applications assigned to a specific course (only if lecturer is assigned to it)
//
export async function fetchApplicationsByCourse(
    lecturerId: number,
    courseId: number,
    search?: string,
    sortBy?: string
): Promise<ApplicationUI[]> {
    const params = new URLSearchParams();
    params.append("courseId", courseId.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sort", sortBy);

    const res = await api.get<BackendApplication[]>(
        `/lecturer/${lecturerId}/applications?${params.toString()}`
    );
    return res.data.map(mapRawApplication);
}


//
// Fetch all applications across all courses assigned to the lecturer
//
export async function fetchApplicationsByLecturer(
    lecturerId: number,
    search?: string,
    sortBy?: string
): Promise<ApplicationUI[]> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (sortBy) params.append("sort", sortBy);

    const res = await api.get<BackendApplication[]>(
        `/lecturer/${lecturerId}/applications/all?${params.toString()}`
    );
    return res.data.map(mapRawApplication);
}

//
// Fetch review details for a specific application (if already reviewed)
//
export async function fetchReviewByApplication(applicationId: number): Promise<ReviewUI | null> {
        const resp = await api.get<BackendReview>(
            `/applications/${applicationId}/review`
        );
        return mapRawReview(resp.data);
}

//
// Save or update a review for an application
//
interface ReviewPayload {
    rank?: number;
    comment?: string;
}

export async function updateApplicationStatusByLecturer(
    lecturerId: number,
    applicationId: number,
    payload: { status: "accepted" | "rejected" }
) {
    const resp = await api.patch(`/lecturer/${lecturerId}/applications/${applicationId}`, payload);
    return resp.data;
}

export async function saveReviewForApplication(
    lecturerId: number,
    applicationId: number,
    payload: ReviewPayload
): Promise<ReviewUI> {
    const resp = await api.post(
        `/lecturer/${lecturerId}/applications/${applicationId}/review`,
        {
            rank: payload.rank,
            comment: payload.comment,
        }
    );

    return mapRawReview(resp.data.review);
}
