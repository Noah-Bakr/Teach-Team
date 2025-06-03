import axios from 'axios';
import { Application as
        BackendApp, CreateApplicationDto, UpdateApplicationDto
} from './api/applicationApi';
import { mapRawAppToUI } from './mappers/applicationMapper';
import { ApplicationUI } from '../types/applicationTypes';

const API_BASE = 'http://localhost:3001/api';

/**
 * GET /applications → ApplicationUI[]
 */
export async function fetchAllApplications(): Promise<ApplicationUI[]> {
    const resp = await axios.get<BackendApp[]>(`${API_BASE}/applications`);

    // Log the entire array coming back from the server
    console.log("⚡️ fetchAllApplications – raw response.data:", resp.data);

    // If you also want to inspect each individual “rawApp” before mapping:
    const mappedApps = resp.data.map((rawApp, idx) => {
        console.log(`  → rawApp[${idx}]:`, rawApp);
        return mapRawAppToUI(rawApp);
    });

    return mappedApps;
}

/**
 * GET /applications/:id → ApplicationUI
 */
export async function fetchApplicationById(id: number): Promise<ApplicationUI> {
    const resp = await axios.get<BackendApp>(`${API_BASE}/applications/${id}`);
    return mapRawAppToUI(resp.data);
}

/**
 * POST /applications → ApplicationUI
 */
export async function createApplication(
    payload: CreateApplicationDto
): Promise<ApplicationUI> {
    const resp = await axios.post<BackendApp>(`${API_BASE}/applications`, payload);
    return mapRawAppToUI(resp.data);
}

/**
 * PUT /applications/:id → ApplicationUI
 */
export async function updateApplication(
    id: number,
    payload: UpdateApplicationDto
): Promise<ApplicationUI> {
    const resp = await axios.put<BackendApp>(`${API_BASE}/applications/${id}`, payload);
    return mapRawAppToUI(resp.data);
}

/**
 * DELETE /applications/:id
 */
export function deleteApplication(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/applications/${id}`);
}
