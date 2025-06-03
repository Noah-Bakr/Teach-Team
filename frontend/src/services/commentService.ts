import axios from "axios";
import { Comment as RawComment, CreateCommentDto, UpdateCommentDto } from "./api/commentApi";
import { CommentUI } from "@/types/commentTypes";

const API_BASE = "http://localhost:3001/api";

/**
 * Helper: map a “raw” backend Comment (RawComment) → our frontend CommentUI
 */
function mapRawCommentToUI(raw: RawComment): CommentUI {
    return {
        id: raw.comment_id,
        text: raw.comment,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        lecturerName: `${raw.lecturer.first_name} ${raw.lecturer.last_name}`,
    };
}

/**
 * GET /comments
 * Fetch all comments from the backend, return as CommentUI[]
 */
export async function fetchAllComments(): Promise<CommentUI[]> {
    const resp = await axios.get<RawComment[]>(`${API_BASE}/comments`);
    // resp.data is RawComment[]
    return resp.data.map(mapRawCommentToUI);
}

/**
 * GET /comments/:id
 * Fetch one comment by ID, return as CommentUI
 */
export async function fetchCommentById(id: number): Promise<CommentUI> {
    const resp = await axios.get<RawComment>(`${API_BASE}/comments/${id}`);
    return mapRawCommentToUI(resp.data);
}

/**
 * POST /comments
 * Create a new comment. Expects CreateCommentDto:
 *   { comment: string, application_id: number, lecturer_id: number }
 * Returns the newly created comment as CommentUI.
 */
export async function createComment(
    payload: CreateCommentDto
): Promise<CommentUI> {
    // 1) Log the URL we’re about to hit:
    console.log("About to POST to:", `${API_BASE}/comments`);
    // 2) Log the payload we’re sending:
    console.log("Payload:", payload);

    // 3) Send the actual request:
    const resp = await axios.post<RawComment>(`${API_BASE}/comments`, payload);

    // 4) Convert from “raw backend shape” → “frontend UI shape”:
    return mapRawCommentToUI(resp.data);
}

/**
 * PUT /comments/:id
 * Update an existing comment’s text. Expects UpdateCommentDto:
 *   { comment: string }
 * Returns the updated comment as CommentUI.
 */
export async function updateComment(
    id: number,
    payload: UpdateCommentDto
): Promise<CommentUI> {
    const resp = await axios.put<RawComment>(`${API_BASE}/comments/${id}`, payload);
    return mapRawCommentToUI(resp.data);
}

/**
 * DELETE /comments/:id
 * Delete a comment by ID. Returns a { message: string } payload.
 */
export async function deleteComment(id: number): Promise<{ message: string }> {
    const resp = await axios.delete<{ message: string }>(`${API_BASE}/comments/${id}`);
    return resp.data;
}
