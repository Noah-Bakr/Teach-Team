import axios from 'axios';
import {
    Review as RawReview,
    CreateReviewDto,
    UpdateReviewDto,
} from './api/reviewApi';
import { ReviewUI } from '@/types/reviewTypes';
import { mapRawReviewToUI } from './mappers/reviewMapper';

const API_BASE = 'http://localhost:3001/api';

/**
 * GET /reviews
 * Fetch all reviews from the backend, return as ReviewUI[].
 */
export async function fetchAllReviews(): Promise<ReviewUI[]> {
    const resp = await axios.get<RawReview[]>(`${API_BASE}/reviews`);
    return resp.data.map(mapRawReviewToUI);
}

/**
 * GET /reviews/:id
 * Fetch one review by ID, return as ReviewUI.
 */
export async function fetchReviewById(id: number): Promise<ReviewUI> {
    const resp = await axios.get<RawReview>(`${API_BASE}/reviews/${id}`);
    return mapRawReviewToUI(resp.data);
}

/**
 * POST /reviews
 * Create a new review. Expects CreateReviewDto:
 *   { lecturer_id: number, application_id: number, rank?: number, comment?: string }
 * Returns the newly created review as ReviewUI.
 */
export async function createReview(
    payload: CreateReviewDto
): Promise<ReviewUI> {
    console.log('About to POST to:', `${API_BASE}/reviews`);
    console.log('Payload:', payload);

    const resp = await axios.post<RawReview>(`${API_BASE}/reviews`, payload);
    return mapRawReviewToUI(resp.data);
}

/**
 * PUT /reviews/:id
 * Update an existing review. Expects UpdateReviewDto:
 *   { rank?: number | null, comment?: string | null }
 * Returns the updated review as ReviewUI.
 */
export async function updateReview(
    id: number,
    payload: UpdateReviewDto
): Promise<ReviewUI> {
    const resp = await axios.put<RawReview>(`${API_BASE}/reviews/${id}`, payload);
    return mapRawReviewToUI(resp.data);
}

/**
 * DELETE /reviews/:id
 * Delete a review by ID. Returns { message: string }.
 */
export async function deleteReview(id: number): Promise<{ message: string }> {
    const resp = await axios.delete<{ message: string }>(
        `${API_BASE}/reviews/${id}`
    );
    return resp.data;
}