//
// Front-end shape of User (partial), for raw.users[]
//
export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

//
// Front-end shape of Course (partial), for raw.courses[]
//
export interface Course {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
}

//
// Raw Skill as returned by GET /skills
//
export interface Skill {
    skill_id: number;
    skill_name: string;
    users: User[];     // array of all users who have that skill
    courses: Course[]; // array of courses requiring that skill
}

//
// DTO for creating a new Skill
//
export interface CreateSkillDto {
    skill_name: string;
}

//
// DTO for updating an existing Skill
//
export interface UpdateSkillDto {
    skill_name: string;
}
