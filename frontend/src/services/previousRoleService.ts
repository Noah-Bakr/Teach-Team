import axios from 'axios';
import {
    PreviousRole as BackendPrevRole,
    CreatePreviousRoleDto,
    UpdatePreviousRoleDto,
} from './api/previousRoleApi';
import { mapRawPreviousRoleToUI } from './mappers/previousRoleMapper';
import { PreviousRoleUI } from '../types/previousRoleTypes';

const API_BASE = 'http://localhost:3001/api';

/**
 * GET /previous-roles → PreviousRoleUI[]
 */
export async function fetchAllPreviousRoles(): Promise<PreviousRoleUI[]> {
    const resp = await axios.get<BackendPrevRole[]>(
        `${API_BASE}/previous-roles`
    );
    return resp.data.map(raw => mapRawPreviousRoleToUI(raw));
}

/**
 * GET /previous-roles/:id → PreviousRoleUI
 */
export async function fetchPreviousRoleById(
    id: number
): Promise<PreviousRoleUI> {
    const resp = await axios.get<BackendPrevRole>(
        `${API_BASE}/previous-roles/${id}`
    );
    return mapRawPreviousRoleToUI(resp.data);
}

/**
 * POST /previous-roles
 * Create a new previous role.
 * The server returns the full BackendPrevRole; map it → PreviousRoleUI.
 */
export async function createPreviousRole(
    payload: CreatePreviousRoleDto
): Promise<PreviousRoleUI> {
    const resp = await axios.post<BackendPrevRole>(
        `${API_BASE}/previous-roles`,
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
    const resp = await axios.put<BackendPrevRole>(
        `${API_BASE}/previous-roles/${id}`,
        payload
    );
    return mapRawPreviousRoleToUI(resp.data);
}

/**
 * DELETE /previous-roles/:id
 */
export function deletePreviousRole(id: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/previous-roles/${id}`
    );
}
