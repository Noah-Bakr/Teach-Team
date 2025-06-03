import axios from 'axios';
import { mapRawRoleToUI } from './mappers/roleMapper';
import { RoleUI } from '../types/roleTypes';

const API_BASE = 'http://localhost:3001/api';

//
//    Front-end shape of Role as returned by the backend
//
export interface Role {
    role_id: number;
    role_name: 'admin' | 'lecturer' | 'candidate';
    //
    // users?: Array<{ user_id: number; username: string; email: string }>;
}

//
//   DTO for creating a new Role
//    Must match the backend’s CreateRoleDto
//
export interface CreateRoleDto {
    role_name: 'admin' | 'lecturer' | 'candidate';
}

//
//    DTO for updating an existing Role
//    Must match the backend’s UpdateRoleDto
//
export interface UpdateRoleDto {
    role_name?: 'admin' | 'lecturer' | 'candidate';
}

/**
 * GET /roles → RoleUI[]
 *   Fetch all roles (raw: BackendRole[]), then map to just string[]
 */
export async function fetchAllRoles(): Promise<RoleUI[]> {
    const resp = await axios.get<Role[]>(`${API_BASE}/roles`);
    return resp.data.map(raw => mapRawRoleToUI(raw));
}

/**
 * GET /roles/:id → RoleUI
 *   Fetch one role by ID, return only its name string.
 */
export async function fetchRoleById(id: number): Promise<RoleUI> {
    const resp = await axios.get<Role>(`${API_BASE}/roles/${id}`);
    return mapRawRoleToUI(resp.data);
}

/**
 * POST /roles
 *   Create a new role (backend returns full BackendRole); map to string.
 */
export async function createRole(payload: CreateRoleDto): Promise<RoleUI> {
    const resp = await axios.post<Role>(`${API_BASE}/roles`, payload);
    return mapRawRoleToUI(resp.data);
}

/**
 * PUT /roles/:id
 *   Update an existing role; return just the string name again.
 */
export async function updateRole(
    id: number,
    payload: UpdateRoleDto
): Promise<RoleUI> {
    const resp = await axios.put<Role>(`${API_BASE}/roles/${id}`, payload);
    return mapRawRoleToUI(resp.data);
}

/**
 *   DELETE /roles/:id
 */
export function deleteRole(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/roles/${id}`);
}