export type AcademicCredentialUI = {
    id: number;               // maps to academic_id
    degreeName: string;       // maps to degree_name
    institution: string;
    startDate: string;        // ISO date string
    endDate: string | null;   // ISO date string or null
    description: string | null;

    // Optional: a flat list of usernames who hold this credential
    users?: string[];
};
