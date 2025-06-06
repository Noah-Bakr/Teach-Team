export interface User {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface PreviousRole {
    user_id: number;
    previous_role_id: number;
    previous_role: string;
    company: string;
    start_date: string;        // e.g. "2025-01-01"
    end_date: string | null;   // e.g. "2025-05-01" or null
    description: string | null;

    user: User;
}

export interface CreatePreviousRoleDto {
    previous_role: string;
    company: string;
    start_date: string;        // "YYYY-MM-DD"
    end_date?: string | null;
    description?: string | null;
    user_id: number;
}

export interface UpdatePreviousRoleDto {
    previous_role?: string;
    company?: string;
    start_date?: string;
    end_date?: string | null;
    description?: string | null;
}
