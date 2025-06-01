import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

/**
 * Shape of an ApplicationRanking as returned by the backend.
 */
export interface ApplicationRanking {
    rating_id: number;
    lecturer_id: number;
    application_id: number;
    rank: number;
    reviewed_at: string; // ISO datetime

    lecturer: {
        user_id: number;
        first_name: string;
        last_name: string;
    };
    application: {
        application_id: number;
        position_type: 'tutor' | 'lab_assistant';
        status: 'pending' | 'accepted' | 'rejected';
        applied_at: string;
        selected: boolean;
        availability: 'Full-Time' | 'Part-Time' | 'Not Available';
        rank?: number | null;
    };
}

/**
 * DTO for creating a new ApplicationRanking.
 * Must match CreateApplicationRankingDto on the backend.
 */
export interface CreateApplicationRankingDto {
    lecturer_id: number;
    application_id: number;
    rank: number;
}

/**
 * DTO for updating an existing ApplicationRanking.
 * Must match UpdateApplicationRankingDto on the backend.
 */
export interface UpdateApplicationRankingDto {
    rank: number;
}

/**
 * GET /application-rankings
 * Fetch all application rankings.
 */
export function fetchAllApplicationRankings() {
    return axios.get<ApplicationRanking[]>(`${API_BASE}/application-rankings`);
}

/**
 * GET /application-rankings/:lecturer_id/:application_id
 * Fetch a single application ranking by composite key.
 */
export function fetchApplicationRanking(
    lecturerId: number,
    applicationId: number
) {
    return axios.get<ApplicationRanking>(
        `${API_BASE}/application-rankings/${lecturerId}/${applicationId}`
    );
}

/**
 * POST /application-rankings
 * Create a new application ranking.
 */
export function createApplicationRanking(
    payload: CreateApplicationRankingDto
) {
    return axios.post<ApplicationRanking>(
        `${API_BASE}/application-rankings`,
        payload
    );
}

/**
 * PUT /application-rankings/:lecturer_id/:application_id
 * Update an existing application ranking by composite key.
 */
export function updateApplicationRanking(
    lecturerId: number,
    applicationId: number,
    payload: UpdateApplicationRankingDto
) {
    return axios.put<ApplicationRanking>(
        `${API_BASE}/application-rankings/${lecturerId}/${applicationId}`,
        payload
    );
}

/**
 * DELETE /application-rankings/:lecturer_id/:application_id
 * Delete an application ranking by composite key.
 */
export function deleteApplicationRanking(
    lecturerId: number,
    applicationId: number
) {
    return axios.delete<{ message: string }>(
        `${API_BASE}/application-rankings/${lecturerId}/${applicationId}`
    );
}
