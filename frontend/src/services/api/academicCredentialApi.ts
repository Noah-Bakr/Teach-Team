export interface AcademicCredential {
    academic_id: number;
    degree_name: string;
    institution: string;
    start_date: string;      // ISO date
    end_date: string | null; // ISO date or null
    description: string | null;

    users?: Array<{
        user_id: number;
        username: string;
    }>;
}

export interface CreateAcademicCredentialDto {
    degree_name: string;
    institution: string;
    start_date: string;        // "YYYY-MM-DD"
    end_date?: string | null;
    description?: string | null;
}

export interface UpdateAcademicCredentialDto {
    degree_name?: string;
    institution?: string;
    start_date?: string;       // "YYYY-MM-DD"
    end_date?: string | null;
    description?: string | null;
}
