import axios from 'axios';
import {
    Course as BackendCourse,
    CreateCourseDto,
    UpdateCourseDto,
} from './api/courseApi';
import { mapRawCourseToCourseUI } from './mappers/courseMapper';
import { CourseUI } from '../types/courseTypes';

const API_BASE = 'http://localhost:3001/api';

/** GET /courses → CourseUI[] */
export async function fetchAllCourses(): Promise<CourseUI[]> {
    const resp = await axios.get<BackendCourse[]>(`${API_BASE}/courses`);
    return resp.data.map(raw => mapRawCourseToCourseUI(raw));
}

/** GET /courses/:id → CourseUI */
export async function fetchCourseById(id: number): Promise<CourseUI> {
    const resp = await axios.get<BackendCourse>(`${API_BASE}/courses/${id}`);
    return mapRawCourseToCourseUI(resp.data);
}

/** POST /courses */
export async function createCourse(
    payload: CreateCourseDto
): Promise<CourseUI> {
    const resp = await axios.post<BackendCourse>(
        `${API_BASE}/courses`,
        payload
    );
    return mapRawCourseToCourseUI(resp.data);
}

/** PUT /courses/:id */
export async function updateCourse(
    id: number,
    payload: UpdateCourseDto
): Promise<CourseUI> {
    const resp = await axios.put<BackendCourse>(
        `${API_BASE}/courses/${id}`,
        payload
    );
    return mapRawCourseToCourseUI(resp.data);
}

/** DELETE /courses/:id */
export function deleteCourse(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/courses/${id}`);
}
