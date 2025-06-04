export type ReviewUI = {
    id: number;             // review_id
    rank: number | null;
    comment: string | null;
    reviewedAt: string;     // ISO datetime
    updatedAt: string;      // ISO datetime
    lecturerId: number;
    applicationId: number;
};

export type CourseUI = {
    id: number;
    name: string;
}

export type UserUI = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;

    role: 'admin' | 'lecturer' | 'candidate';

    skills?: string[];
    courses?: CourseUI[];
    previousRoles?: string[];
    academicCredentials?: string[];

    reviews?: ReviewUI[];
};
