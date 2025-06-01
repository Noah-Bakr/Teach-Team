import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

/**
 * Interface matching the Application entity returned by the backend.
 */
export interface Application {
    application_id: number;
    position_type: 'tutor' | 'lab_assistant';
    status: 'pending' | 'accepted' | 'rejected';
    applied_at: string;       // ISO datetime string
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    rank?: number | null;

    user: {
        user_id: number;
        username: string;
        email: string;
    };
    course: {
        course_id: number;
        course_name: string;
        course_code: string;
        semester: '1' | '2';
    };
    comments?: Array<{
        comment_id: number;
        comment: string;
        created_at: string;
        updated_at: string;
        lecturer: {
            user_id: number;
            first_name: string;
            last_name: string;
        };
    }>;
}

/**
 * DTO used to create a new Application.
 * Matches CreateApplicationDto on the backend.
 */
export interface CreateApplicationDto {
    position_type: 'tutor' | 'lab_assistant';
    status: 'pending' | 'accepted' | 'rejected';
    applied_at: string;      // "YYYY-MM-DD" or ISO datetime
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';
    rank?: number;

    user_id: number;
    course_id: number;
}

/**
 * DTO used to update an existing Application.
 * Matches UpdateApplicationDto on the backend.
 */
export interface UpdateApplicationDto {
    position_type?: 'tutor' | 'lab_assistant';
    status?: 'pending' | 'accepted' | 'rejected';
    applied_at?: string;
    selected?: boolean;
    availability?: 'Full-Time' | 'Part-Time' | 'Not Available';
    rank?: number | null;
}

/**
 * GET /application
 * Fetch all applications.
 */
export function fetchAllApplications() {
    return axios.get<Application[]>(`${API_BASE}/application`);
}

/**
 * GET /application/:id
 * Fetch one application by ID.
 */
export function fetchApplicationById(id: number) {
    return axios.get<Application>(`${API_BASE}/application/${id}`);
}

/**
 * POST /application
 * Create a new application.
 */
export function createApplication(payload: CreateApplicationDto) {
    return axios.post<Application>(`${API_BASE}/application`, payload);
}

/**
 * PUT /application/:id
 * Update an existing application by ID.
 */
export function updateApplication(
    id: number,
    payload: UpdateApplicationDto
) {
    return axios.put<Application>(`${API_BASE}/application/${id}`, payload);
}

/**
 * DELETE /application/:id
 * Delete an application by ID.
 */
export function deleteApplication(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/application/${id}`);
}
