import axios from 'axios';
import { mapRawCourseToCourseUI } from './mappers/courseMapper';
import { CourseUI } from '../types/courseTypes';

const API_BASE = 'http://localhost:3001/api';

export interface Skill {
    skill_id: number;
    skill_name: string;
}

export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Course {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
    skills: Skill[];
    lecturers: User[];
}

//
// DTO for creating a new Course
//
export interface CreateCourseDto {
    course_code: string;
    course_name: string;
    semester: '1' | '2';
    skillIds?: number[];  // optional array of skill_id
}

//
// DTO for updating an existing Course
//
export interface UpdateCourseDto {
    course_code?: string;
    course_name?: string;
    semester?: '1' | '2';
    skillIds?: number[];  // replaces all existing skills
}

/** GET /courses → CourseUI[] */
export async function fetchAllCourses(): Promise<CourseUI[]> {
    const resp = await axios.get<Course[]>(`${API_BASE}/courses`);
    return resp.data.map(raw => mapRawCourseToCourseUI(raw));
}

/** GET /courses/:id → CourseUI */
export async function fetchCourseById(id: number): Promise<CourseUI> {
    const resp = await axios.get<Course>(`${API_BASE}/courses/${id}`);
    return mapRawCourseToCourseUI(resp.data);
}

/** POST /courses */
export async function createCourse(
    payload: CreateCourseDto
): Promise<CourseUI> {
    const resp = await axios.post<Course>(
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
    const resp = await axios.put<Course>(
        `${API_BASE}/courses/${id}`,
        payload
    );
    return mapRawCourseToCourseUI(resp.data);
}

/** DELETE /courses/:id */
export function deleteCourse(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/courses/${id}`);
}
