import axios from 'axios';
import {
    AcademicCredential as BackendCred,
    CreateAcademicCredentialDto,
    UpdateAcademicCredentialDto,
} from './api/academicCredentialApi';

import { mapRawAcademicCredToUI } from './mappers/academicCredentialMapper';
import { AcademicCredentialUI } from '../types/academicCredentialTypes';

const API_BASE = 'http://localhost:3001/api';

/**
 * GET /academic-credentials → AcademicCredentialUI[]
 */
export async function fetchAllAcademicCredentials(): Promise<AcademicCredentialUI[]> {
    const resp = await axios.get<BackendCred[]>(`${API_BASE}/academic-credentials`);
    return resp.data.map(raw => mapRawAcademicCredToUI(raw));
}

/**
 * GET /academic-credentials/:id → AcademicCredentialUI
 */
export async function fetchAcademicCredentialById(
    id: number
): Promise<AcademicCredentialUI> {
    const resp = await axios.get<BackendCred>(`${API_BASE}/academic-credentials/${id}`);
    return mapRawAcademicCredToUI(resp.data);
}

/**
 * POST /academic-credentials → AcademicCredentialUI
 */
export async function createAcademicCredential(
    payload: CreateAcademicCredentialDto
): Promise<AcademicCredentialUI> {
    const resp = await axios.post<BackendCred>(`${API_BASE}/academic-credentials`, payload);
    return mapRawAcademicCredToUI(resp.data);
}

/**
 * PUT /academic-credentials/:id → AcademicCredentialUI
 */
export async function updateAcademicCredential(
    id: number,
    payload: UpdateAcademicCredentialDto
): Promise<AcademicCredentialUI> {
    const resp = await axios.put<BackendCred>(`${API_BASE}/academic-credentials/${id}`, payload);
    return mapRawAcademicCredToUI(resp.data);
}

/**
 * DELETE /academic-credentials/:id
 */
export function deleteAcademicCredential(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/academic-credentials/${id}`);
}
