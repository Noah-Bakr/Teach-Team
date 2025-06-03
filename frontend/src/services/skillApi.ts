import axios from 'axios';
import { mapRawSkillToUI } from './mappers/skillMapper';
import { SkillUI } from '../types/skillTypes';

const API_BASE = 'http://localhost:3001/api';

//
//  Front-end shape of User (lecturer or candidate) as returned by the backend
//
export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

//
//  Front-end shape of Course as returned by the backend
//
export interface Course {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
}

//
//   Front-end shape of Skill as returned by the backend
//
export interface Skill {
    skill_id: number;
    skill_name: string;
    users?: User[];
    courses?: Course[];
}

//
//    DTO for creating a new Skill
//    Must match CreateSkillDto on the backend
//
export interface CreateSkillDto {
    skill_name: string;
}

//
//    DTO for updating an existing Skill
//    Must match UpdateSkillDto on the backend
//
export interface UpdateSkillDto {
    skill_name: string;
}

//
// GET /skills → SkillUI[]
//
export async function fetchAllSkills(): Promise<SkillUI[]> {
    const resp = await axios.get<Skill[]>(`${API_BASE}/skills`);
    return resp.data.map(rawSkill => mapRawSkillToUI(rawSkill));
}

//
// GET /skills/:id → SkillUI
//
export async function fetchSkillById(id: number): Promise<SkillUI> {
    const resp = await axios.get<Skill>(`${API_BASE}/skills/${id}`);
    return mapRawSkillToUI(resp.data);
}

//
// POST /skills → SkillUI
//
export async function createSkill(payload: CreateSkillDto): Promise<SkillUI> {
    const resp = await axios.post<Skill>(`${API_BASE}/skills`, payload);
    return mapRawSkillToUI(resp.data);
}

//
// PUT /skills/:id → SkillUI
//
export async function updateSkill(
    id: number,
    payload: UpdateSkillDto
): Promise<SkillUI> {
    const resp = await axios.put<Skill>(
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