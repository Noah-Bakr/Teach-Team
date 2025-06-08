import { api } from "./api";
import {
    Application as BackendApp,
    CreateApplicationDto,
    UpdateApplicationDto,
} from "./api/applicationApi";
import { mapRawAppToUI } from "./mappers/applicationMapper";
import { ApplicationUI } from "../types/applicationTypes";
//import { ApplicationUI } from "@/types/types";

/** GET /applications → ApplicationUI[] */
export async function fetchAllApplications(): Promise<ApplicationUI[]> {
    const resp = await api.get<BackendApp[]>(`/applications`);
    return resp.data.map(mapRawAppToUI);
}

/** GET /applications/:id → ApplicationUI */
export async function fetchApplicationById(
    id: number
): Promise<ApplicationUI> {
    const resp = await api.get<BackendApp>(`/applications/${id}`);
    return mapRawAppToUI(resp.data);
}



export async function fetchApplicationsByUserId(userId: number): Promise<ApplicationUI[]> {
    const resp = await api.get<BackendApp[]>(`/applications/user/${userId}`);
    return resp.data.map(mapRawAppToUI);
}

// /** GET /user/:userId/applications → ApplicationUI[] */
// export async function fetchApplicationsByUserId(userId: number | string): Promise<ApplicationUI[]> {
//     const resp = await api.get<BackendApp[]>(`/users/${userId}`);
//     return resp.data.map(mapRawAppToUI);
// }

/** POST /applications → ApplicationUI */
export async function createApplication(
    payload: CreateApplicationDto
): Promise<ApplicationUI> {
    const resp = await api.post<BackendApp>(
        `/applications`,
        payload
    );
    return mapRawAppToUI(resp.data);
}

/** PUT /applications/:id → ApplicationUI */
export async function updateApplication(
    id: number,
    payload: UpdateApplicationDto
): Promise<ApplicationUI> {
    const resp = await api.put<BackendApp>(
        `/applications/${id}`,
        payload
    );
    return mapRawAppToUI(resp.data);
}

/** DELETE /applications/:id */
export function deleteApplication(id: number) {
    return api.delete<{ message: string }>(
        `/applications/${id}`
    );
}


