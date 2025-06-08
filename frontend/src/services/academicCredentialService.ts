import { api } from "./api";
import {
    AcademicCredential as BackendCred,
    CreateAcademicCredentialDto,
    UpdateAcademicCredentialDto,
} from './api/academicCredentialApi';

import { mapRawAcademicCredToUI } from './mappers/academicCredentialMapper';
import { AcademicCredentialUI } from '@/types/academicCredentialTypes';

/**
 * GET /academic-credentials → AcademicCredentialUI[]
 */
export async function fetchAllAcademicCredentials(): Promise<AcademicCredentialUI[]> {
    const resp = await api.get<BackendCred[]>(`/academic-credentials`);
    return resp.data.map(raw => mapRawAcademicCredToUI(raw));
}

/**
 * GET /academic-credentials/:id → AcademicCredentialUI
 */
export async function fetchAcademicCredentialById(
    id: number
): Promise<AcademicCredentialUI> {
    const resp = await api.get<BackendCred>(`/academic-credentials/${id}`);
    return mapRawAcademicCredToUI(resp.data);
}

/**
 * POST /academic-credentials → AcademicCredentialUI
 */
export async function createAcademicCredential(
    payload: CreateAcademicCredentialDto
): Promise<AcademicCredentialUI> {
    const resp = await api.post<BackendCred>(`/academic-credentials`, payload);
    return mapRawAcademicCredToUI(resp.data);
}

/**
 * PUT /academic-credentials/:id → AcademicCredentialUI
 */
export async function updateAcademicCredential(
    id: number,
    payload: UpdateAcademicCredentialDto
): Promise<AcademicCredentialUI> {
    const resp = await api.put<BackendCred>(`/academic-credentials/${id}`, payload);
    return mapRawAcademicCredToUI(resp.data);
}

/**
 * DELETE /academic-credentials/:id
 */
export function deleteAcademicCredential(id: number) {
    return api.delete<{ message: string }>(`/academic-credentials/${id}`);
}
