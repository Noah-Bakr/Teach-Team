import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

//
// Front-end shape of Skill (matching Skills entity)
//
export interface Skill {
    skill_id: number;
    skill_name: string;
}

//
// Front-end shape of User (matching User entity, for lecturers array)
//
export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

//
// Front-end shape of Course as returned by the backend
//
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

//
// GET /courses
// Fetch all courses
//
export function fetchAllCourses() {
    return axios.get<Course[]>(`${API_BASE}/courses`);
}

//
// GET /courses/:id
// Fetch a single course by ID
//
export function fetchCourseById(id: number) {
    return axios.get<Course>(`${API_BASE}/courses/${id}`);
}

//
// POST /courses
// Create a new course
//
export function createCourse(payload: CreateCourseDto) {
    return axios.post<Course>(`${API_BASE}/courses`, payload);
}

//
// PUT /courses/:id
// Update an existing course by ID
//
export function updateCourse(
    id: number,
    payload: UpdateCourseDto
) {
    return axios.put<Course>(`${API_BASE}/courses/${id}`, payload);
}

//
// DELETE /courses/:id
// Delete a course by ID
//
export function deleteCourse(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/courses/${id}`);
}
