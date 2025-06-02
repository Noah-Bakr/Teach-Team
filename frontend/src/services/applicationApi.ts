import axios from 'axios';
import {
    Application,
    ApplicationUser,
    ApplicationCourse,
    ApplicationComment,
} from '../types/applicationTypes';

const API_BASE = 'http://localhost:3001/api';

/**
 * Transform a single raw “user” object (from backend) into ApplicationUser
 */
function mapRawUserToFrontend(raw: any): ApplicationUser {
    return {
        user_id: raw.user_id,
        username: raw.username,
        email: raw.email,
        // raw.skills is an array of objects { skill_id, skill_name }:
        skills: Array.isArray(raw.skills)
            ? raw.skills.map((s: any) => s.skill_name)
            : [],
    };
}

/**
 * Transform a single raw “course” object into ApplicationCourse
 */
function mapRawCourseToFrontend(raw: any): ApplicationCourse {
    return {
        course_id: raw.course_id,
        course_name: raw.course_name,
        course_code: raw.course_code,
        // raw.semester might come back as a string, so we assert it to '1'|'2'
        semester: raw.semester as '1' | '2',
    };
}

/**
 * If you want to include comments, map them too.
 * Each rawComment should come with:
 *   comment_id, comment, created_at, updated_at, lecturer: { user_id, first_name, last_name, … }
 */
function mapRawCommentToFrontend(raw: any): ApplicationComment {
    return {
        comment_id: raw.comment_id,
        comment: raw.comment,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        lecturer: {
            user_id: raw.lecturer.user_id,
            first_name: raw.lecturer.first_name,
            last_name: raw.lecturer.last_name,
        },
    };
}

/**
 * Map a single raw “application” object (from the backend) to our lean Application interface
 */
function mapRawAppToFrontend(raw: any): Application {
    const user: ApplicationUser = mapRawUserToFrontend(raw.user);
    const course: ApplicationCourse = mapRawCourseToFrontend(raw.course);

    // If comments array exists, map each; otherwise default to []
    const comments: ApplicationComment[] = Array.isArray(raw.comments)
        ? raw.comments.map((c: any) => mapRawCommentToFrontend(c))
        : [];

    return {
        application_id: raw.application_id,
        position_type: raw.position_type,
        status: raw.status,
        applied_at: raw.applied_at,
        selected: raw.selected,
        availability: raw.availability,
        rank: raw.rank,
        user,
        course,
        // only include comments if you care
        ...(comments.length > 0 ? { comments } : {}),
    };
}

/**
 * Fetch all applications, transform them, return typed array
 */
export async function fetchAllApplications(): Promise<Application[]> {
    const resp = await axios.get(`${API_BASE}/applications`);
    const rawApps = resp.data as any[]; // raw from backend
    return rawApps.map(raw => mapRawAppToFrontend(raw));
}

/**
 * Fetch one application by ID, transform, return typed object
 */
export async function fetchApplicationById(
    id: number
): Promise<Application> {
    const resp = await axios.get(`${API_BASE}/applications/${id}`);
    return mapRawAppToFrontend(resp.data);
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
 * POST /application
 * Create a new application.
 */
export function createApplication(payload: CreateApplicationDto) {
    return axios.post<Application>(`${API_BASE}/applications`, payload);
}

/**
 * PUT /application/:id
 * Update an existing application by ID.
 */
export function updateApplication(
    id: number,
    payload: UpdateApplicationDto
) {
    return axios.put<Application>(`${API_BASE}/applications/${id}`, payload);
}

/**
 * DELETE /application/:id
 * Delete an application by ID.
 */
export function deleteApplication(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/applications/${id}`);
}
