import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export interface AcademicCredential {
    academic_id: number;
    degree_name: string;
    institution: string;
    start_date: string;      // ISO date string
    end_date: string | null; // ISO date string or null
    description: string | null;
    users?: Array<{
        user_id: number;
        username: string;
    }>;
}

/**
 * GET /academic-credentials
 * Fetch all academic credentials.
 */
export function fetchAllAcademicCredentials() {
    return axios.get<AcademicCredential[]>(`${API_BASE}/academic-credentials`);
}

/**
 * GET /academic-credentials/:id
 * Fetch one academic credential by ID.
 */
export function fetchAcademicCredentialById(id: number) {
    return axios.get<AcademicCredential>(`${API_BASE}/academic-credentials/${id}`);
}

export interface CreateAcademicCredentialDto {
    degree_name: string;
    institution: string;
    start_date: string;       // "YYYY-MM-DD"
    end_date?: string | null; // optional, "YYYY-MM-DD" or null
    description?: string | null;
}

/**
 * POST /academic-credentials
 * Create a new academic credential.
 */
export function createAcademicCredential(payload: CreateAcademicCredentialDto) {
    return axios.post<AcademicCredential>(`${API_BASE}/academic-credentials`, payload);
}

export interface UpdateAcademicCredentialDto {
    degree_name?: string;
    institution?: string;
    start_date?: string;       // "YYYY-MM-DD"
    end_date?: string | null;  // optional
    description?: string | null;
}

/**
 * PUT /academic-credentials/:id
 * Update an existing academic credential by ID.
 */
export function updateAcademicCredential(
    id: number,
    payload: UpdateAcademicCredentialDto
) {
    return axios.put<AcademicCredential>(`${API_BASE}/academic-credentials/${id}`, payload);
}

/**
 * DELETE /academic-credentials/:id
 * Delete an academic credential by ID.
 */
export function deleteAcademicCredential(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/academic-credentials/${id}`);
}
