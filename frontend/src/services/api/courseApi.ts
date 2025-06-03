export interface Skill {
    skill_id: number;
    skill_name: string;
}

export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Course {
    course_id: number;
    course_name: string;
    course_code: string;
    semester: '1' | '2';
    skills: Skill[];
    lecturers: User[];
}

//
// DTO for creating a new Course
//
export interface CreateCourseDto {
    course_code: string;
    course_name: string;
    semester: '1' | '2';
    skillIds?: number[];  // optional array of skill_id
}

//
// DTO for updating an existing Course
//
export interface UpdateCourseDto {
    course_code?: string;
    course_name?: string;
    semester?: '1' | '2';
    skillIds?: number[];  // replaces all existing skills
}