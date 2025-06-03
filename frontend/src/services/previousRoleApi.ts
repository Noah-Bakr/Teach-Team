import axios from 'axios';
import { mapRawPreviousRoleToUI } from './mappers/previousRoleMapper';
import { PreviousRoleUI } from '../types/previousRoleTypes';

const API_BASE = 'http://localhost:3001/api';

export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface PreviousRole {
    previous_role_id: number;
    previous_role: string;
    company: string;
    start_date: string;        // ISO date string
    end_date: string | null;   // ISO date string or null
    description: string | null;

    user: User;
}

//
//    DTO for creating a new PreviousRole
//    Must match the POST /previous-roles request body on the backend
//
export interface CreatePreviousRoleDto {
    previous_role: string;
    company: string;
    start_date: string;        // "YYYY-MM-DD"
    end_date?: string | null;  // optional, "YYYY-MM-DD" or null
    description?: string | null;
    user_id: number;
}

//
//    DTO for updating an existing PreviousRole
//    Must match the PUT /previous-roles/:id request body on the backend
//
export interface UpdatePreviousRoleDto {
    previous_role?: string;
    company?: string;
    start_date?: string;       // "YYYY-MM-DD"
    end_date?: string | null;  // "YYYY-MM-DD" or null
    description?: string | null;
}

/**
 * GET /previous-roles → PreviousRoleUI[]
 */
export async function fetchAllPreviousRoles(): Promise<PreviousRoleUI[]> {
    const resp = await axios.get<PreviousRole[]>(
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
    const resp = await axios.get<PreviousRole>(
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
    const resp = await axios.post<PreviousRole>(
        `${API_BASE}/previous-roles`,
        payload
    );
    return mapRawPreviousRoleToUI(resp.data);
}

/**
 * PUT /previous-roles/:id
 * Update an existing previous role.
 */
export async function updatePreviousRole(
    id: number,
    payload: UpdatePreviousRoleDto
): Promise<PreviousRoleUI> {
    const resp = await axios.put<PreviousRole>(
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