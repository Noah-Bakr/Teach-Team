export type CommentUI = {
    id: number;             // comment_id
    text: string;           // comment
    createdAt: string;      // ISO datetime
    updatedAt: string;      // ISO datetime
    lecturerName: string;   // “First Last”
    lecturerId: number;
};

export type RankingUI = {
    id: number;             // ranking_id
    ranking: number;
    createdAt: string;      // ISO datetime
    updatedAt: string;      // ISO datetime
    lecturerName: string;   // “First Last”
    lecturerId: number;
};

export type CourseUI = {
    id: number;             // course_id
    code: string;           // course_code
    name: string;           // course_name
    semester: '1' | '2';
    skills: string[];       // array of skill_name
};

// New UserUI (used by applicationMapper)
export type UserUI = {
    id: number;                   // user_id
    username: string;
    firstName: string;
    lastName: string;
    skills: string[];             // array of skill_name
    academicCredentials: string[]; // array of degree_name
};

// New ReviewUI (combines rank + comment per review)
export type ReviewUI = {
    id: number;             // review_id
    rank: number | null;
    comment: string | null;
    reviewedAt: string;     // ISO datetime
    updatedAt: string;      // ISO datetime
    lecturerId: number;
};

export type ApplicationUI = {
    id: number;                   // application_id
    positionType: 'tutor' | 'lab_assistant';
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: string;            // ISO datetime
    selected: boolean;
    availability: 'Full-Time' | 'Part-Time' | 'Not Available';

    user: UserUI;

    course: CourseUI;

    reviews?: ReviewUI[];
};
