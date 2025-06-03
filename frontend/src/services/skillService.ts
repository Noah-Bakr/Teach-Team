import axios from 'axios';
import { mapRawSkillToUI } from './mappers/skillMapper';
import { SkillUI } from '../types/skillTypes';
import {
    Skill as BackendSkill,
    CreateSkillDto,
    UpdateSkillDto,
} from './api/skillApi';

const API_BASE = 'http://localhost:3001/api';

//
// GET /skills → SkillUI[]
//
export async function fetchAllSkills(): Promise<SkillUI[]> {
    const resp = await axios.get<BackendSkill[]>(`${API_BASE}/skills`);
    return resp.data.map(rawSkill => mapRawSkillToUI(rawSkill));
}

//
// GET /skills/:id → SkillUI
//
export async function fetchSkillById(id: number): Promise<SkillUI> {
    const resp = await axios.get<BackendSkill>(`${API_BASE}/skills/${id}`);
    return mapRawSkillToUI(resp.data);
}

//
// POST /skills → SkillUI
//
export async function createSkill(payload: CreateSkillDto): Promise<SkillUI> {
    const resp = await axios.post<BackendSkill>(`${API_BASE}/skills`, payload);
    return mapRawSkillToUI(resp.data);
}

//
// PUT /skills/:id → SkillUI
//
export async function updateSkill(
    id: number,
    payload: UpdateSkillDto
): Promise<SkillUI> {
    const resp = await axios.put<BackendSkill>(
        `${API_BASE}/skills/${id}`,
        payload
    );
    return mapRawSkillToUI(resp.data);
}

//
// DELETE /skills/:id
//
export function deleteSkill(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/skills/${id}`);
}
