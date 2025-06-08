import { api } from "./api";
import { mapRawSkillToUI } from './mappers/skillMapper';
import { SkillUI } from '../types/skillTypes';
import {
    Skill as BackendSkill,
    CreateSkillDto,
    UpdateSkillDto,
} from './api/skillApi';

//
// GET /skills → SkillUI[]
//
export async function fetchAllSkills(): Promise<SkillUI[]> {
    const resp = await api.get<BackendSkill[]>(`/skills`);
    return resp.data.map(rawSkill => mapRawSkillToUI(rawSkill));
}

//
// GET /skills/:id → SkillUI
//
export async function fetchSkillById(id: number): Promise<SkillUI> {
    const resp = await api.get<BackendSkill>(`/skills/${id}`);
    return mapRawSkillToUI(resp.data);
}

//
// POST /skills → SkillUI
//
export async function createSkill(payload: CreateSkillDto): Promise<SkillUI> {
    const resp = await api.post<BackendSkill>(`/skills`, payload);
    return mapRawSkillToUI(resp.data);
}

//
// PUT /skills/:id → SkillUI
//
export async function updateSkill(
    id: number,
    payload: UpdateSkillDto
): Promise<SkillUI> {
    const resp = await api.put<BackendSkill>(
        `/skills/${id}`,
        payload
    );
    return mapRawSkillToUI(resp.data);
}

//
// DELETE /skills/:id
//
export function deleteSkill(id: number) {
    return api.delete<{ message: string }>(`/skills/${id}`);
}

//
// DELETE /skills/:skillId/users/:userId
//
export function removeSkillFromUser(skillId: number, userId: number) {
    return api.delete<{ message: string }>(
        `/skills/${skillId}/users/${userId}`
    );
}
