import { api } from "./api";
import {
    Course as BackendCourse,
    CreateCourseDto,
    UpdateCourseDto,
} from './api/courseApi';
import { mapRawCourseToCourseUI } from './mappers/courseMapper';
import { CourseUI } from '../types/courseTypes';

/** GET /courses → CourseUI[] */
export async function fetchAllCourses(): Promise<CourseUI[]> {
    const resp = await api.get<BackendCourse[]>(`/courses`);
    return resp.data.map(raw => mapRawCourseToCourseUI(raw));
}

/** GET /courses/:id → CourseUI */
export async function fetchCourseById(id: number): Promise<CourseUI> {
    const resp = await api.get<BackendCourse>(`/courses/${id}`);
    return mapRawCourseToCourseUI(resp.data);
}

/** POST /courses */
export async function createCourse(
    payload: CreateCourseDto
): Promise<CourseUI> {
    const resp = await api.post<BackendCourse>(
        `/courses`,
        payload
    );
    return mapRawCourseToCourseUI(resp.data);
}

/** PUT /courses/:id */
export async function updateCourse(
    id: number,
    payload: UpdateCourseDto
): Promise<CourseUI> {
    const resp = await api.put<BackendCourse>(
        `/courses/${id}`,
        payload
    );
    return mapRawCourseToCourseUI(resp.data);
}

/** DELETE /courses/:id */
export function deleteCourse(id: number) {
    return api.delete<{ message: string }>(`/courses/${id}`);
}
