export type UserUI = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;

    role: 'admin' | 'lecturer' | 'candidate';

    // Optional arrays of names only (no nested objects)
    skills?: string[];
    courses?: string[];     // array of courses only for lecturers
    previousRoles?: string[];     // array of previous_role titles
    academicCredentials?: string[]; // array of degree_name
};
