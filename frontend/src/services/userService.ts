import { api } from "./api";
import {
    User as BackendUser,
    CreateUserDto,
    UpdateUserDto,
} from './api/userApi';
import { mapRawUserToUI } from './mappers/userMapper';
import { UserUI } from '../types/userTypes';

/**
 * GET /users → UserUI[]
 */
export async function fetchAllUsers(): Promise<UserUI[]> {
    const resp = await api.get<BackendUser[]>(`/users`);
    return resp.data.map((raw) => mapRawUserToUI(raw));
}

/**
 * GET /users/:id → UserUI
 */
export async function fetchUserById(id: number): Promise<UserUI> {
    const resp = await api.get<BackendUser>(`/users/${id}`);
    return mapRawUserToUI(resp.data);
}

/**
 * POST /users → UserUI
 */
export async function createUser(payload: CreateUserDto): Promise<UserUI> {
    const resp = await api.post<BackendUser>(`/users`, payload);
    return mapRawUserToUI(resp.data);
}

/**
 * PUT /users/:id → UserUI
 */
export async function updateUser(
    id: number,
    payload: UpdateUserDto
): Promise<UserUI> {
    const resp = await api.put<BackendUser>(
        `/users/${id}`,
        payload
    );
    return mapRawUserToUI(resp.data);
}

/**
 * DELETE /users/:id
 */
export function deleteUser(id: number) {
    return api.delete<{ message: string }>(`/users/${id}`);
}

/**
 * POST /users/:id/skills
 */
export async function addSkillsToUser(
    userId: number,
    skillIds: number[]
): Promise<UserUI> {
    const resp = await api.post<BackendUser>(
        `/users/${userId}/skills`,
        { skillIds }
    );
    return mapRawUserToUI(resp.data);
}

/**
 * DELETE /users/:id/skills/:skillId
 */
export function removeSkillFromUser(userId: number, skillId: number) {
    return api.delete<{ message: string }>(
        `/users/${userId}/skills/${skillId}`
    );
}

/**
 * POST /users/:id/academic-credentials
 */
export async function addCredentialsToUser(
    userId: number,
    credentialIds: number[]
): Promise<UserUI> {
    const resp = await api.post<BackendUser>(
        `/users/${userId}/academic-credentials`,
        { credentialIds }
    );
    return mapRawUserToUI(resp.data);
}

/**
 * DELETE /users/:id/academic-credentials/:credentialId
 */
export function removeCredentialFromUser(userId: number, credentialId: number) {
    return api.delete<{ message: string }>(
        `/users/${userId}/academic-credentials/${credentialId}`
    );
}

/**
 * POST /users/:id/courses
 */
export async function addCoursesToUser(
    userId: number,
    courseIds: number[]
): Promise<UserUI> {
    const resp = await api.post<BackendUser>(
        `/users/${userId}/courses`,
        { courseIds }
    );
    return mapRawUserToUI(resp.data);
}

/**
 * DELETE /users/:id/courses/:courseId
 */
export function removeCourseFromUser(userId: number, courseId: number) {
    return api.delete<{ message: string }>(
        `/users/${userId}/courses/${courseId}`
    );
}
