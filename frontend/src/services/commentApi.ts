import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

//
// Front-end shape of Comment as returned by the backend
//
export interface Comment {
    comment_id: number;
    comment: string;
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime

    application: {
        application_id: number;
        position_type: 'tutor' | 'lab_assistant';
        status: 'pending' | 'accepted' | 'rejected';
        applied_at: string;
        selected: boolean;
        availability: 'Full-Time' | 'Part-Time' | 'Not Available';
        rank?: number | null;
    };

    lecturer: {
        user_id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

//
// DTO for creating a new comment
//
export interface CreateCommentDto {
    comment: string;
    application_id: number;
    lecturer_id: number;
}

//
// DTO for updating an existing comment
//
export interface UpdateCommentDto {
    comment: string;
}

//
// GET /comments
// Fetch all comments
//
export function fetchAllComments() {
    return axios.get<Comment[]>(`${API_BASE}/comments`);
}

//
// GET /comments/:id
// Fetch a single comment by ID
//
export function fetchCommentById(id: number) {
    return axios.get<Comment>(`${API_BASE}/comments/${id}`);
}

//
// POST /comments
// Create a new comment
//
export function createComment(payload: CreateCommentDto) {
    return axios.post<Comment>(`${API_BASE}/comments`, payload);
}

//
// PUT /comments/:id
// Update an existing comment by ID
//
export function updateComment(id: number, payload: UpdateCommentDto) {
    return axios.put<Comment>(`${API_BASE}/comments/${id}`, payload);
}

//
// DELETE /comments/:id
// Delete a comment by ID
//
export function deleteComment(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/comments/${id}`);
}
