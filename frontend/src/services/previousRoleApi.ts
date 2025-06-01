import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

//
//   Front-end shape of User (lecturer) as returned by the backend
//
export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

//
//  Front-end shape of PreviousRole as returned by the backend
//
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

//
//    GET /previous-roles
//    Fetch all previous roles
//
export function fetchAllPreviousRoles() {
    return axios.get<PreviousRole[]>(`${API_BASE}/previous-roles`);
}

//
//    GET /previous-roles/:id
//    Fetch a single previous role by ID
//
export function fetchPreviousRoleById(id: number) {
    return axios.get<PreviousRole>(`${API_BASE}/previous-roles/${id}`);
}

//
//    POST /previous-roles
//    Create a new previous role
//
export function createPreviousRole(payload: CreatePreviousRoleDto) {
    return axios.post<PreviousRole>(`${API_BASE}/previous-roles`, payload);
}

//
//    PUT /previous-roles/:id
//    Update an existing previous role by ID
//
export function updatePreviousRole(
    id: number,
    payload: UpdatePreviousRoleDto
) {
    return axios.put<PreviousRole>(`${API_BASE}/previous-roles/${id}`, payload);
}

//
//    DELETE /previous-roles/:id
//    Delete a previous role by ID
//
export function deletePreviousRole(id: number) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/previous-roles/${id}`
    );
}
