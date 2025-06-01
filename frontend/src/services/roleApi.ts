import axios from 'axios';

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
// 2) DTO for creating a new Role
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

//
//    GET /roles
//    Fetch all roles
//
export function fetchAllRoles() {
    return axios.get<Role[]>(`${API_BASE}/roles`);
}

//
//    GET /roles/:id
//    Fetch a single role by ID
//
export function fetchRoleById(id: number) {
    return axios.get<Role>(`${API_BASE}/roles/${id}`);
}

//
//    POST /roles
//    Create a new role
//
export function createRole(payload: CreateRoleDto) {
    return axios.post<Role>(`${API_BASE}/roles`, payload);
}

//
//    PUT /roles/:id
//    Update an existing role by ID
//
export function updateRole(
    id: number,
    payload: UpdateRoleDto
) {
    return axios.put<Role>(`${API_BASE}/roles/${id}`, payload);
}

//
//    DELETE /roles/:id
//    Delete a role by ID
//
export function deleteRole(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/roles/${id}`);
}
