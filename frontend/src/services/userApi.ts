import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

//
// Front‐end shape of Role
//
export interface Role {
    role_id: number;
    role_name: 'admin' | 'lecturer' | 'candidate';
}

//
// Front‐end shape of Skill
//
export interface Skill {
    skill_id: number;
    skill_name: string;
}

//
// Front‐end shape of AcademicCredential
//
export interface AcademicCredential {
    academic_id: number;
    degree_name: string;
    institution: string;
    start_date: string;      // ISO date
    end_date: string | null; // ISO date or null
    description: string | null;
}

//
//  Front‐end shape of Course
//
export interface Course {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
}

//
// Front‐end shape of PreviousRole
//
export interface PreviousRole {
    previous_role_id: number;
    previous_role: string;
    company: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
}

//
//  Front‐end shape of Comment
//
export interface Comment {
    comment_id: number;
    comment: string;
    created_at: string;
    updated_at: string;
    application: { application_id: number };
    lecturer: { user_id: number; first_name: string; last_name: string };
}

//
//  Front‐end shape of User as returned by the backend
//
export interface User {
    user_id: number;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    avatar: string | null;

    role: Role;
    skills: Skill[];
    applications?: Array<{ application_id: number }>;
    academicCredentials: AcademicCredential[];
    courses: Course[];
    previousRoles?: PreviousRole[];
    comments?: Comment[];
}

//
//    DTO for creating a new User
//    Match backend’s CreateUserDto
//
export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    avatar?: string | null;
    role_id: number;
}

//
//    DTO for updating an existing User
//    Match backend’s UpdateUserDto
//
export interface UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string | null;
    role_id?: number;
}

//
//     GET /user
//     Fetch all users
//
export function fetchAllUsers() {
    return axios.get<User[]>(`${API_BASE}/user`);
}

//
//     GET /user/:id
//     Fetch one user by ID
//
export function fetchUserById(id: number) {
    return axios.get<User>(`${API_BASE}/user/${id}`);
}

//
//     POST /user
//     Create a new user
//
export function createUser(payload: CreateUserDto) {
    return axios.post<User>(`${API_BASE}/user`, payload);
}

//
//     PUT /user/:id
//     Update an existing user by ID
//
export function updateUser(id: number, payload: UpdateUserDto) {
    return axios.put<User>(`${API_BASE}/user/${id}`, payload);
}

//
//     DELETE /user/:id
//     Delete a user by ID
//
export function deleteUser(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/user/${id}`);
}

//
//     POST /user/:id/skills
//     Attach one or more skills to a user
//     { skillIds: number[] }
//
export interface AddSkillsPayload {
    skillIds: number[];
}

export function addSkillsToUser(userId: number, skillIds: number[]) {
    return axios.post<User>(`${API_BASE}/user/${userId}/skills`, {
        skillIds,
    } as AddSkillsPayload);
}

//
//     DELETE /user/:id/skills/:skillId
//     Detach a single skill from a user
//
export function removeSkillFromUser(userId: number, skillId: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/user/${userId}/skills/${skillId}`
    );
}

//
//     POST /user/:id/academic-credentials
//     Attach one or more academic credentials to a user
//     { credentialIds: number[] }
//
export interface AddCredentialsPayload {
    credentialIds: number[];
}

export function addCredentialsToUser(
    userId: number,
    credentialIds: number[]
) {
    return axios.post<User>(
        `${API_BASE}/user/${userId}/academic-credentials`,
        { credentialIds } as AddCredentialsPayload
    );
}

//
//     DELETE /user/:id/academic-credentials/:credentialId
//     Detach a single academic credential from a user
//
export function removeCredentialFromUser(
    userId: number,
    credentialId: number
) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/user/${userId}/academic-credentials/${credentialId}`
    );
}

//
//     POST /user/:id/courses
//     Attach one or more courses to a user (lecturer)
//     { courseIds: number[] }
//
export interface AddCoursesPayload {
    courseIds: number[];
}

export function addCoursesToUser(userId: number, courseIds: number[]) {
    return axios.post<User>(
        `${API_BASE}/user/${userId}/courses`,
        { courseIds } as AddCoursesPayload
    );
}

//
//     DELETE /user/:id/courses/:courseId
//     Detach a single course from a user (lecturer)
//
export function removeCourseFromUser(userId: number, courseId: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/user/${userId}/courses/${courseId}`
    );
}
