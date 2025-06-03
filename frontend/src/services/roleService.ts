import axios from 'axios';
import { Role as BackendRole, CreateRoleDto, UpdateRoleDto } from './api/roleApi';
import { mapRawRoleToUI } from './mappers/roleMapper';
import { RoleUI } from '../types/roleTypes';

const API_BASE = 'http://localhost:3001/api';

export async function fetchAllRoles(): Promise<RoleUI[]> {
    const resp = await axios.get<BackendRole[]>(`${API_BASE}/roles`);
    return resp.data.map(raw => mapRawRoleToUI(raw));
}

export async function fetchRoleById(id: number): Promise<RoleUI> {
    const resp = await axios.get<BackendRole>(`${API_BASE}/roles/${id}`);
    return mapRawRoleToUI(resp.data);
}

export async function createRole(
    payload: CreateRoleDto
): Promise<RoleUI> {
    const resp = await axios.post<BackendRole>(`${API_BASE}/roles`, payload);
    return mapRawRoleToUI(resp.data);
}

export async function updateRole(
    id: number,
    payload: UpdateRoleDto
): Promise<RoleUI> {
    const resp = await axios.put<BackendRole>(`${API_BASE}/roles/${id}`, payload);
    return mapRawRoleToUI(resp.data);
}

export function deleteRole(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/roles/${id}`);
}
