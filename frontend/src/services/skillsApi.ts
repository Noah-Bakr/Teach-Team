import axios from 'axios';

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
//    GET /skills
//    Fetch all skills
//
export function fetchAllSkills() {
    return axios.get<Skill[]>(`${API_BASE}/skills`);
}

//
//    GET /skills/:id
//    Fetch a single skill by ID
//
export function fetchSkillById(id: number) {
    return axios.get<Skill>(`${API_BASE}/skills/${id}`);
}

//
//    POST /skills
//    Create a new skill
//
export function createSkill(payload: CreateSkillDto) {
    return axios.post<Skill>(`${API_BASE}/skills`, payload);
}

//
//    PUT /skills/:id
//    Update an existing skill by ID
//
export function updateSkill(
    id: number,
    payload: UpdateSkillDto
) {
    return axios.put<Skill>(`${API_BASE}/skills/${id}`, payload);
}

//
//    DELETE /skills/:id
//    Delete a skill by ID
//
export function deleteSkill(id: number) {
    return axios.delete<{ message: string }>(`${API_BASE}/skills/${id}`);
}
