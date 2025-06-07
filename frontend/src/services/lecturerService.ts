import { CourseUI } from "@/types/courseTypes";
import { ApplicationUI, ReviewUI } from "@/types/lecturerTypes";
import { api } from "./api"; // your Axios wrapper

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
    courseId: number
): Promise<ApplicationUI[]> {
    const resp = await api.get<BackendApplication[]>(
        `/lecturer/${lecturerId}/applications?courseId=${courseId}`
    );
    return resp.data.map(mapRawApplication);
}

//
// Fetch all applications across all courses assigned to the lecturer
//
export async function fetchApplicationsByLecturer(
    lecturerId: number
): Promise<ApplicationUI[]> {
    const res = await api.get<BackendApplication[]>(
        `/lecturer/${lecturerId}/applications/all`
    );
    return res.data.map(mapRawApplication);
}

//
// Optionally, a duplicate with different naming — not strictly needed
//
export async function fetchApplicationsByLecturerAndCourse(
    lecturerId: number,
    courseId: number
): Promise<ApplicationUI[]> {
    return fetchApplicationsByCourse(lecturerId, courseId); // optional alias
}

//
// Fetch review details for a specific application (if already reviewed)
//
export async function fetchReviewByApplication(
    applicationId: number
): Promise<ReviewUI | null> {
    try {
        const resp = await api.get<BackendReview>(
            `/applications/${applicationId}/review`
        );
        return mapRawReview(resp.data);
    } catch (err: any) {
        if (err.response?.status === 404) return null;
        throw err;
    }
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
    applicationId: number,
    payload: ReviewPayload
): Promise<ReviewUI> {
    const resp = await api.post<{ review: BackendReview }>(
        `lecturer/applications/${applicationId}/review`,
        payload
    );
    return mapRawReview(resp.data.review);
}
