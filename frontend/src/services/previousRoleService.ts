import { api } from "./api";
import {
    PreviousRole as BackendPrevRole,
    CreatePreviousRoleDto,
    UpdatePreviousRoleDto,
} from './api/previousRoleApi';
import { mapRawPreviousRoleToUI } from './mappers/previousRoleMapper';
import { PreviousRoleUI } from '../types/previousRoleTypes';

/**
 * GET /previous-roles → PreviousRoleUI[]
 */
export async function fetchAllPreviousRoles(): Promise<PreviousRoleUI[]> {
    const resp = await api.get<BackendPrevRole[]>(
        `/previous-roles`
    );
    return resp.data.map(raw => mapRawPreviousRoleToUI(raw));
}

/**
 * GET /previous-roles/:id → PreviousRoleUI
 */
export async function fetchPreviousRoleById(
    id: number
): Promise<PreviousRoleUI> {
    const resp = await api.get<BackendPrevRole>(
        `/previous-roles/${id}`
    );
    return mapRawPreviousRoleToUI(resp.data);
}

/**
 * GET /previous-roles/user/:userId → PreviousRoleUI[]
 * Fetch all previous roles for a specific user.
 */
export async function fetchPreviousRolesByUserId(
    userId: number
): Promise<PreviousRoleUI[]> {
    const resp = await api.get<BackendPrevRole[]>(
        `/previous-roles/user/${userId}`
    );
    return resp.data.map(raw => mapRawPreviousRoleToUI(raw));
}

/**
 * POST /previous-roles
 * Create a new previous role.
 * The server returns the full BackendPrevRole; map it → PreviousRoleUI.
 */
export async function createPreviousRole(
    payload: CreatePreviousRoleDto
): Promise<PreviousRoleUI> {
    const resp = await api.post<BackendPrevRole>(
        `/previous-roles`,
        payload
    );
    return mapRawPreviousRoleToUI(resp.data);
}

/**
 * PUT /previous-roles/:id
 * Update an existing previous role.
 * Server returns the updated BackendPrevRole; map it → PreviousRoleUI.
 */
export async function updatePreviousRole(
    id: number,
    payload: UpdatePreviousRoleDto
): Promise<PreviousRoleUI> {
    const resp = await api.put<BackendPrevRole>(
        `/previous-roles/${id}`,
        payload
    );
    return mapRawPreviousRoleToUI(resp.data);
}

/**
 * DELETE /previous-roles/:id
 */
export function deletePreviousRole(id: number) {
    return api.delete<{ message: string }>(
        `/previous-roles/${id}`
    );
}
