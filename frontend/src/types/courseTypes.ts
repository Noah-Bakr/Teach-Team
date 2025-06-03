export type CourseUI = {
    id: number;
    name: string;
    code: string;
    semester: '1' | '2';

    // an array of skill names
    skills?: string[];

    // an array of lecturer names
    lecturers?: string[];
};