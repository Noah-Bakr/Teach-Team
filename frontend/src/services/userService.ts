import axios from 'axios';
import {
    User as BackendUser,
    CreateUserDto,
    UpdateUserDto,
} from './api/userApi';
import { mapRawUserToUI } from './mappers/userMapper';
import { UserUI } from '../types/userTypes';

const API_BASE = 'http://localhost:3001/api';

/**
 * GET /users → UserUI[]
 */
export async function fetchAllUsers(): Promise<UserUI[]> {
    const resp = await axios.get<BackendUser[]>(`${API_BASE}/users`);
    return resp.data.map((raw) => mapRawUserToUI(raw));
}

/**
 * GET /users/:id → UserUI
 */
export async function fetchUserById(id: number): Promise<UserUI> {
    const resp = await axios.get<BackendUser>(`${API_BASE}/users/${id}`);
    return mapRawUserToUI(resp.data);
}

/**
 * POST /users → UserUI
 */
export async function createUser(payload: CreateUserDto): Promise<UserUI> {
    const resp = await axios.post<BackendUser>(`${API_BASE}/users`, payload);
    return mapRawUserToUI(resp.data);
}

/**
 * PUT /users/:id → UserUI
 */
export async function updateUser(
    id: number,
    payload: UpdateUserDto
): Promise<UserUI> {
    const resp = await axios.put<BackendUser>(
        `${API_BASE}/users/${id}`,
        payload
    );
    return mapRawUserToUI(resp.data);
}

/**
 * DELETE /users/:id
 */
export function deleteUser(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/users/${id}`);
}

/**
 * POST /users/:id/skills
 */
export async function addSkillsToUser(
    userId: number,
    skillIds: number[]
): Promise<UserUI> {
    const resp = await axios.post<BackendUser>(
        `${API_BASE}/users/${userId}/skills`,
        { skillIds }
    );
    return mapRawUserToUI(resp.data);
}

/**
 * DELETE /users/:id/skills/:skillId
 */
export function removeSkillFromUser(userId: number, skillId: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/users/${userId}/skills/${skillId}`
    );
}

/**
 * POST /users/:id/academic-credentials
 */
export async function addCredentialsToUser(
    userId: number,
    credentialIds: number[]
): Promise<UserUI> {
    const resp = await axios.post<BackendUser>(
        `${API_BASE}/users/${userId}/academic-credentials`,
        { credentialIds }
    );
    return mapRawUserToUI(resp.data);
}

/**
 * DELETE /users/:id/academic-credentials/:credentialId
 */
export function removeCredentialFromUser(userId: number, credentialId: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/users/${userId}/academic-credentials/${credentialId}`
    );
}

/**
 * POST /users/:id/courses
 */
export async function addCoursesToUser(
    userId: number,
    courseIds: number[]
): Promise<UserUI> {
    const resp = await axios.post<BackendUser>(
        `${API_BASE}/users/${userId}/courses`,
        { courseIds }
    );
    return mapRawUserToUI(resp.data);
}

/**
 * DELETE /users/:id/courses/:courseId
 */
export function removeCourseFromUser(userId: number, courseId: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/users/${userId}/courses/${courseId}`
    );
}
