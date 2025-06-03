export interface Role {
    role_id: number;
    role_name: 'admin' | 'lecturer' | 'candidate';
    // users?: { user_id: number; username: string; email: string }[];
}

export interface CreateRoleDto {
    role_name: 'admin' | 'lecturer' | 'candidate';
}

export interface UpdateRoleDto {
    role_name?: 'admin' | 'lecturer' | 'candidate';
}
