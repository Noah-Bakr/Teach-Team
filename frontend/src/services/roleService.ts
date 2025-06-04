import { api } from "./api";
import { Role as BackendRole, CreateRoleDto, UpdateRoleDto } from './api/roleApi';
import { mapRawRoleToUI } from './mappers/roleMapper';
import { RoleUI } from '../types/roleTypes';

//const API_BASE = 'http://localhost:3001/api';

export async function fetchAllRoles(): Promise<RoleUI[]> {
    const resp = await api.get<BackendRole[]>(`/roles`);
    return resp.data.map(raw => mapRawRoleToUI(raw));
}

export async function fetchRoleById(id: number): Promise<RoleUI> {
    const resp = await api.get<BackendRole>(`/roles/${id}`);
    return mapRawRoleToUI(resp.data);
}

export async function createRole(
    payload: CreateRoleDto
): Promise<RoleUI> {
    const resp = await api.post<BackendRole>(`/roles`, payload);
    return mapRawRoleToUI(resp.data);
}

export async function updateRole(
    id: number,
    payload: UpdateRoleDto
): Promise<RoleUI> {
    const resp = await api.put<BackendRole>(`/roles/${id}`, payload);
    return mapRawRoleToUI(resp.data);
}

export function deleteRole(id: number) {
    return api.delete<{ message: string }>(`/roles/${id}`);
}
