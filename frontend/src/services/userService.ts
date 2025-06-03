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
 * GET /user → UserUI[]
 */
export async function fetchAllUsers(): Promise<UserUI[]> {
    const resp = await axios.get<BackendUser[]>(`${API_BASE}/users`);
    return resp.data.map(raw => mapRawUserToUI(raw));
}

/**
 * GET /user/:id → UserUI
 */
export async function fetchUserById(id: number): Promise<UserUI> {
    const resp = await axios.get<BackendUser>(`${API_BASE}/users/${id}`);
    return mapRawUserToUI(resp.data);
}

/**
 * POST /user → UserUI
 */
export async function createUser(payload: CreateUserDto): Promise<UserUI> {
    const resp = await axios.post<BackendUser>(`${API_BASE}/users`, payload);
    return mapRawUserToUI(resp.data);
}

/**
 * PUT /user/:id → UserUI
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
 * DELETE /user/:id
 */
export function deleteUser(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/users/${id}`);
}

/**
 * POST /user/:id/skills
 * Attaches skills; backend returns full BackendUser, so map it
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
 * DELETE /user/:id/skills/:skillId
 * Detach skill returns { message }; no mapping needed
 */
export function removeSkillFromUser(userId: number, skillId: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/users/${userId}/skills/${skillId}`
    );
}

/**
 * POST /user/:id/academic-credentials
 * Attaches academic credentials; backend returns full BackendUser, so map it
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
 * DELETE /user/:id/academic-credentials/:credentialId
 * Detach returns { message }
 */
export function removeCredentialFromUser(
    userId: number,
    credentialId: number
) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/users/${userId}/academic-credentials/${credentialId}`
    );
}

/**
 * POST /user/:id/courses
 * Attaches courses; backend returns full BackendUser, so map it
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
 * DELETE /user/:id/courses/:courseId
 */
export function removeCourseFromUser(userId: number, courseId: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/users/${userId}/courses/${courseId}`
    );
}
